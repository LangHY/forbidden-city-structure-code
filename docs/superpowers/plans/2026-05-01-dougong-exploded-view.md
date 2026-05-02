# 斗拱爆炸图动画交互 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Exhibition 页面增加径向爆炸图交互，用户点击按钮后斗拱构件沿径向散开，再次点击合并回原位。

**Architecture:** 爆炸逻辑嵌入现有 GLBModel 组件的 useFrame 循环中，元数据配置定义每个构件的爆炸方向和距离。isExploded 状态由 Exhibition 顶层管理，通过 props 传递到 Canvas 和 BottomControls。

**Tech Stack:** React 19, Three.js, @react-three/fiber (useFrame, useThree), TypeScript, Tailwind CSS, Material Symbols

---

## File Structure

```
src/components/exhibition/
├── types.ts                      ← 修改：添加爆炸图相关类型
├── config.ts                     ← 修改：添加爆炸图元数据配置
├── ExhibitionCanvas.tsx          ← 修改：GLBModel 接收 isExploded，驱动爆炸动画
├── BottomControls.tsx            ← 修改：添加爆炸图按钮
├── index.tsx                     ← 修改：管理 isExploded 状态
└── ...existing files (unchanged)
```

---

### Task 1: 添加类型定义和元数据配置

**Files:**
- Modify: `src/components/exhibition/types.ts:92`
- Modify: `src/components/exhibition/config.ts:135`

- [ ] **Step 1: 在 types.ts 末尾添加爆炸图类型**

在 `src/components/exhibition/types.ts` 文件末尾（第 92 行后）追加：

```typescript
/**
 * 爆炸图 — 单个构件的爆炸参数
 */
export interface ComponentExplosion {
  /** 构件在 GLB scene.children 中的索引 */
  index: number;
  /** 爆炸方向向量（归一化），从中心指向外 */
  direction: [number, number, number];
  /** 爆炸距离（模型坐标系单位） */
  distance: number;
}

/**
 * 爆炸图 — 单种斗拱的完整配置
 */
export interface DougongExplosionConfig {
  /** 斗拱类型 ID（对应 chapter id） */
  chapterId: string;
  /** 模型 ID（对应 GLB 文件名） */
  modelId: string;
  /** 各构件的爆炸配置 */
  components: ComponentExplosion[];
}
```

- [ ] **Step 2: 在 config.ts 末尾添加爆炸图配置**

在 `src/components/exhibition/config.ts` 文件末尾（第 135 行后）追加。先导入新类型：

在文件顶部的 import 区域（第 5 行附近）添加：

```typescript
import type { Chapter, DougongComponent, ComponentExplosion, DougongExplosionConfig } from './types';
```

然后在文件末尾追加：

```typescript
/**
 * 爆炸图元数据配置
 * index 对应 GLB 加载后 scene.children 数组的顺序
 * direction 是归一化向量，从模型中心指向外
 * distance 是爆炸偏移量（模型坐标系单位）
 */
export const explodedViewConfigs: Record<string, DougongExplosionConfig> = {
  // R1L3（重栱素方）— 7 个构件
  // 注意：index 值需要在模型加载后通过 console.log 确认实际顺序
  'zhong-gong-su-fang': {
    chapterId: 'zhong-gong-su-fang',
    modelId: 'R1L3',
    components: [
      { index: 0, direction: [0, -1, 0],   distance: 1.5 },   // 底部构件，向下
      { index: 1, direction: [-1, 0, 0],   distance: 1.2 },   // 左侧构件
      { index: 2, direction: [1, 0, 0],    distance: 1.2 },   // 右侧构件
      { index: 3, direction: [0, 0, 1],    distance: 1.0 },   // 前方构件
      { index: 4, direction: [0, -1, 0.5], distance: 0.8 },   // 小构件
      { index: 5, direction: [0.5, 0, -1], distance: 0.8 },   // 小构件
      { index: 6, direction: [0, 1, 0],    distance: 1.5 },   // 顶部构件，向上
    ],
  },
};
```

