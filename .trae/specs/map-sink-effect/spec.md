# 地图下沉效果 Spec

## Why
用户希望长按时有更沉浸的交互体验：先通过缩放动画产生地图"下沉"的视觉效果，然后再改变布局显示面板，形成清晰的动画层次。

## What Changes
- 长按时：先执行缩放动画（下沉效果），动画完成后再显示面板
- 缩放动画作为过渡桥梁，连接沉浸模式和详情模式
- 布局变化在缩放动画完成后触发

## Impact
- Affected specs: animation-smoothness-fix, immersive-map-interaction
- Affected code: axis-map.html (JavaScript动画时序)

## ADDED Requirements

### Requirement: 下沉动画效果
系统应在长按时先执行缩放下沉动画，再改变布局。

#### Scenario: 长按下沉动画
- **WHEN** 用户长按触发交互
- **THEN** 地图先执行缩放动画（从当前缩放值缩小）
- **AND** 缩放动画产生"下沉"的视觉效果
- **AND** 缩放动画完成后，面板才开始滑入
- **AND** 布局变化与缩放动画串行执行

#### Scenario: 下沉动画参数
- **WHEN** 执行下沉动画
- **THEN** 缩放目标值为MIN_ZOOM (1.0)
- **AND** 动画时长为500ms
- **AND** 使用ease-out缓动函数产生下沉感

### Requirement: 布局变化延迟
布局变化应在下沉动画完成后触发。

#### Scenario: 面板显示时机
- **WHEN** 下沉动画完成
- **THEN** 移除immersive-mode类
- **AND** 面板开始滑入动画
- **AND** 文字动画在面板滑入完成后触发

### Requirement: 松开恢复动画
松开时应先隐藏面板，再执行缩放恢复。

#### Scenario: 松开恢复顺序
- **WHEN** 用户松开鼠标
- **THEN** 面板先滑出隐藏
- **AND** 面板隐藏完成后，地图执行缩放恢复动画
- **AND** 缩放恢复到MAX_ZOOM (1.15)

## MODIFIED Requirements

### Requirement: showDetailPanel函数
面板显示应在缩放动画完成后触发。

#### Scenario: 函数执行顺序
- **WHEN** showDetailPanel被调用
- **THEN** 先执行缩放下沉动画
- **AND** 500ms后触发布局变化
- **AND** 布局变化后500ms触发文字动画

### Requirement: hideDetailPanel函数
面板隐藏应在缩放恢复前完成。

#### Scenario: 函数执行顺序
- **WHEN** hideDetailPanel被调用
- **THEN** 先隐藏面板（添加immersive-mode类）
- **AND** 面板隐藏动画完成后执行缩放恢复
