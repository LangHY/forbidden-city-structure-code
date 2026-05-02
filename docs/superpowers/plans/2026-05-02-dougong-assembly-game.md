# 斗拱拼装游戏 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Exhibition 页面内嵌斗拱拼装游戏——玩家拖拽散开的构件归位，全部归位即通关。

**Architecture:** 游戏模式由 index.tsx 管理的 `gameMode` 状态驱动。DragController 作为 Canvas 内子组件处理 3D 射线拖拽逻辑，GameControls 和 CompletionEffect 为 DOM 层 UI 组件。复用现有 explodedViewConfigs 的 direction/distance 数据作为爆炸位置。

**Tech Stack:** React 19, Three.js, @react-three/fiber (useFrame, useThree), @react-three/drei (OrbitControls), TypeScript, Tailwind CSS, framer-motion

---

## File Structure

```
src/components/exhibition/
├── types.ts                  ← 修改：添加 GameMode 类型
├── config.ts                 ← 修改：添加关卡难度函数
├── index.tsx                 ← 修改：游戏状态管理 + 新组件集成
├── ExhibitionCanvas.tsx      ← 修改：接收 gameMode，渲染 DragController
├── GameControls.tsx          ← 新增：游戏底部控件
├── DragController.tsx        ← 新增：3D 射线拖拽核心
├── CompletionEffect.tsx      ← 新增：通关动画
└── ...existing files (unchanged)
```

---

### Task 1: 添加游戏类型和配置

**Files:**
- Modify: `src/components/exhibition/types.ts:117`
- Modify: `src/components/exhibition/config.ts:453`

- [ ] **Step 1: 在 types.ts 末尾添加游戏类型**

在 `src/components/exhibition/types.ts` 文件末尾追加：

```typescript
/**
 * 游戏模式
 */
export type GameMode = 'exhibit' | 'playing' | 'completed';
```

- [ ] **Step 2: 在 config.ts 末尾添加难度函数**

在 `src/components/exhibition/config.ts` 文件末尾追加：

```typescript
/**
 * 根据构件数返回难度标示
 */
export function getDifficultyLabel(componentCount: number): string {
  if (componentCount <= 12) return '★';
  if (componentCount <= 26) return '★★★';
  if (componentCount <= 34) return '★★★★';
  return '★★★★★';
}
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 4: Commit**

```bash
git add src/components/exhibition/types.ts src/components/exhibition/config.ts
git commit -m "feat(game): add GameMode type and difficulty label function"
```

---

### Task 2: 创建 GameControls 组件

**Files:**
- Create: `src/components/exhibition/GameControls.tsx`

- [ ] **Step 1: 创建 GameControls 组件**

创建 `src/components/exhibition/GameControls.tsx`：

```tsx
/**
 * GameControls - 游戏模式底部控件
 *
 * 展览模式：显示「开始拼装」按钮
 * 游戏中：显示进度 + 重置 + 退出按钮
 * 通关时：隐藏（由 CompletionEffect 接管）
 */

import { memo } from 'react';
import type { GameMode, ThemeMode } from './types';

interface GameControlsProps {
  gameMode: GameMode;
  theme: ThemeMode;
  isBlurred?: boolean;
  placedCount: number;
  totalCount: number;
  onStart: () => void;
  onReset: () => void;
  onExit: () => void;
}

