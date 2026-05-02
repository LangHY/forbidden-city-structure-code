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
  /** 每个构件的爆炸距离映射（index → distance），用于动态吸附阈值 */
  explosionDistances?: Map<number, number>;
}

// 默认吸附阈值（回退值）
const DEFAULT_SNAP_THRESHOLD = 3.0;
// 吸附阈值 = 爆炸距离的 40%（爆炸越远，吸附区域越大）
const SNAP_RATIO = 0.4;

export default function DragController({
  children,
  explosionComponents: _explosionComponents,
  placedPieces,
  onPiecePlaced,
  onDragStart,
  onDragEnd,
  active,
  draggedPieceIndex = null,
  originalPositions,
  explosionDistances,
}: DragControllerProps) {
  console.log('[DragController] mounted, active:', active, 'children:', children.length, 'placedPieces:', placedPieces.size, 'originalPositions:', originalPositions?.size);
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const dragPlane = useRef(new THREE.Plane());
  const isDragging = useRef(false);
  const draggedIndex = useRef<number | null>(null);
  const draggedMesh = useRef<THREE.Object3D | null>(null);
  const dragOffset = useRef(new THREE.Vector3());
  const preDragPosition = useRef(new THREE.Vector3());
  const modelGroup = useRef<THREE.Object3D | null>(null);

  // 获取模型组引用（children 的父级）
  useEffect(() => {
    if (children.length > 0 && children[0].parent) {
      modelGroup.current = children[0].parent;
    }
  }, [children]);

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

    if (intersects.length === 0) {
      console.log('[Drag] hitTest: no intersection, targets:', targets.length, 'placed:', [...placedPieces]);
      return null;
    }

    console.log('[Drag] hitTest: found', intersects.length, 'intersections, first object:', intersects[0].object.type, intersects[0].object.name);

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
    if (!hit) {
      console.log('[Drag] hitTest returned null — no piece under cursor');
      return;
    }

    console.log('[Drag] hit piece', hit.index, 'at', hit.point.toArray().map(v => +v.toFixed(2)));
    isDragging.current = true;
    draggedIndex.current = hit.index;
    draggedMesh.current = hit.mesh;
    preDragPosition.current = hit.mesh.position.clone();

    // 拖拽平面：法线 = 相机方向，过构件世界位置
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    const meshWorldPos = new THREE.Vector3();
    hit.mesh.getWorldPosition(meshWorldPos);
    dragPlane.current.setFromNormalAndCoplanarPoint(cameraDir, meshWorldPos);

    // 计算偏移（构件世界位置 - 鼠标世界位置，保持拖拽时相对位置不变）
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint);
    if (intersectPoint) {
      dragOffset.current.copy(meshWorldPos.sub(intersectPoint));
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
      // 世界空间的目标位置
      const worldTarget = intersectPoint.add(dragOffset.current);
      // 转回模型本地空间
      if (modelGroup.current) {
        const localTarget = modelGroup.current.worldToLocal(worldTarget.clone());
        draggedMesh.current.position.copy(localTarget);
      } else {
        draggedMesh.current.position.copy(worldTarget);
      }
    }
  }, [camera, updateMouse]);

  // 鼠标松开：判断吸附
  const handlePointerUp = useCallback(() => {
    if (!isDragging.current || draggedIndex.current === null || !draggedMesh.current) return;

    const index = draggedIndex.current;
    const mesh = draggedMesh.current;

    // 吸附目标 = 构件的原始位置（爆炸前）
    const target = originalPositions?.get(index) ?? null;

    console.log('[Drag] pointerUp piece', index, 'pos', mesh.position.toArray().map(v => +v.toFixed(2)), 'target', target?.toArray().map(v => +v.toFixed(2)), 'hasTarget', !!target);

    if (target) {
      const distance = mesh.position.distanceTo(target);
      // 动态吸附阈值：基于爆炸距离的 40%，最小 DEFAULT_SNAP_THRESHOLD
      const explosionDist = explosionDistances?.get(index) ?? 0;
      const snapThreshold = Math.max(DEFAULT_SNAP_THRESHOLD, explosionDist * SNAP_RATIO);
      console.log('[Drag] distance to target:', distance.toFixed(2), 'threshold:', snapThreshold.toFixed(2), 'explosionDist:', explosionDist.toFixed(2));

      if (distance < snapThreshold) {
        console.log('[Drag] SNAP! piece', index);
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
