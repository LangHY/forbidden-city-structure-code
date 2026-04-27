/**
 * ExhibitionCanvas - 3D 展览画布
 *
 * 使用 Three.js 加载 GLB 模型
 * 支持相机缩放和重置控制
 * 支持模型预加载
 */

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import type { ThemeMode } from './types';
import { chapterModelMap, chapters } from './config';

// 是否使用压缩模型（优先尝试加载压缩版本）
const USE_COMPRESSED_MODELS = true;

interface ExtendedExhibitionCanvasProps {
  theme?: ThemeMode;
  isBlurred?: boolean;
  chapterId?: string;
}

/**
 * 相机控制方法接口
 * 暴露给父组件用于控制相机
 */
export interface CameraControls {
  zoomIn: () => void;
  resetView: () => void;
}

// 相机控制动作类型
type CameraControlAction = 'zoomIn' | 'resetView' | 'modelSlideUp' | 'modelSlideDown';

// 全局模型缓存
const modelCache = new Map<string, THREE.Group>();

// 配置 GLTF 加载器（支持 Draco 解码）
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
// 使用公共目录中的 Draco 解码器
dracoLoader.setDecoderPath('/draco/');
dracoLoader.setDecoderConfig({ type: 'js' });
loader.setDRACOLoader(dracoLoader);

/**
 * 预加载模型到缓存
 * 支持压缩模型回退到原始版本
 */
function preloadModel(modelId: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    // 已缓存则直接返回
    if (modelCache.has(modelId)) {
      resolve(modelCache.get(modelId)!);
      return;
    }

    const tryLoad = (path: string, fallbackPath?: string): void => {
      loader.load(
        path,
        (gltf) => {
          const loadedModel = gltf.scene;

          // 计算包围盒
          const box = new THREE.Box3().setFromObject(loadedModel);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());

          // 缩放到合适大小
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 4 / maxDim;
          loadedModel.scale.setScalar(scale);

          // 将模型移动到原点
          loadedModel.position.set(
            -center.x * scale,
            -center.y * scale,
            -center.z * scale
          );

          // 应用材质并缓存 mesh 引用
          loadedModel.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // 克隆一份存入缓存（避免引用问题）
          const clonedModel = loadedModel.clone();
          modelCache.set(modelId, clonedModel);
          resolve(clonedModel);
        },
        undefined,
        (error) => {
          if (fallbackPath) {
            console.warn(`压缩模型加载失败，回退到原始版本: ${modelId}`);
            tryLoad(fallbackPath);
          } else {
            console.error(`模型预加载失败: ${modelId}`, error);
            reject(error);
          }
        }
      );
    };

    // 尝试加载压缩版本，失败则回退到原始版本
    if (USE_COMPRESSED_MODELS) {
      tryLoad(
        `/models/compressed/${modelId}.glb`,
        `/models/structures/${modelId}.glb`
      );
    } else {
      tryLoad(`/models/structures/${modelId}.glb`);
    }
  });
}

/**
 * 预加载相邻章节的模型
 */
export function preloadAdjacentModels(currentChapterId: string) {
  const currentIndex = chapters.findIndex(c => c.id === currentChapterId);

  // 预加载前后各一个模型
  const toPreload: number[] = [];
  if (currentIndex > 0) toPreload.push(currentIndex - 1);
  if (currentIndex < chapters.length - 1) toPreload.push(currentIndex + 1);

  toPreload.forEach(index => {
    const chapterId = chapters[index].id;
    const modelId = chapterModelMap[chapterId];
    if (modelId && !modelCache.has(modelId)) {
      preloadModel(modelId);
    }
  });
}

/**
 * Hook: 获取相机控制方法
 * 在 Canvas 外部使用
 */
export function useCameraControl() {
  const [actions] = useState(() => {
    const listeners = new Set<(action: CameraControlAction) => void>();
    return {
      trigger: (action: CameraControlAction) => {
        listeners.forEach(cb => cb(action));
      },
      subscribe: (callback: (action: CameraControlAction) => void) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
      }
    };
  });

  return actions;
}

/**
 * 场景背景动态更新组件
 * 🚀 性能优化：主题切换时不重建 Canvas，只更新背景色
 */
function SceneBackgroundUpdater({ theme }: { theme: ThemeMode }) {
  const { scene } = useThree();

  useEffect(() => {
    const color = theme === 'dark' ? '#000000' : '#f7f3ed';
    scene.background = new THREE.Color(color);
  }, [scene, theme]);

  return null;
}