function GameControls({
  gameMode,
  theme,
  isBlurred = false,
  placedCount,
  totalCount,
  onStart,
  onReset,
  onExit,
}: GameControlsProps) {
  const isDark = theme === 'dark';
  const glassClass = isDark ? 'glass-panel-dark' : 'glass-panel';
  const btnColor = isDark
    ? 'text-stone-300 hover:text-emerald-400'
    : 'text-[#74796e] hover:text-[#4a7c59]';
  const textColor = isDark ? 'text-stone-100' : 'text-[#2e3230]';
  const labelColor = isDark ? 'text-emerald-400/70' : 'text-[#4a7c59]/60';

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full px-12 py-8 flex justify-between items-center pointer-events-none ${isBlurred ? 'opacity-50' : ''}`}
      style={{
        filter: isBlurred ? 'blur(12px)' : undefined,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
      {/* 左侧：进度或占位 */}
      <div className="pointer-events-auto">
        {gameMode === 'playing' && (
          <div className={`${glassClass} px-6 py-4 rounded-xl`}>
            <span className={`text-[10px] ${labelColor} tracking-[0.3em] uppercase`}>
              Progress
            </span>
            <div className={`${textColor} font-serif tracking-widest text-lg`}>
              {placedCount} / {totalCount}
            </div>
          </div>
        )}
      </div>

      {/* 右侧：按钮 */}
      <div className="flex gap-4 pointer-events-auto">
        {gameMode === 'exhibit' && (
          <button
            onClick={onStart}
            className={`px-6 py-3 rounded-full ${glassClass} ${btnColor} font-serif tracking-widest transition-all duration-300 hover:scale-105 active:scale-95`}
          >
            开始拼装
          </button>
        )}
        {gameMode === 'playing' && (
          <>
            <button
              onClick={onReset}
              className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
              aria-label="重置"
              title="重新散开"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
            </button>
            <button
              onClick={onExit}
              className={`px-6 py-3 rounded-full ${glassClass} ${btnColor} font-serif tracking-widest transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              退出
            </button>
          </>
        )}
      </div>
    </footer>
  );
}

export default memo(GameControls);
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 3: Commit**

```bash
git add src/components/exhibition/GameControls.tsx
git commit -m "feat(game): add GameControls component"
```

---

### Task 3: 创建 CompletionEffect 组件

**Files:**
- Create: `src/components/exhibition/CompletionEffect.tsx`

- [ ] **Step 1: 创建 CompletionEffect 组件**

创建 `src/components/exhibition/CompletionEffect.tsx`：

