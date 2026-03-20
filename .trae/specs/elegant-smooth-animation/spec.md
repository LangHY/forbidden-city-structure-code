# 优雅顺滑动画优化 Spec

## Why
当前动画时长较短（700ms/500ms），expo.out曲线虽然优雅但开始太快，整体感觉匆忙不够顺滑。需要增加动画时长并使用更平滑的缓动曲线。

## What Changes
- 增加动画时长，让动画更从容
- 使用更平滑的缓动曲线
- 调整时序让动画衔接更自然

## Impact
- Affected specs: advanced-animation-curves
- Affected code: axis-map.html (JavaScript动画参数)

## ADDED Requirements

### Requirement: 动画时长优化
动画应有足够的时间展现缓动效果。

#### Scenario: 时长调整
- **WHEN** 执行动画
- **THEN** 缩放动画时长为1000ms
- **AND** 平移动画时长为800ms
- **AND** 面板动画时长为600ms
- **AND** 动画有足够时间展现缓动效果

### Requirement: 缓动曲线优化
使用更平滑的缓动曲线。

#### Scenario: 缩放缓动
- **WHEN** 执行缩放动画
- **THEN** 使用 `power2.inOut` 缓动曲线
- **AND** 开始和结束都有平滑的加速/减速
- **AND** 中间过渡自然

#### Scenario: 平移缓动
- **WHEN** 执行平移动画
- **THEN** 使用 `power2.inOut` 缓动曲线
- **AND** 平移过程平滑自然

### Requirement: 时序衔接优化
动画时序应自然衔接。

#### Scenario: 长按时序
- **WHEN** 长按触发
- **THEN** 缩放和平移同时开始
- **AND** 动画完成后(1000ms)显示面板
- **AND** 面板动画(600ms)后触发文字

#### Scenario: 松开时序
- **WHEN** 松开触发
- **THEN** 面板先隐藏(600ms)
- **AND** 然后缩放和平移同时恢复(1000ms)

## 缓动曲线说明

**power2.inOut** - 平滑的加速减速曲线
- 开始缓慢加速
- 中间匀速
- 结束缓慢减速
- 整体感觉非常平滑自然
- 比expo.out更温和，不会感觉匆忙
