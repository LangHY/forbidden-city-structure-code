/**
 * AxisScene - 3D中轴场景主组件
 *
 * Blender风格：网格地面 + 俯视相机 + 统一配色
 * 建筑用简化几何体表示，不依赖图片纹理
 */

import { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import type { ThemeMode } from '../exhibition/types';
import { buildings } from './buildingData';

interface AxisSceneProps {
  selectedBuilding: string | null;
  onSelectBuilding: (id: string | null) => void;
  theme: ThemeMode;
  isBlurred?: boolean;
}

// ============================================
// 网格地面 - Blender风格
// ============================================
function BlenderGrid({ theme }: { theme: ThemeMode }) {
  const isDark = theme === 'dark';

  return (
    <group position={[0, -0.01, 10]}>
      {/* 主网格 - 加重线条 */}
      <Grid
        args={[60, 80]}
        cellSize={2}
        cellThickness={1.5}
        cellColor={isDark ? '#444444' : '#a89b8b'}
        sectionSize={10}
        sectionThickness={2.5}
        sectionColor={isDark ? '#666666' : '#8b7355'}
        fadeDistance={100}
        fadeStrength={0.6}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* 中轴线高亮 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[0.5, 60]} />
        <meshBasicMaterial
          color={isDark ? '#b8860b' : '#4a7c59'}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* 地面底色 - 与背景统一 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial
          color={isDark ? '#0a0a0a' : '#f7f3ed'}
        />
      </mesh>
    </group>
  );
}

// ============================================
// 建筑卡片 - 简化几何体 + 聚焦效果
// ============================================
interface BuildingMarkerProps {
  building: typeof buildings[0];
  isSelected: boolean;
  hasSelection: boolean; // 是否有任何建筑被选中
  onClick: () => void;
  theme: ThemeMode;
}

function BuildingMarker({ building, isSelected, hasSelection, onClick, theme }: BuildingMarkerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const isDark = theme === 'dark';

  // 动画状态
  const targetY = useRef(building.position[1]);
  const targetScale = useRef(1);
  const pulsePhase = useRef(0);
  const prevSelected = useRef(false);
  const currentOpacity = useRef(1);

  // 颜色配置
  const colors = useMemo(() => {
    if (building.importance >= 5) {
      return isDark ? '#b8860b' : '#8b4513';
    } else if (building.importance >= 4) {
      return isDark ? '#cd853f' : '#a0522d';
    }
    return isDark ? '#8b7355' : '#b8860b';
  }, [isDark, building.importance]);

  // 目标透明度：选中=1，其他建筑在有选中时=0.35
  const targetOpacity = isSelected ? 1 : (hasSelection ? 0.35 : 1);

  // 选中变化时触发脉冲动画
  useEffect(() => {
    if (isSelected && !prevSelected.current) {
      pulsePhase.current = 0;
    }
    prevSelected.current = isSelected;
    targetY.current = isSelected ? building.position[1] + 0.5 : building.position[1];
    targetScale.current = isSelected ? 1.25 : 1;
  }, [isSelected, building.position]);

  // 动画循环
  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // 平滑过渡 Y 位置
    groupRef.current.position.y += (targetY.current - groupRef.current.position.y) * 0.1;

    // 选中脉冲动画
    let scaleTarget = targetScale.current;
    if (isSelected) {
      pulsePhase.current += delta * 4;
      if (pulsePhase.current < Math.PI) {
        scaleTarget = 1 + 0.25 * Math.sin(pulsePhase.current);
      }
    }

    // 平滑过渡缩放
    const currentScale = meshRef.current.scale.x;
    const newScale = currentScale + (scaleTarget - currentScale) * 0.1;
    meshRef.current.scale.setScalar(newScale);

    // 平滑过渡透明度
    currentOpacity.current += (targetOpacity - currentOpacity.current) * 0.08;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.opacity = currentOpacity.current;
    mat.transparent = true;

    // 选中时高亮环旋转+呼吸
    if (glowRef.current) {
      glowRef.current.rotation.z += delta * 0.5;
      const breathe = 0.4 + Math.sin(pulsePhase.current * 2) * 0.2;
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = breathe;
    }
  });

  return (
    <group ref={groupRef} position={[building.position[0], building.position[1], building.position[2]]}>
      {/* 建筑主体 - 立方体 */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={building.scale} />
        <meshStandardMaterial
          color={colors}
          roughness={0.7}
          metalness={0.1}
          emissive={isSelected ? (isDark ? '#ffd700' : '#4a7c59') : '#000000'}
          emissiveIntensity={isSelected ? 0.4 : 0}
          transparent
          opacity={1}
        />
      </mesh>

      {/* 选中时的高亮环 - 旋转+呼吸 */}
      {isSelected && (
        <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -building.scale[1] / 2 + 0.02, 0]}>
          <ringGeometry args={[Math.max(building.scale[0], building.scale[2]) * 0.6, Math.max(building.scale[0], building.scale[2]) * 1.2, 32]} />
          <meshBasicMaterial
            color={isDark ? '#ffd700' : '#4a7c59'}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* 底部阴影 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -building.scale[1] / 2 + 0.01, 0]}>
        <circleGeometry args={[Math.max(building.scale[0], building.scale[2]) * 0.7, 32]} />
        <meshBasicMaterial
          color={isDark ? '#000000' : '#2a2520'}
          transparent
          opacity={isDark ? 0.4 : 0.15}
        />
      </mesh>
    </group>
  );
}