```tsx
/**
 * CompletionEffect - 通关祝贺动画
 *
 * 全部构件归位后显示光晕 + 文字
 * 2 秒后自动消失
 */

import { useEffect, useState, memo } from 'react';
import type { ThemeMode } from './types';

interface CompletionEffectProps {
  visible: boolean;
  theme: ThemeMode;
  onComplete: () => void;
}

function CompletionEffect({ visible, theme, onComplete }: CompletionEffectProps) {
  const [show, setShow] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        // 等淡出动画结束后回调
        setTimeout(onComplete, 500);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, onComplete]);

  if (!visible && !show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* 光晕背景 */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(74,124,89,0.3) 0%, transparent 70%)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      {/* 文字 */}
      <div className="relative text-center">
        <p
          className={`text-3xl font-serif tracking-[0.5em] ${
            isDark ? 'text-emerald-400' : 'text-[#4a7c59]'
          }`}
          style={{
            animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          拼装完成！
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default memo(CompletionEffect);
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 3: Commit**

```bash
git add src/components/exhibition/CompletionEffect.tsx
git commit -m "feat(game): add CompletionEffect victory animation"
```

---

### Task 4: 创建 DragController 核心组件

**Files:**
- Create: `src/components/exhibition/DragController.tsx`

这是核心任务。DragController 是 Canvas 内的子组件，封装全部 3D 射线拖拽逻辑。

- [ ] **Step 1: 创建 DragController 骨架**

创建 `src/components/exhibition/DragController.tsx`：

```tsx
/**
 * DragController - 3D 射线拖拽控制器
 *
 * Canvas 内子组件，处理：
 * 1. 射线拾取：鼠标按下时检测命中哪个构件
 * 2. 平面拖拽：在相机平面上拖动构件
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
}

// 吸附阈值
const SNAP_THRESHOLD = 1.5;

export default function DragController({
  children,
  explosionComponents,
  placedPieces,
  onPiecePlaced,
  onDragStart,
  onDragEnd,
  active,
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

  // 目标位置映射（index → 原始位置，即归位目标）
  const targetPositions = useRef(new Map<number, THREE.Vector3>());

  // 归位动画状态（index → { from, to, progress }）
  const snapAnimations = useRef(new Map<number, {
    from: THREE.Vector3;
    to: THREE.Vector3;
    progress: number;
  }>());

  // 初始化目标位置
  useEffect(() => {
    targetPositions.current.clear();
    snapAnimations.current.clear();

    explosionComponents.forEach(({ index, direction, distance }) => {
      const child = children[index];
      if (!child) return;

      // 原始位置 = 当前位置 - 爆炸偏移 = 归位目标
      const dir = new THREE.Vector3(...direction).normalize();
      const currentPos = child.position.clone();
      const originalPos = currentPos.clone().sub(dir.multiplyScalar(distance));
      targetPositions.current.set(index, originalPos);
    });
  }, [children, explosionComponents]);

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

    // 创建拖拽平面：过构件中心，垂直于相机方向
    const cameraDir = new THREE.Vector3();
    camera.getWorldDirection(cameraDir);
    dragPlane.current.setFromNormalAndCoplanarPoint(cameraDir, hit.mesh.position.clone());

    // 计算偏移（鼠标点击点到构件中心的向量）
    const intersectPoint = new THREE.Vector3();
    raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint);
    dragOffset.current.copy(hit.mesh.position.clone().sub(intersectPoint));

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
    const target = targetPositions.current.get(index);

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
        // 弹回原位
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
  }, [onPiecePlaced, onDragEnd]);

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

  // 动画循环：处理归位/弹回动画
  useFrame((_, delta) => {
    snapAnimations.current.forEach((anim, index) => {
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
```

- [ ] **Step 2: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误（DragController 的 props 可能需要根据实际集成调整，先确保编译通过）

- [ ] **Step 3: Commit**

```bash
git add src/components/exhibition/DragController.tsx
git commit -m "feat(game): add DragController with raycasting drag and snap"
```

---

### Task 5: 修改 ExhibitionCanvas 支持游戏模式

**Files:**
- Modify: `src/components/exhibition/ExhibitionCanvas.tsx`

- [ ] **Step 1: 扩展 ExhibitionCanvas props**

找到 `ExhibitionCanvasWithControlsProps` 接口（约第 401 行），添加 `gameMode`：

```typescript
interface ExhibitionCanvasWithControlsProps extends ExtendedExhibitionCanvasProps {
  cameraActions: ReturnType<typeof useCameraControl>;
  slideDirection?: 'up' | 'down' | null;
  isExploded?: boolean;
  gameMode?: 'exhibit' | 'playing' | 'completed';
}
```

- [ ] **Step 2: 在 ExhibitionCanvas props 解构中添加 gameMode**

找到 ExhibitionCanvas 组件的 props 解构（约第 407 行），添加 `gameMode`：

```typescript
function ExhibitionCanvas({
  theme = 'light',
  isBlurred = false,
  chapterId,
  cameraActions,
  slideDirection = null,
  isExploded = false,
  gameMode = 'exhibit',
}: ExhibitionCanvasWithControlsProps) {
```

- [ ] **Step 3: 传递 gameMode 给 GLBModel**

找到 GLBModel 的渲染处（约第 469 行），添加 `gameMode` prop：

```tsx
<GLBModel
  modelId={modelId}
  slideDirection={slideDirection}
  isExploded={isExploded}
  chapterId={chapterId}
  gameMode={gameMode}
/>
```

- [ ] **Step 4: 扩展 GLBModel props**

找到 GLBModel 组件定义（约第 180 行），添加 `gameMode` 和 `onPiecePlaced`：

```typescript
function GLBModel({
  modelId,
  slideDirection,
  isExploded,
  chapterId,
  gameMode,
  onPiecePlaced,
}: {
  modelId: string;
  slideDirection?: 'up' | 'down' | null;
  isExploded?: boolean;
  chapterId?: string;
  gameMode?: 'exhibit' | 'playing' | 'completed';
  onPiecePlaced?: (index: number) => void;
}) {
```

- [ ] **Step 5: 游戏模式下禁用自动旋转**

在 GLBModel 的 `useFrame` 循环中（约第 283 行），找到自动旋转那行：

```typescript
groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
```

改为条件旋转：

```typescript
// 游戏模式下禁用自动旋转，保留展览模式的装饰旋转
if (gameMode !== 'playing') {
  groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
}
```

- [ ] **Step 6: 导入 DragController 并在游戏模式下渲染**

在 ExhibitionCanvas.tsx 顶部添加导入：

```typescript
import DragController from './DragController';
```

在 GLBModel 的 return 语句中（约第 329 行），在 `<primitive>` 之后添加 DragController：

```tsx
return (
  <group ref={groupRef}>
    <primitive object={model} />
    {/* 游戏模式：拖拽控制器 */}
    {gameMode === 'playing' && chapterId && (
      <DragController
        children={model.children}
        explosionComponents={explodedViewConfigs[chapterId]?.components ?? []}
        placedPieces={new Set()} // 由外部传入
        onPiecePlaced={(index) => onPiecePlaced?.(index)}
        onDragStart={() => {}}
        onDragEnd={() => {}}
        active={true}
      />
    )}
  </group>
);
```

注意：这里的 `placedPieces` 需要从外部传入。在下一步中，我们会从 ExhibitionCanvas 传入完整的 placedPieces。

- [ ] **Step 7: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 8: Commit**

```bash
git add src/components/exhibition/ExhibitionCanvas.tsx
git commit -m "feat(game): integrate DragController and game mode into ExhibitionCanvas"
```

---

### Task 6: 在 Exhibition 顶层集成游戏状态

**Files:**
- Modify: `src/components/exhibition/index.tsx`

- [ ] **Step 1: 导入新组件和类型**

在 `src/components/exhibition/index.tsx` 顶部添加导入：

```typescript
import GameControls from './GameControls';
import CompletionEffect from './CompletionEffect';
import type { GameMode } from './types';
import { explodedViewConfigs } from './config'; // 已有，确认存在
```

- [ ] **Step 2: 添加游戏状态**

在本地状态区域（约第 63 行），添加游戏状态：

```typescript
const [gameMode, setGameMode] = useState<GameMode>('exhibit');
const [placedPieces, setPlacedPieces] = useState<Set<number>>(new Set());
```

- [ ] **Step 3: 添加游戏事件处理函数**

在事件处理区域（约第 94 行后），添加：

```typescript
// 游戏：开始拼装
const handleStartGame = useCallback(() => {
  setIsExploded(true);
  setPlacedPieces(new Set());
  setGameMode('playing');
}, []);