- [ ] **Step 3: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 4: Commit**

```bash
git add src/components/exhibition/types.ts src/components/exhibition/config.ts
git commit -m "feat(exploded-view): add explosion types and R1L3 metadata config"
```

---

### Task 2: 修改 GLBModel 支持爆炸动画

**Files:**
- Modify: `src/components/exhibition/ExhibitionCanvas.tsx:180-311`

这是核心任务。需要修改 `ExhibitionCanvas.tsx` 中的 `GLBModel` 组件，让它接收 `isExploded` prop 并在 useFrame 循环中驱动爆炸动画。

- [ ] **Step 1: 添加 imports**

在 `src/components/exhibition/ExhibitionCanvas.tsx` 文件顶部（第 1-18 行区域），确认以下 import 存在。如果 `useRef` 和 `useEffect` 已经导入则跳过。确保导入 `ComponentExplosion` 类型和 `explodedViewConfigs`：

```typescript
import { useRef, useEffect, useState, useCallback } from 'react';
import type { ComponentExplosion } from './types';
import { explodedViewConfigs } from './config';
```

- [ ] **Step 2: 扩展 GLBModel 的 props 接口**

找到 `GLBModel` 组件的 props 解构（约第 180-186 行），当前是：

```typescript
function GLBModel({ modelId, slideDirection }: { modelId: string; slideDirection?: 'up' | 'down' | null }) {
```

修改为：

```typescript
function GLBModel({ modelId, slideDirection, isExploded, chapterId }: {
  modelId: string;
  slideDirection?: 'up' | 'down' | null;
  isExploded?: boolean;
  chapterId?: string;
}) {
```

- [ ] **Step 3: 添加爆炸动画的 refs**

在 `GLBModel` 组件内部，现有的 refs 声明区域（约第 187-201 行）之后，添加爆炸动画相关的 refs：

```typescript
  // 爆炸图动画 refs
  const explosionProgressRef = useRef(0);
  const explosionPartsRef = useRef<Array<{
    mesh: THREE.Object3D;
    originalPosition: THREE.Vector3;
    targetPosition: THREE.Vector3;
  }>>([]);
  const isExplodedRef = useRef(false);
```

- [ ] **Step 4: 添加爆炸配置初始化 effect**

在 `GLBModel` 组件中，模型加载的 useEffect（约第 223-261 行）之后，添加一个新的 effect，用于在模型加载后初始化爆炸配置：

```typescript
  // 初始化爆炸配置：模型加载后记录每个构件的原始位置和目标位置
  useEffect(() => {
    if (!model || !chapterId) return;

    const config = explodedViewConfigs[chapterId];
    if (!config) {
      explosionPartsRef.current = [];
      return;
    }

    const children = model.children;
    const parts: typeof explosionPartsRef.current = [];

    config.components.forEach(({ index, direction, distance }) => {
      const child = children[index];
      if (!child) return;

      const dir = new THREE.Vector3(...direction).normalize();
      const originalPos = child.position.clone();
      const targetPos = originalPos.clone().add(dir.multiplyScalar(distance));

      parts.push({
        mesh: child,
        originalPosition: originalPos,
        targetPosition: targetPos,
      });
    });

    explosionPartsRef.current = parts;
    explosionProgressRef.current = 0;
    isExplodedRef.current = false;
  }, [model, chapterId]);
```

- [ ] **Step 5: 在 useFrame 循环中添加爆炸动画逻辑**

找到 `GLBModel` 的 `useFrame` 循环（约第 264-294 行）。当前循环处理 slide-in 动画和持续旋转。需要在旋转逻辑之前添加爆炸动画逻辑。

在 `useFrame((state) => {` 之后、现有动画逻辑之前，添加：

