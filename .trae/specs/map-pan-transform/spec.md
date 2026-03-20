# 地图平移布局变换 Spec

## Why
用户希望优化布局变换效果：
1. 缩放动画正常进行（双向缩放）
2. 布局变换时使用平移而非宽度变化，视觉效果更自然
3. 左侧文字栏层级应在地图之上

## What Changes
- 布局变换时地图平移（translateX）而非宽度变化
- 缩放动画保持正常（scaleX和scaleY同时变化）
- 调整z-index确保文字栏在地图之上

## Impact
- Affected specs: map-sink-effect, immersive-map-interaction
- Affected code: axis-map.html (CSS和JavaScript)

## ADDED Requirements

### Requirement: 布局变换平移
布局变换时应使用平移动画。

#### Scenario: 面板显示平移
- **WHEN** 长按触发面板显示
- **THEN** 地图向右平移（translateX）
- **AND** 平移距离为面板宽度（33.333%视口宽度）
- **AND** 平移动画时长500ms

#### Scenario: 面板隐藏平移
- **WHEN** 松开触发面板隐藏
- **THEN** 地图向左平移回原位
- **AND** 平移动画时长500ms

### Requirement: 层级顺序
左侧文字栏应在地图之上。

#### Scenario: z-index设置
- **WHEN** 页面渲染
- **THEN** 文字面板z-index高于地图面板
- **AND** 文字面板覆盖在地图上方

## MODIFIED Requirements

### Requirement: 地图容器定位
地图容器应支持平移变换。

#### Scenario: 定位方式
- **WHEN** 地图处于不同状态
- **THEN** 地图面板始终占据100%宽度
- **AND** 通过translateX控制水平位置
- **AND** 缩放动画正常进行

### Requirement: 面板布局
面板布局应支持覆盖效果。

#### Scenario: 面板定位
- **WHEN** 面板显示
- **THEN** 面板覆盖在地图上方
- **AND** 地图平移露出右侧部分