// 游戏：重置
const handleResetGame = useCallback(() => {
  setPlacedPieces(new Set());
  // 先合并再爆炸，触发重新散开
  setIsExploded(false);
  requestAnimationFrame(() => setIsExploded(true));
}, []);

// 游戏：退出
const handleExitGame = useCallback(() => {
  setGameMode('exhibit');
  setPlacedPieces(new Set());
  setIsExploded(false);
}, []);

// 游戏：构件归位
const handlePiecePlaced = useCallback((index: number) => {
  setPlacedPieces(prev => {
    const next = new Set(prev);
    next.add(index);
    return next;
  });
}, []);

// 通关动画结束
const handleCompletionDone = useCallback(() => {
  setGameMode('exhibit');
  setIsExploded(false);
  setPlacedPieces(new Set());
}, []);
```

- [ ] **Step 4: 添加通关检测**

在 `handlePiecePlaced` 之后，添加一个 effect 来检测是否全部归位：

```typescript
// 检测是否通关
useEffect(() => {
  if (gameMode !== 'playing') return;
  const config = explodedViewConfigs[activeChapter];
  if (!config) return;

  if (placedPieces.size >= config.components.length) {
    setGameMode('completed');
  }
}, [placedPieces, gameMode, activeChapter]);
```

- [ ] **Step 5: 章节切换时重置游戏**

修改 `handleChapterChangeWithReset`（约第 98 行），添加游戏重置：

```typescript
const handleChapterChangeWithReset = useCallback((chapterId: string) => {
  setIsExploded(false);
  setGameMode('exhibit');
  setPlacedPieces(new Set());
  handleChapterChange(chapterId);
}, [handleChapterChange]);
```

- [ ] **Step 6: 传递 gameMode 给 ExhibitionCanvas**

找到 `<ExhibitionCanvas>` 的 JSX（约第 121 行），添加 `gameMode` 和 `onPiecePlaced`：

```tsx
<ExhibitionCanvas
  theme={theme}
  isBlurred={isMenuOpen}
  chapterId={activeChapter}
  cameraActions={cameraActions}
  slideDirection={slideDirection}
  isExploded={isExploded}
  gameMode={gameMode}
  onPiecePlaced={handlePiecePlaced}
