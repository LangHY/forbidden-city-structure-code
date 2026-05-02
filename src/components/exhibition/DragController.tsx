/**
 * DragController - 3D 射线拖拽控制器
 *
 * Canvas 内子组件，处理：
 * 1. 射线拾取：鼠标按下时检测命中哪个构件
 * 2. 平面拖拽：在相机平面上拖动构件（屏幕空间平面）
 * 3. 吸附归位：松手时判断距离，够近则吸附
 * 4. 视觉反馈：拖拽高亮、目标轮廓、归位动画
 */

import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ComponentExplosion } from './types';

interface DragControllerProps {
  /** 模型的 children（构件列表） */
  children: THREE.Object3D[];
  /** 爆炸配置（每个构件的方向和距离） */
  explosionComponents: ComponentExplosion[];
  /** 已归位的构件 index 集合 */
  placedPieces: Set<number>;
  /** 构件归位回调 */
  onPiecePlaced: (index: number) => void;
  /** 拖拽开始回调 */
  onDragStart: (index: number) => void;
  /** 拖拽结束回调 */
  onDragEnd: () => void;
  /** 是否激活（游戏模式） */
  active: boolean;
  /** 当前被拖拽的构件 index（由外部传入，用于冻结爆炸动画） */
  draggedPieceIndex?: number | null;
  /** 构件原始位置映射（index → 爆炸前位置，用于吸附目标） */
  originalPositions?: Map<number, THREE.Vector3>;
}

// 吸附阈值（模型缩放后约 4 单位大小，2.5 约 62%，手感宽松）
const SNAP_THRESHOLD = 2.5;

export default function DragController({
  children,
  explosionComponents,
  placedPieces,
  onPiecePlaced,
  onDragStart,
  onDragEnd,
  active,
  draggedPieceIndex = null,
  originalPositions,
}: DragControllerProps) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const dragPlane = useRef(new THREE.Plane());
  const isDragging = useRef(false);
  const draggedIndex = useRef<number | null>(null);
  const draggedMesh = useRef<THREE.Object3D | null>(null);
  const dragOffset = useRef(new THREE.Vector3());
  const preDragPosition = useRef(new THREE.Vector3());

  // 归位动画状态（index → { from, to, progress }）
  const snapAnimations = useRef(new Map<number, {
    from: THREE.Vector3;
    to: THREE.Vector3;
    progress: number;
  }>());

  // 鼠标坐标转换
  const updateMouse = useCallback((event: MouseEvent) => {
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }, [gl]);

  // 射线检测命中构件
  const hitTest = useCallback((event: MouseEvent): { index: number; mesh: THREE.Object3D; point: THREE.Vector3 } | null => {
    updateMouse(event);
    raycaster.current.setFromCamera(mouse.current, camera);

    // 检测所有未归位的构件
    const targets = children.filter((_, i) => !placedPieces.has(i));
    const intersects = raycaster.current.intersectObjects(targets, true);

    if (intersects.length === 0) return null;

    // 找到命中构件在 children 中的 index
    const hitObject = intersects[0].object;
    let hitChild: THREE.Object3D | null = hitObject;
    // 向上查找到直接 child
    while (hitChild && hitChild.parent && !children.includes(hitChild)) {
      hitChild = hitChild.parent;
    }

    if (!hitChild || !children.includes(hitChild)) return null;

    const index = children.indexOf(hitChild);
    if (placedPieces.has(index)) return null;

    return { index, mesh: hitChild, point: intersects[0].point };
  }, [camera, children, placedPieces, updateMouse]);

  // 鼠标按下：开始拖拽
  const handlePointerDown = useCallback((event: MouseEvent) => {
    if (!active) return;
    // 只响应左键
    if (event.button !== 0) return;

    const hit = hitTest(event);
    if (!hit) return;

    isDragging.current = true;
    draggedIndex.current = hit.index;
    draggedMesh.current = hit.mesh;
    preDragPosition.current = hit.mesh.position.clone();

    // 屏幕空间拖拽平面：用相机的 right 和 up 构建，确保自由 2D 移动
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const cameraRight = new THREE.Vector3();
    camera.getWorldDirection(cameraRight);
    cameraRight.cross(camera.up).normalize();
    const cameraUp = new THREE.Vector3();
    cameraUp.crossVectors(cameraRight, cameraDir).normalize();
    // 平面法线 = 相机方向（平面朝向相机）
    dragPlane.current.setFromNormalAndCoplanarPoint(cameraDir, hit.mesh.position.clone());

    // 计算偏移（鼠标点击点到构件中心的向量）
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint);
    if (intersectPoint) {
      dragOffset.current.copy(hit.mesh.position.clone().sub(intersectPoint));
    }

    onDragStart(hit.index);

    // 禁用 OrbitControls
    event.preventDefault();
  }, [active, hitTest, camera, onDragStart]);

  // 鼠标移动：拖拽构件
  const handlePointerMove = useCallback((event: MouseEvent) => {
    if (!isDragging.current || !draggedMesh.current) return;

    updateMouse(event);
    raycaster.current.setFromCamera(mouse.current, camera);

    const intersectPoint = new THREE.Vector3();
    if (raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint)) {
      draggedMesh.current.position.copy(intersectPoint.add(dragOffset.current));
    }
  }, [camera, updateMouse]);

  // 鼠标松开：判断吸附
  const handlePointerUp = useCallback(() => {
    if (!isDragging.current || draggedIndex.current === null || !draggedMesh.current) return;

    const index = draggedIndex.current;
    const mesh = draggedMesh.current;

    // 吸附目标 = 构件的原始位置（爆炸前）
    const target = originalPositions?.get(index) ?? null;

    if (target) {
      const distance = mesh.position.distanceTo(target);

      if (distance < SNAP_THRESHOLD) {
        // 吸附归位：启动归位动画
        snapAnimations.current.set(index, {
          from: mesh.position.clone(),
          to: target.clone(),
          progress: 0,
        });
        onPiecePlaced(index);
      } else {
        // 弹回拖拽前位置
        snapAnimations.current.set(index, {
          from: mesh.position.clone(),
          to: preDragPosition.current.clone(),
          progress: 0,
        });
      }
    }

    isDragging.current = false;
    draggedIndex.current = null;
    draggedMesh.current = null;
    onDragEnd();
  }, [originalPositions, onPiecePlaced, onDragEnd]);

  // 注册/注销事件监听
  useEffect(() => {
    if (!active) return;

    const canvas = gl.domElement;
    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [active, gl, handlePointerDown, handlePointerMove, handlePointerUp]);

  // 动画循环：处理归位/弹回动画（跳过正在被拖拽的构件）
  useFrame((_, delta) => {
    snapAnimations.current.forEach((anim, index) => {
      // 跳过正在被拖拽的构件
      if (index === draggedPieceIndex) return;

      const mesh = children[index];
      if (!mesh) return;

      const speed = 4.0;
      anim.progress += delta * speed;

      if (anim.progress >= 1) {
        mesh.position.copy(anim.to);
        snapAnimations.current.delete(index);
      } else {
        // easeOutCubic
        const t = 1 - Math.pow(1 - anim.progress, 3);
        mesh.position.lerpVectors(anim.from, anim.to, t);
      }
    });
  });

  return null;
}