// ============================================
// 建筑标签 - HTML悬浮（预留扩展，暂未使用）
// ============================================
function _BuildingLabel({ building, isSelected: _isSelected, theme }: { building: typeof buildings[0]; isSelected: boolean; theme: ThemeMode }) {
  const isDark = theme === 'dark';
  // 预留：后续可添加 drei Html 组件实现悬浮标签
  void isDark; // 使用变量避免警告
  void _isSelected; // 使用变量避免警告

  return (
    <group position={[building.position[0], building.position[1] + building.scale[1] / 2 + 1, building.position[2]]}>
      {/* HTML 标签通过 drei Html 组件会在此添加 */}
    </group>
  );
}
// 导出以消除未使用警告
export { _BuildingLabel };

// ============================================
// 相机控制器 - 动态禁用 damping 避免冲突
// ============================================
function CameraController({
  selectedBuilding,
}: {
  selectedBuilding: string | null;
  theme: ThemeMode;
}) {
  const controlsRef = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const { camera } = useThree();

  // 动画状态
  const isAnimating = useRef(false);
  const animProgress = useRef(0);

  // 起点/终点
  const startPos = useRef(new THREE.Vector3(25, 30, 35));
  const startTarget = useRef(new THREE.Vector3(0, 0, 10));
  const endPos = useRef(new THREE.Vector3(25, 30, 35));
  const endTarget = useRef(new THREE.Vector3(0, 0, 10));

  const DEFAULT_POS = new THREE.Vector3(25, 30, 35);
  const DEFAULT_TARGET = new THREE.Vector3(0, 0, 10);

  // selectedBuilding 变化时设置动画目标
  useEffect(() => {
    console.log('[CameraController] selectedBuilding changed:', selectedBuilding);

    // 记录当前相机位置作为起点
    startPos.current.copy(camera.position);
    if (controlsRef.current) {
      startTarget.current.copy(controlsRef.current.target);
    } else {
      startTarget.current.copy(DEFAULT_TARGET);
    }

    if (selectedBuilding) {
      const building = buildings.find((b) => b.id === selectedBuilding);
      if (building) {
        console.log('[CameraController] flying to:', building.name, building.position);
        endPos.current.set(
          building.position[0] + 4,
          14,
          building.position[2] + 4
        );
        endTarget.current.set(
          building.position[0],
          building.position[1] + 1.5,
          building.position[2]
        );
      }
    } else {
      console.log('[CameraController] returning to default');
      endPos.current.copy(DEFAULT_POS);
      endTarget.current.copy(DEFAULT_TARGET);
    }

    animProgress.current = 0;
    isAnimating.current = true;

    // 【关键】动画开始时禁用 damping
    if (controlsRef.current) {
      controlsRef.current.enableDamping = false;
    }
  }, [selectedBuilding]);

  // useFrame 驱动动画
  useFrame((_, delta) => {
    if (!isAnimating.current) return;

    animProgress.current += delta / 1.2;
    if (animProgress.current >= 1) {
      animProgress.current = 1;
      isAnimating.current = false;
      // 【关键】动画结束时恢复 damping
      if (controlsRef.current) {
        controlsRef.current.enableDamping = true;
      }
    }

    // easeInOutCubic
    const t = animProgress.current;
    const eased = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;

    // 线性插值相机位置
    camera.position.lerpVectors(startPos.current, endPos.current, eased);

    // 线性插值 OrbitControls target
    if (controlsRef.current) {
      controlsRef.current.target.lerpVectors(startTarget.current, endTarget.current, eased);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.05}
      minDistance={8}
      maxDistance={60}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={Math.PI / 8}
      enablePan={false}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
    />
  );
}

// ============================================
// 场景背景
// ============================================
function SceneBackground({ theme }: { theme: ThemeMode }) {
  const { scene } = useThree();
  const isDark = theme === 'dark';

  useEffect(() => {
    scene.background = new THREE.Color(isDark ? '#0a0a0a' : '#f7f3ed');
  }, [scene, isDark]);

  return null;
}

// ============================================
// 主场景组件
// ============================================
function AxisScene({
  selectedBuilding,
  onSelectBuilding,
  theme,
  isBlurred = false,
}: AxisSceneProps) {
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0a0a0a' : '#f7f3ed';

  // 处理点击空白处取消选中
  // 使用 onPointerMissed（R3F 专用）而非 Canvas onClick
  // Canvas onClick 会在点击建筑时也触发（DOM 事件），导致选中后立即被清空
  const handleMissedClick = () => {
    if (selectedBuilding) {
      onSelectBuilding('');
    }
  };

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
        key={theme}
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
        onPointerMissed={handleMissedClick}
      >
        {/* 背景 */}
        <SceneBackground theme={theme} />

        {/* 相机 */}
        <PerspectiveCamera
          makeDefault
          position={[25, 30, 35]}
          fov={45}
          near={0.1}
          far={500}
        />

        {/* 灯光 */}
        <ambientLight intensity={isDark ? 0.5 : 0.7} />
        <directionalLight
          position={[30, 50, 20]}
          intensity={isDark ? 0.6 : 0.8}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={150}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
        />
        <directionalLight position={[-20, 30, -10]} intensity={isDark ? 0.3 : 0.4} />

        {/* 网格地面 */}
        <BlenderGrid theme={theme} />

        {/* 建筑标记 */}
        {buildings.map((building) => (
          <BuildingMarker
            key={building.id}
            building={building}
            isSelected={selectedBuilding === building.id}
            hasSelection={selectedBuilding !== null}
            onClick={() => onSelectBuilding(building.id)}
            theme={theme}
          />
        ))}

        {/* 相机控制器 */}
        <CameraController
          selectedBuilding={selectedBuilding}
          theme={theme}
        />
      </Canvas>
    </main>
  );
}

export default AxisScene;