/>
```

注意：ExhibitionCanvas 的 props 接口也需要添加 `onPiecePlaced`，这需要在 Task 5 中一并处理。

- [ ] **Step 7: 替换 BottomControls 为 GameControls（游戏模式下）**

找到 `<BottomControls>` 的 JSX（约第 165 行），替换为条件渲染：

```tsx
{/* 底部控件 - 展览模式用 BottomControls，游戏模式用 GameControls */}
{gameMode === 'exhibit' ? (
  <BottomControls
    artifactOrigin={artifactInfo.name}
    artifactOriginEn={artifactInfo.nameEn}
    onZoom={handleZoom}
    onReset={handleReset}
    onExplodeToggle={explodedViewConfigs[activeChapter] ? handleExplodeToggle : undefined}
    isExploded={isExploded}
    theme={theme}
    isBlurred={isMenuOpen}
  />
) : (
  <GameControls
    gameMode={gameMode}
    theme={theme}
    isBlurred={isMenuOpen}
    placedCount={placedPieces.size}
    totalCount={explodedViewConfigs[activeChapter]?.components.length ?? 0}
    onStart={handleStartGame}
    onReset={handleResetGame}
    onExit={handleExitGame}
  />
)}
```

同时添加游戏模式下隐藏的「开始拼装」按钮。当 `gameMode === 'exhibit'` 且当前章节有爆炸配置时，BottomControls 中需要显示「开始拼装」按钮。

- [ ] **Step 8: 添加 CompletionEffect**

在 JSX 中（装饰元素之前），添加：

```tsx
{/* 通关祝贺 */}
<CompletionEffect
  visible={gameMode === 'completed'}
  theme={theme}
  onComplete={handleCompletionDone}
/>
```

- [ ] **Step 9: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 10: Commit**

```bash
git add src/components/exhibition/index.tsx
git commit -m "feat(game): wire up game state management in Exhibition page"
```

---

### Task 7: 修复 BottomControls 添加「开始拼装」按钮

**Files:**
- Modify: `src/components/exhibition/BottomControls.tsx`

- [ ] **Step 1: 扩展 BottomControlsProps**

在 `src/components/exhibition/types.ts` 的 `BottomControlsProps` 中添加：

```typescript
export interface BottomControlsProps {
  artifactOrigin: string;
  artifactOriginEn: string;
  onZoom?: () => void;
  onReset?: () => void;
  onExplodeToggle?: () => void;
  isExploded?: boolean;
  onStartGame?: () => void;  // 新增
  className?: string;
}
```

- [ ] **Step 2: 在 BottomControls 中添加「开始拼装」按钮**

在 `src/components/exhibition/BottomControls.tsx` 中，找到右侧按钮区域（`flex gap-6` 容器），在爆炸图按钮之前添加：

```tsx
{onStartGame && (
  <button
    onClick={onStartGame}
    className={`px-5 py-2 rounded-full ${glassClass} ${btnColor} font-serif tracking-widest text-sm transition-all duration-300 hover:scale-105 active:scale-95`}
  >
    开始拼装
  </button>
)}
```

同时更新 props 解构，添加 `onStartGame`。

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 4: Commit**

```bash
git add src/components/exhibition/types.ts src/components/exhibition/BottomControls.tsx
git commit -m "feat(game): add start game button to BottomControls"
```

---

### Task 8: 最终集成验证

**Files:**
- Modify: `src/components/exhibition/index.tsx` (if needed)
- Modify: `src/components/exhibition/ExhibitionCanvas.tsx` (if needed)

- [ ] **Step 1: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 2: 验证构建**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 3: 启动开发服务器**

Run: `npm run dev`
打开浏览器访问 Exhibition 页面

- [ ] **Step 4: 手动测试完整流程**

1. 进入 Exhibition 页面 → 底部显示「开始拼装」按钮
2. 点击「开始拼装」→ 模型爆炸散开，底部变为进度 + 重置 + 退出
3. 拖拽构件 → 跟随鼠标在平面上移动
4. 拖到目标位置附近松手 → 吸附归位，进度 +1
5. 拖到远处松手 → 弹回原位
6. 全部归位 → 显示「拼装完成！」祝贺动画
7. 2 秒后自动回到展览模式
8. 点击「重置」→ 重新散开，进度归零
9. 点击「退出」→ 回到展览模式，模型合并
10. 游戏中切换章节 → 自动退出游戏模式
11. 深色/浅色主题下均正常显示

- [ ] **Step 5: Commit（如有修复）**

```bash
git add -A
git commit -m "fix(game): integration fixes from manual testing"
```
