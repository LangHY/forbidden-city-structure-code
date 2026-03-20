# 动画并行执行优化 Spec

## Why
当前缩放动画和平移动画是串行执行的，导致动画时间过长，不够丝滑。用户希望缩放和平移动画同时发生，缩短总动画时间，提升流畅感。

## What Changes
- 缩放动画和平移动画并行执行
- 减少总动画时间
- 使用GSAP timeline或并行动画

## Impact
- Affected specs: map-sink-effect, map-pan-transform
- Affected code: axis-map.html (JavaScript动画时序)

## ADDED Requirements

### Requirement: 动画并行执行
系统应同时执行缩放和平移动画。

#### Scenario: 长按动画并行
- **WHEN** 用户长按触发交互
- **THEN** 缩放动画和平移动画同时开始
- **AND** 两个动画同时进行
- **AND** 动画完成后显示面板

#### Scenario: 松开动画并行
- **WHEN** 用户松开鼠标
- **THEN** 面板先隐藏
- **AND** 面板隐藏后，反向平移和缩放恢复同时进行

### Requirement: 动画时长优化
并行执行应减少总动画时间。

#### Scenario: 时间计算
- **WHEN** 缩放(600ms)和平移(500ms)并行
- **THEN** 总动画时间为600ms（取较长者）
- **AND** 动画更流畅、更快速

## MODIFIED Requirements

### Requirement: showDetailPanel函数
动画应并行执行。

#### Scenario: 函数执行
- **WHEN** showDetailPanel被调用
- **THEN** 同时启动缩放和平移动画
- **AND** 动画完成后显示面板
- **AND** 面板显示后触发文字动画

### Requirement: hideDetailPanel函数
动画应并行执行。

#### Scenario: 函数执行
- **WHEN** hideDetailPanel被调用
- **THEN** 先隐藏面板
- **AND** 面板隐藏后，同时启动反向平移和缩放恢复
