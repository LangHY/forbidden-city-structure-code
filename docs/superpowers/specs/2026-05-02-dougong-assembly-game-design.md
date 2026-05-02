# 斗拱拼装游戏 — 设计文档

## 概述

在现有 Exhibition 展览页面中内嵌一个斗拱拼装小游戏。玩家点击「开始拼装」按钮后，当前章节的斗拱模型爆炸散开，玩家通过 3D 拖拽将构件拖回原位，全部归位即通关。游戏与浏览融为一体，无独立的关卡选择页面。

## 核心玩法

- **爆炸图还原**：基于现有 `explodedViewConfigs`，构件从原位散开
- **拖拽归位**：3D 射线拾取 + 平面拖拽，松手时吸附到目标位置
- **归位即通关**：所有构件归位后显示祝贺动画，无计时无评分
- **浏览融合**：左侧章节导航即关卡选择，切换章节即切换关卡

## 技术方案：射线拖拽 + 吸附归位

### 拖拽流程

1. **射线拾取**：鼠标按下时，从相机向鼠标位置发射射线，检测命中哪个构件 mesh
2. **创建拖拽平面**：命中后，以构件中心为原点、垂直于相机方向创建无限平面
3. **拖拽移动**：鼠标移动时，射线与拖拽平面求交，构件跟随交点移动
4. **松手判断**：
   - 距离目标 < 1.5 单位 → 吸附归位，播放平滑动画
   - 距离目标 >= 1.5 单位 → 弹回拖拽前位置

### 吸附动画

复用爆炸图的 `lerpVectors` 模式（反向播放），指数衰减缓动。

### 视觉反馈

- 拖拽中：构件略微放大（scale 1.05），高亮材质
- 接近目标：目标位置显示半透明轮廓提示（用原模型的 clone + 半透明材质渲染在目标位置）
- 成功归位：缩放弹跳动画
- 吸附阈值：1.5 单位（模型缩放后约 4 单位大小，1.5 约为模型尺寸的 37%，手感宽松）

### OrbitControls 共存

拖拽时禁用 OrbitControls，松手后重新启用（参考 AxisScene 的 CameraController 模式）。游戏模式下禁用自动旋转（`groupRef.current.rotation.y` 不再随时间变化），但保留手动轨道旋转。

## 状态管理

### 游戏模式状态

```typescript
type GameMode = 'exhibit' | 'playing' | 'completed';

interface GameState {
  mode: GameMode;
  placedPieces: Set<number>;       // 已归位的构件 index
  draggingPiece: number | null;    // 当前拖拽的构件 index
}
```

### 状态流转

```
展览模式 (exhibit)
  ↓ 点击「开始拼装」
游戏中 (playing) — 模型爆炸散开，构件可拖拽
  ↓ 所有构件归位
通关动画 (completed) — 祝贺效果，2 秒后自动回到 exhibit
```

- 切换章节时自动重置游戏状态为 exhibit
- 无持久化存储（不需要 localStorage）

## UI 组件

### 底部控件栏（GameControls）

展览模式下显示「开始拼装」按钮。游戏中显示「重置」按钮（重新散开）和「退出」按钮。通关时隐藏。

### 进度指示器

游戏中显示 `{已归位}/{总数}` 的进度数字，位于屏幕顶部居中。

### 通关动画（CompletionEffect）

全部归位后显示光晕扩散 + "拼装完成！"文字，2 秒后自动消失。

### 保持不变

- 左侧章节导航（ChapterNav）— 可在游戏中切换章节
- 3D Canvas 灯光、背景、相机
- 主题切换

## 文件结构

```
src/components/exhibition/
├── config.ts                 ← 修改：添加关卡难度元数据
├── types.ts                  ← 修改：添加 GameMode、GameState 类型
├── index.tsx                 ← 修改：添加游戏模式状态管理
├── ExhibitionCanvas.tsx      ← 修改：接收游戏状态，传递给 DragController
├── GameControls.tsx          ← 新增：游戏专用底部控件
├── DragController.tsx        ← 新增：3D 射线拖拽核心逻辑
├── CompletionEffect.tsx      ← 新增：通关祝贺动画
└── ...existing files (unchanged)
```

### 各文件职责

**DragController.tsx**（核心）
- Canvas 内子组件，封装全部 3D 拖拽逻辑
- 射线拾取、平面拖拽、距离判断、吸附动画
- 通过回调通知外部：`onPiecePlaced(index)`, `onDragStart(index)`, `onDragEnd()`
- 管理拖拽状态 refs（避免 re-render）

**GameControls.tsx**
- 纯 UI 组件，根据 gameMode 显示不同按钮
- props: `mode`, `onStart`, `onReset`, `onExit`, `placedCount`, `totalCount`

**CompletionEffect.tsx**
- 通关祝贺动画，使用 framer-motion 或 CSS 动画
- props: `visible`, `onComplete` (动画结束后回调)

**index.tsx（修改）**
- 新增 `gameMode`、`placedPieces` 状态
- `handleStartGame`：切换到 playing，触发动画爆炸
- `handleResetGame`：重置 placedPieces，重新爆炸
- `handleExitGame`：切换回 exhibit，合并模型
- `handlePiecePlaced`：添加到 placedPieces，检查是否全部归位

**ExhibitionCanvas.tsx（修改）**
- 接收 `gameMode` prop
- 游戏模式下渲染 `<DragController>` 替代自动旋转
- 传递 `placedPieces` 用于控制哪些构件已归位

## 关卡数据

复用现有 `explodedViewConfigs`，无需额外关卡配置。构件数即难度：

| 构件数 | 难度标示 |
|--------|----------|
| 7-12   | ★       |
| 20-26  | ★★★    |
| 34+    | ★★★★   |
| 52     | ★★★★★  |

难度标示仅用于 UI 显示（章节导航中可选显示），不影响游戏逻辑。

## 验证方案

1. `npx tsc --noEmit` — TypeScript 编译零错误
2. `npm run build` — 构建成功
3. 手动测试：
   - 进入 Exhibition 页面，点击「开始拼装」→ 模型爆炸散开
   - 拖拽构件 → 跟随鼠标移动
   - 拖到目标位置附近松手 → 吸附归位
   - 拖到远处松手 → 弹回原位
   - 全部归位 → 显示通关动画
   - 点击「重置」→ 重新散开
   - 点击「退出」→ 回到展览模式
   - 游戏中切换章节 → 自动退出游戏模式
   - 深色/浅色主题下均正常显示