```typescript
    // 爆炸图动画
    const parts = explosionPartsRef.current;
    if (parts.length > 0) {
      const targetProgress = isExploded ? 1 : 0;
      const currentProgress = explosionProgressRef.current;

      if (Math.abs(currentProgress - targetProgress) > 0.001) {
        // easeInOutCubic 缓动
        const speed = 2.5; // 越大越快
        const newProgress = currentProgress + (targetProgress - currentProgress) * Math.min(1, delta * speed);
        explosionProgressRef.current = newProgress;

        // 应用 easeInOutCubic
        const t = newProgress < 0.5
          ? 4 * newProgress * newProgress * newProgress
          : 1 - Math.pow(-2 * newProgress + 2, 3) / 2;

        parts.forEach(({ mesh, originalPosition, targetPosition }) => {
          mesh.position.lerpVectors(originalPosition, targetPosition, t);
        });
      }
    }
```

- [ ] **Step 6: 同步 isExploded ref**

在 `useFrame` 循环的开头（刚添加的爆炸动画代码之前），添加 ref 同步：

```typescript
    isExplodedRef.current = isExploded ?? false;
```

- [ ] **Step 7: 更新 ExhibitionCanvas 传递新 props**

找到 `ExhibitionCanvas` 组件中渲染 `<GLBModel>` 的地方（约第 420-425 行），当前类似：

```tsx
<GLBModel modelId={modelId} slideDirection={slideDirection} />
```

修改为：

```tsx
<GLBModel
  modelId={modelId}
  slideDirection={slideDirection}
  isExploded={isExploded}
  chapterId={chapterId}
/>
```

同时更新 `ExhibitionCanvasWithControlsProps` 接口（约第 378-381 行），添加 `isExploded`：

```typescript
interface ExhibitionCanvasWithControlsProps extends ExtendedExhibitionCanvasProps {
  cameraActions: ReturnType<typeof useCameraControl>;
  slideDirection?: 'up' | 'down' | null;
  isExploded?: boolean;
}
```

在 `ExhibitionCanvas` 的 props 解构中添加 `isExploded`：

```typescript
export default function ExhibitionCanvas({
  theme = 'light',
  isBlurred = false,
  chapterId,
  cameraActions,
  slideDirection,
  isExploded = false,
}: ExhibitionCanvasWithControlsProps) {
```

- [ ] **Step 8: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 9: Commit**

```bash
git add src/components/exhibition/ExhibitionCanvas.tsx
git commit -m "feat(exploded-view): add explosion animation to GLBModel"
```

---

### Task 3: 添加爆炸图按钮到底部控制栏

**Files:**
- Modify: `src/components/exhibition/BottomControls.tsx:10-14, 108-125`
- Modify: `src/components/exhibition/types.ts:68-74`

- [ ] **Step 1: 扩展 BottomControlsProps 类型**

在 `src/components/exhibition/types.ts` 中，找到 `BottomControlsProps` 接口（约第 68-74 行），添加 `onExplodeToggle` 和 `isExploded`：

```typescript
export interface BottomControlsProps {
  artifactOrigin: string;
  artifactOriginEn: string;
  onZoom?: () => void;
  onReset?: () => void;
  onExplodeToggle?: () => void;
  isExploded?: boolean;
  className?: string;
}
```

- [ ] **Step 2: 更新 BottomControls props 解构**

在 `src/components/exhibition/BottomControls.tsx` 中，找到 `ExtendedBottomControlsProps` 接口（约第 10-14 行），确认它 extends 了 `BottomControlsProps`（已有）。然后找到 props 解构处，添加新 prop：

找到类似这样的解构：

```typescript
export default function BottomControls({
  artifactOrigin,
  artifactOriginEn,
  onZoom,
  onReset,
  className,
  theme = 'light',
  isBlurred = false,
  showZoom = true,
}: ExtendedBottomControlsProps) {
```

修改为：

```typescript
export default function BottomControls({
  artifactOrigin,
  artifactOriginEn,
  onZoom,
  onReset,
  onExplodeToggle,
  isExploded = false,
  className,
  theme = 'light',
  isBlurred = false,
  showZoom = true,
}: ExtendedBottomControlsProps) {
```

- [ ] **Step 3: 添加爆炸图按钮**

