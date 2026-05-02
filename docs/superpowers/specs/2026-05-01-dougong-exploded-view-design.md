# 斗拱爆炸图动画交互 — 设计文档

## 概述

在 Exhibition 页面的 3D 斗拱展示中，增加「爆炸图」交互功能。用户点击按钮后，斗拱模型的各个构件沿径向散开，再次点击合并回原位。纯视觉效果，不带标注。

## 核心决策

| 决策项 | 选择 | 理由 |
|--------|------|------|
| 布局方向 | 径向炸开 (Radial) | 视觉冲击力强，适合展示对称结构 |
| 触发方式 | 专用按钮 | 最直观，不干扰现有滚轮/拖拽交互 |
| 动画风格 | 丝滑缓动 (Smooth easeInOut) | 沉稳大气，符合古建筑气质 |
| 标注 | 无 | 纯视觉效果，配合右侧 InfoCard 面板展示信息 |
| 技术方案 | 元数据驱动 | 精确控制每个构件的爆炸方向和距离 |
| 实施范围 | 先做 2-3 种验证 | 验证效果后再推广到全部 23 种 |

## 模型结构要求

当前 GLB 模型为单个合并 Mesh（如 `Mesh.6165`），**无法直接做爆炸图**。

### 期望的 GLB 结构

每种斗拱的 GLB 文件应包含按构件拆分的独立子节点：

```
R1L3.glb (Scene)
├── 网格.6165 (Mesh)    — 构件 1
├── 网格.6166 (Mesh)    — 构件 2
├── 网格.6167 (Mesh)    — 构件 3
├── ...                  — 构件 N
```

节点名称不重要（可以是自动命名），关键是**每个构件是独立 Mesh**。

### Blender 导出要求

1. 每个构件是独立的 Object（非合并 mesh）
2. 导出为 GLB 格式，保持场景层级结构
3. 导出时勾选 "Selected Objects"（只导出选中的斗拱构件）

## 架构设计

### 文件结构

```
src/components/exhibition/
├── ExhibitionCanvas.tsx          ← 修改：集成爆炸图逻辑
├── ExplodedViewButton.tsx        ← 新建：爆炸图触发按钮
├── ExplodedViewManager.tsx       ← 新建：爆炸图核心逻辑组件
├── explodedViewConfig.ts         ← 新建：元数据配置
└── ...existing files
```

### 数据流

```
用户点击按钮
    ↓
ExplodedViewButton → onToggle()
    ↓
ExhibitionCanvas (state: isExploded)
    ↓
ExplodedViewManager
    ├── 读取 explodedViewConfig[chapterId]
    ├── 遍历 GLB scene.children (Mesh 节点)
    ├── 按配置计算每个构件的目标位置
    └── 使用 useFrame + easeInOut 驱动动画
```

### 元数据配置格式

```typescript
// explodedViewConfig.ts

interface ComponentExplosion {
  /** 构件在 GLB scene.children 中的索引 */
  index: number;
  /** 爆炸方向向量（归一化），从中心指向外 */
  direction: [number, number, number];
  /** 爆炸距离（模型坐标系单位） */
  distance: number;
}

interface DougongExplosionConfig {
  /** 斗拱类型 ID（对应 chapter id） */
  chapterId: string;
  /** 模型 ID（对应 GLB 文件名） */
  modelId: string;
  /** 各构件的爆炸配置 */
  components: ComponentExplosion[];
}
```

### 元数据配置示例

```typescript
// R1L3（重栱素方）示例 — 7 个构件
const R1L3Config: DougongExplosionConfig = {
  chapterId: 'zhong-gong-su-fang',
  modelId: 'R1L3',
  components: [
    { index: 0, direction: [0, -1, 0],    distance: 1.5 },  // 底部构件，向下
    { index: 1, direction: [-1, 0, 0],    distance: 1.2 },  // 左侧构件
    { index: 2, direction: [1, 0, 0],     distance: 1.2 },  // 右侧构件
    { index: 3, direction: [0, 0, 1],     distance: 1.0 },  // 前方构件
    { index: 4, direction: [0, -1, 0.5],  distance: 0.8 },  // 小构件
    { index: 5, direction: [0.5, 0, -1],  distance: 0.8 },  // 小构件
    { index: 6, direction: [0, 1, 0],     distance: 1.5 },  // 顶部构件，向上
  ],
};
```

> **注意**：index 对应 GLB 加载后 `scene.children` 数组的顺序。需要先加载模型确认每个构件的实际索引位置，再编写配置。

### 动画实现

使用 `useFrame` + 自定义 easeInOut 插值：

```typescript
// 动画参数
const ANIMATION_DURATION = 0.8; // 秒
const EASE_FUNCTION = easeInOutCubic;

// 每帧更新
useFrame((_, delta) => {
  if (isAnimating) {
    progressRef.current += delta / ANIMATION_DURATION;
    progressRef.current = Math.min(progressRef.current, 1);

    const t = EASE_FUNCTION(progressRef.current);

    components.forEach(({ mesh, originalPos, targetPos }) => {
      mesh.position.lerpVectors(originalPos, targetPos, isExploded ? t : 1 - t);
    });

    if (progressRef.current >= 1) {
      isAnimating = false;
    }
  }
});
```

### 按钮设计

```typescript
// ExplodedViewButton.tsx
// - 位于 BottomControls 区域（与现有缩放/重置按钮并排）
// - 图标：Material Symbols 的 "burst_mode"
// - 文字：「爆炸图」/「合并」
// - 状态切换：isExploded ? "合并" : "爆炸图"
// - 点击时触发 onToggle 回调
```

## 与现有交互的兼容性

| 现有交互 | 爆炸图状态下的行为 |
|----------|-------------------|
| 滚轮切换章节 | 切换时自动合并当前爆炸图，新模型加载后恢复按钮状态 |
| 拖拽旋转 | 正常工作，爆炸状态下旋转可看到不同角度 |
| 缩放/重置 | 正常工作 |
| InfoCard 面板 | 正常显示，不受爆炸图影响 |
| 暗色/亮色主题 | 按钮样式跟随主题 |

## 实施阶段

### Phase 1：基础框架（2-3 种斗拱）

1. 拆分并导出 2-3 种代表性斗拱的 GLB 模型
2. 实现 `explodedViewConfig.ts` 元数据配置
3. 实现 `ExplodedViewManager.tsx` 核心动画逻辑
4. 实现 `ExplodedViewButton.tsx` 触发按钮
5. 集成到 `ExhibitionCanvas.tsx`

### Phase 2：交互完善

6. 处理章节切换时的状态管理
7. 动画细节调优（时长、缓动曲线、距离）

### Phase 3：推广到全部斗拱

8. 拆分导出剩余斗拱模型
9. 编写剩余元数据配置
10. 全量测试

## 验证标准

- [ ] 点击按钮后，构件平滑散开到径向位置
- [ ] 再次点击，构件平滑合并回原位
- [ ] 爆炸状态下可正常旋转观察
- [ ] 切换章节时自动合并，新模型正确加载
- [ ] 动画流畅（60fps），无卡顿
