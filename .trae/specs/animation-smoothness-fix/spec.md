# 动画流畅性修复 Spec

## Why
当前实现存在多个缩放动画源互相冲突的问题：
1. ScrollTrigger的onUpdate在设置scale
2. showDetailPanel/hideDetailPanel在设置scale
3. handleMouseMove也在设置scale
这导致滑动过程中一会儿放大一会儿缩小，动画抖动不流畅。

## What Changes
- 统一缩放动画控制逻辑，避免多源冲突
- 长按期间完全禁用滚动缩放
- 拖动时缩放从当前值平滑过渡
- 使用GSAP timeline协调多个动画

## Impact
- Affected specs: immersive-map-interaction, panel-animation-timing
- Affected code: axis-map.html (JavaScript动画逻辑)

## ADDED Requirements

### Requirement: 统一缩放控制
系统应使用单一缩放控制源，避免多源冲突。

#### Scenario: 长按状态隔离
- **WHEN** 用户长按触发面板显示
- **THEN** 完全禁用ScrollTrigger的缩放更新
- **AND** 缩放动画由长按交互独立控制

#### Scenario: 拖动缩放平滑
- **WHEN** 用户长按期间拖动鼠标
- **THEN** 缩放从当前值平滑变化
- **AND** 缩放方向与拖动方向一致
- **AND** 不出现抖动或跳变

### Requirement: 动画协调
系统应协调面板动画与缩放动画的时序。

#### Scenario: 面板显示动画序列
- **WHEN** 长按触发面板显示
- **THEN** 先执行缩放动画(500ms)
- **AND** 缩放动画完成后触发文字动画
- **AND** 两个动画平滑衔接

#### Scenario: 面板隐藏动画序列
- **WHEN** 松开鼠标触发面板隐藏
- **THEN** 面板滑出与缩放恢复同时进行
- **AND** 两个动画同步完成

## MODIFIED Requirements

### Requirement: ScrollTrigger缩放
滚动缩放应在长按期间暂停。

#### Scenario: 滚动缩放控制
- **WHEN** 长按状态激活
- **THEN** ScrollTrigger不再更新scale
- **WHEN** 长按状态结束
- **THEN** ScrollTrigger恢复更新scale

### Requirement: 拖动缩放计算
拖动缩放应基于当前状态而非固定值。

#### Scenario: 拖动缩放计算
- **WHEN** 用户拖动鼠标
- **THEN** 缩放值从当前值开始变化
- **AND** 变化量与拖动距离成正比
- **AND** 限制在MIN_ZOOM和MAX_ZOOM之间