在 `src/components/exhibition/BottomControls.tsx` 中，找到右侧按钮区域（约第 108 行的 `flex gap-6` 容器）。在 Zoom 按钮和 Reset 按钮之间，添加爆炸图按钮。

找到这段代码（约第 110-116 行）：

```tsx
{showZoom && (
  <button
    onClick={onZoom}
    className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
    aria-label="放大"
  >
    <ZoomInIcon className="w-4 h-4" />
  </button>
)}
```

在这段代码**之后**、Reset 按钮**之前**，插入：

```tsx
{onExplodeToggle && (
  <button
    onClick={onExplodeToggle}
    className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
    aria-label={isExploded ? '合并' : '爆炸图'}
    title={isExploded ? '合并' : '爆炸图'}
  >
    <span className="material-symbols-outlined text-base">
      {isExploded ? 'compress' : 'burst_mode'}
    </span>
  </button>
)}
```

- [ ] **Step 4: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 5: Commit**

```bash
git add src/components/exhibition/types.ts src/components/exhibition/BottomControls.tsx
git commit -m "feat(exploded-view): add explode toggle button to BottomControls"
```

---

### Task 4: 在 Exhibition 顶层集成状态管理

**Files:**
- Modify: `src/components/exhibition/index.tsx:60-62, 111-117, 154-161`

- [ ] **Step 1: 添加 isExploded 状态**

在 `src/components/exhibition/index.tsx` 中，找到本地 state 声明区域（约第 60-62 行）：

```typescript
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
```

在其后添加：

```typescript
  const [isExploded, setIsExploded] = useState(false);
```

- [ ] **Step 2: 添加 toggle handler**

在 `src/components/exhibition/index.tsx` 中，找到 `handleZoom` 和 `handleReset` 的定义（约第 86-89 行）附近，添加：

```typescript
  const handleExplodeToggle = useCallback(() => {
    setIsExploded(prev => !prev);
  }, []);
```

- [ ] **Step 3: 章节切换时重置爆炸状态**

在 `src/components/exhibition/index.tsx` 中，找到 `handleChapterChange` 的定义（约第 44 行）：

```typescript
  const handleChapterChange = goToChapter;
```

在其后添加一个 wrapper，确保切换章节时重置爆炸状态：

```typescript
  const handleChapterChangeWithReset = useCallback((chapterId: string) => {
    setIsExploded(false);
    goToChapter(chapterId);
  }, [goToChapter]);
```

然后将所有使用 `handleChapterChange` 的地方替换为 `handleChapterChangeWithReset`。找到 `<ChapterNav>` 组件的 `onChange` prop 和 `<ExhibitionNav>` 中的相关引用，替换为新的 handler。

- [ ] **Step 4: 传递 props 到 ExhibitionCanvas**

找到 `<ExhibitionCanvas>` 的 JSX（约第 111-117 行），添加 `isExploded` prop：

```tsx
<ExhibitionCanvas
  theme={theme}
  isBlurred={isMenuOpen}
  chapterId={activeChapter}
  cameraActions={cameraActions}
  slideDirection={slideDirection}
  isExploded={isExploded}
/>
```

- [ ] **Step 5: 传递 props 到 BottomControls**

找到 `<BottomControls>` 的 JSX（约第 154-161 行），添加新 props：

```tsx
<BottomControls
  artifactOrigin={artifactInfo.name}
  artifactOriginEn={artifactInfo.nameEn}
  onZoom={handleZoom}
  onReset={handleReset}
  onExplodeToggle={handleExplodeToggle}
  isExploded={isExploded}
  theme={theme}
  isBlurred={isMenuOpen}
/>
```

- [ ] **Step 6: 验证 TypeScript 编译**

Run: `npx tsc --noEmit`
Expected: 零错误

- [ ] **Step 7: Commit**

```bash
git add src/components/exhibition/index.tsx
git commit -m "feat(exploded-view): wire up isExploded state in Exhibition page"
```

---

### Task 5: 替换 R1L3 模型并验证

