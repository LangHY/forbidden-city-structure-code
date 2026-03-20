# 面板动画时序优化 Spec

## Why
当前面板显示时，文字上浮动画与面板滑入动画同时进行，导致视觉上不够丝滑。用户希望面板滑入完成后，再触发文字的上浮动画，形成更优雅的视觉层次。

## What Changes
- 面板滑入动画保持不变（500ms ease-in-out）
- 文字上浮动画延迟触发，等待面板滑入完成
- 保持现有的逐行上浮动画效果

## Impact
- Affected specs: immersive-map-interaction, text-float-animation
- Affected code: axis-map.html (JavaScript动画时序逻辑)

## ADDED Requirements

### Requirement: 文字动画延迟触发
系统应在面板滑入动画完成后触发文字上浮动画。

#### Scenario: 面板显示后文字动画
- **WHEN** 用户长按触发面板显示
- **THEN** 面板以500ms动画滑入
- **AND** 面板滑入完成后，触发文字逐行上浮动画
- **AND** 文字动画保持原有的上浮效果

#### Scenario: 地点切换时文字动画
- **WHEN** 用户长按期间切换地点
- **THEN** 文字立即更新并触发上浮动画
- **AND** 动画效果与面板显示后一致

## MODIFIED Requirements

### Requirement: showDetailPanel函数
面板显示函数需要触发文字动画。

#### Scenario: 面板显示触发文字动画
- **WHEN** showDetailPanel被调用
- **THEN** 面板开始滑入动画
- **AND** 500ms后触发当前地点的文字上浮动画