// GLB 模型加载组件
function GLBModel({
  modelId,
  slideDirection,
}: {
  modelId: string;
  slideDirection: 'up' | 'down' | null;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<boolean>(false);

  // 动画状态
  const animationRef = useRef({
    targetY: 0,
    currentY: 0,
    opacity: 1,
    targetOpacity: 1,
    isAnimating: false,
  });

  // 🚀 性能优化：缓存 mesh 引用，避免每帧遍历
  const meshesRef = useRef<THREE.Mesh[]>([]);

  // 模型切换时触发滑动动画
  useEffect(() => {
    if (slideDirection) {
      const anim = animationRef.current;

      // 设置初始状态
      if (slideDirection === 'up') {
        anim.currentY = -3;
        anim.targetY = 0;
      } else {
        anim.currentY = 3;
        anim.targetY = 0;
      }
      anim.opacity = 0;
      anim.targetOpacity = 1;
      anim.isAnimating = true;
    }
  }, [slideDirection, modelId]);

  // 加载模型（优先从缓存获取）
  useEffect(() => {
    setError(false);

    // 检查缓存
    const cached = modelCache.get(modelId);
    if (cached) {
      // 克隆缓存的模型，避免多个组件共享同一引用
      const clonedModel = cached.clone();
      setModel(clonedModel);

      // 🚀 性能优化：缓存 mesh 引用
      meshesRef.current = [];
      clonedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshesRef.current.push(child);
        }
      });
      return;
    }

    // 缓存中没有则加载
    preloadModel(modelId)
      .then(loadedModel => {
        const clonedModel = loadedModel.clone();
        setModel(clonedModel);

        // 🚀 性能优化：缓存 mesh 引用
        meshesRef.current = [];
        clonedModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            meshesRef.current.push(child);
          }
        });
      })
      .catch((err) => {
        console.error('Failed to load model:', modelId, err);
        setError(true);
      });
  }, [modelId]);

  // 动画循环 - 优化版本
  useFrame((state) => {
    if (!groupRef.current || !model) return;

    const anim = animationRef.current;
    const ease = 0.1;

    // 平滑插值
    anim.currentY += (anim.targetY - anim.currentY) * ease;
    anim.opacity += (anim.targetOpacity - anim.opacity) * ease;

    // 检测动画是否完成
    const isDone = Math.abs(anim.currentY - anim.targetY) < 0.01;
    if (isDone) {
      anim.currentY = anim.targetY;
      anim.isAnimating = false;
    }

    // 应用变换
    groupRef.current.position.y = anim.currentY;
    groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;

    // 🚀 性能优化：只更新缓存的 mesh，不再遍历整个模型
    // 仅在动画进行中或透明度未达到目标时更新
    if (!isDone || anim.targetOpacity !== 1) {
      meshesRef.current.forEach(mesh => {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.transparent = true;
        mat.opacity = anim.opacity;
      });
    }
  });

  // 错误状态显示占位
  if (error) {
    return <LoadingPlaceholder />;
  }

  // 加载中显示占位
  if (!model) {
    return <LoadingPlaceholder />;
  }

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

// 加载中占位
function LoadingPlaceholder() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4a7c59" wireframe />
    </mesh>
  );
}

/**
 * 相机控制器内部组件
 * 响应外部控制事件
 */
function CameraController({
  onAction
}: {
  onAction: (callback: (action: CameraControlAction) => void) => () => void
}) {
  const { camera } = useThree();
  const orbitControlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  // 初始相机位置
  const initialPosition = useRef(new THREE.Vector3(6, 4, 6));

  useEffect(() => {
    const unsubscribe = onAction((action) => {
      switch (action) {
        case 'zoomIn':
          // 向前移动相机 20%
          const direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
          const distance = camera.position.length() * 0.2;
          camera.position.addScaledVector(direction, distance);
          if (orbitControlsRef.current) {
            orbitControlsRef.current.update();
          }
          break;
        case 'resetView':
          camera.position.copy(initialPosition.current);
          if (orbitControlsRef.current) {
            orbitControlsRef.current.target.set(0, 0, 0);
            orbitControlsRef.current.update();
          }
          break;
      }
    });

    return unsubscribe;
  }, [onAction, camera]);

  return (
    <OrbitControls
      ref={orbitControlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={2}
      maxDistance={15}
      enablePan={false}
      enableZoom={false}
      autoRotate={false}
    />
  );
}

interface ExhibitionCanvasWithControlsProps extends ExtendedExhibitionCanvasProps {
  cameraActions: ReturnType<typeof useCameraControl>;
  slideDirection?: 'up' | 'down' | null;
}

function ExhibitionCanvas({
  theme = 'light',
  isBlurred = false,
  chapterId,
  cameraActions,
  slideDirection = null,
}: ExhibitionCanvasWithControlsProps) {
  // 暗色模式使用纯黑背景
  const bgColor = theme === 'dark' ? '#000000' : '#f7f3ed';
  const isDark = theme === 'dark';

  // 获取模型 ID
  const modelId = chapterId ? chapterModelMap[chapterId] : 'R1L1';

  return (
    <main
      className="fixed inset-0 z-0"
      style={{
        filter: isBlurred ? 'blur(12px)' : undefined,
        opacity: isBlurred ? 0.5 : 1,
        backgroundColor: bgColor,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out, background-color 0.3s ease',
      }}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false,
        }}
        dpr={[1, 2]}
      >
        {/* 🚀 场景背景动态更新 - 主题切换不重建 Canvas */}
        <SceneBackgroundUpdater theme={theme} />

        <PerspectiveCamera makeDefault position={[6, 4, 6]} fov={45} />

        {/* 环境光 - 暗色模式降低强度 */}
        <ambientLight intensity={isDark ? 0.3 : 0.5} />

        {/* 主光源 */}
        <directionalLight
          position={[10, 10, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* 补光 */}
        <directionalLight position={[-5, 5, -5]} intensity={0.4} />
        <directionalLight position={[0, -5, 0]} intensity={0.2} />

        {/* 半球光 - 替代 Environment */}
        <hemisphereLight
          args={[isDark ? '#1a1a2e' : '#f5f5dc', isDark ? '#0a0a0a' : '#8b7355', 0.5]}
        />

        {/* 模型 */}
        {modelId ? (
          <GLBModel modelId={modelId} slideDirection={slideDirection} />
        ) : (
          <LoadingPlaceholder />
        )}

        {/* 控制器 */}
        <CameraController onAction={cameraActions.subscribe} />
      </Canvas>
    </main>
  );
}

export default ExhibitionCanvas;