**Files:**
- Replace: `public/models/structures/R1L3.glb`（用用户导出的多 mesh 版本替换）
- Replace: `public/models/compressed/R1L3.glb`（可选，如果用 Draco 压缩版本）

- [ ] **Step 1: 复制新模型文件**

将用户导出的 `/Users/lang/Downloads/FBX_4136/R1L3.glb` 复制到项目中：

```bash
cp /Users/lang/Downloads/FBX_4136/R1L3.glb public/models/structures/R1L3.glb
```

- [ ] **Step 2: 验证模型结构**

Run: `npx @gltf-transform/cli inspect public/models/structures/R1L3.glb`
Expected: 输出中 MESHES 部分显示多个独立 Mesh（7 个）

- [ ] **Step 3: 添加调试日志确认构件索引**

临时在 `ExhibitionCanvas.tsx` 的模型加载 effect 中（约第 240 行，模型加载成功后），添加：

```typescript
console.log('Model children:', model.children.map((c, i) => `${i}: ${c.name}`));
```

- [ ] **Step 4: 启动开发服务器并测试**

Run: `npm run dev`

打开浏览器访问 `http://localhost:5173`，进入 Exhibition 页面，打开浏览器控制台，查看日志输出确认构件索引。

- [ ] **Step 5: 根据实际索引调整配置**

对比控制台输出的索引和 `explodedViewConfigs` 中的配置，如果 index 不匹配，修改 `config.ts` 中的 index 值。

- [ ] **Step 6: 测试爆炸图交互**

1. 点击底部「爆炸图」按钮 → 构件应平滑散开
2. 再次点击「合并」→ 构件应平滑合并回原位
3. 爆炸状态下拖拽旋转 → 应能正常旋转观察
4. 滚轮切换到下一章 → 爆炸状态应自动重置

- [ ] **Step 7: 删除调试日志**

删除 Step 3 添加的 `console.log`。

- [ ] **Step 8: Commit**

```bash
git add public/models/structures/R1L3.glb src/components/exhibition/ExhibitionCanvas.tsx src/components/exhibition/config.ts
git commit -m "feat(exploded-view): replace R1L3 model with multi-mesh version and verify"
```

---

### Task 6: 动画调优和边界情况处理

**Files:**
- Modify: `src/components/exhibition/ExhibitionCanvas.tsx`

- [ ] **Step 1: 处理没有爆炸配置的模型**

当用户浏览到没有爆炸配置的斗拱类型时，按钮应该隐藏。在 `src/components/exhibition/index.tsx` 中，找到 `<BottomControls>` 的 `onExplodeToggle` prop，改为条件传递：

```tsx
<BottomControls
  ...
  onExplodeToggle={explodedViewConfigs[activeChapter] ? handleExplodeToggle : undefined}
  isExploded={isExploded}
  ...
/>
```

需要在 `index.tsx` 顶部导入 `explodedViewConfigs`：

```typescript
import { explodedViewConfigs } from './config';
```

- [ ] **Step 2: 切换到无配置章节时重置爆炸状态**

在 Task 4 Step 3 创建的 `handleChapterChangeWithReset` 中，已经有 `setIsExploded(false)` 的逻辑，这已经覆盖了这个场景。确认逻辑正确即可。

- [ ] **Step 3: 验证连续快速点击**

快速连续点击爆炸/合并按钮，确认动画不会卡死或跳帧。如果存在问题，在 useFrame 中添加动画锁：

在 `GLBModel` 组件的 useFrame 循环中，爆炸动画逻辑已经有 `Math.abs(currentProgress - targetProgress) > 0.001` 的判断，这足以处理连续点击——动画会自然地从当前位置向新目标插值。

- [ ] **Step 4: 验证 TypeScript 编译和构建**

Run: `npx tsc --noEmit && npm run build`
Expected: 零错误，构建成功

- [ ] **Step 5: Commit**

```bash
git add src/components/exhibition/index.tsx src/components/exhibition/ExhibitionCanvas.tsx
git commit -m "feat(exploded-view): handle edge cases and polish animation"
```
