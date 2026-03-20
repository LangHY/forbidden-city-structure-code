# 高级动画曲线优化 Spec

## Why
当前使用的 `power3.out` 缓动曲线虽然不错，但还可以进一步优化。通过使用更专业的缓动曲线，可以让动画更加丝滑自然，达到专业级的视觉效果。

## What Changes
- 使用更高级的GSAP缓动曲线
- 调整动画时长以配合新曲线
- 优化CSS过渡曲线

## Impact
- Affected specs: animation-sequence-separation
- Affected code: axis-map.html (CSS和JavaScript)

## ADDED Requirements

### Requirement: GSAP高级缓动曲线
系统应使用更专业的GSAP缓动曲线。

#### Scenario: 缩放动画缓动
- **WHEN** 执行缩放动画
- **THEN** 使用 `expo.out` 缓动曲线
- **AND** 产生更优雅的减速效果
- **AND** 结束时有更好的"落地感"

#### Scenario: 平移动画缓动
- **WHEN** 执行平移动画
- **THEN** 使用 `power4.out` 缓动曲线
- **AND** 产生更平滑的移动效果

### Requirement: 动画时长优化
动画时长应与缓动曲线配合。

#### Scenario: 时长调整
- **WHEN** 使用expo.out缓动
- **THEN** 缩放动画时长调整为700ms
- **AND** 给缓动曲线足够的时间展现效果

### Requirement: CSS过渡曲线优化
CSS过渡应使用更精细的贝塞尔曲线。

#### Scenario: 面板过渡
- **WHEN** 面板显示/隐藏
- **THEN** 使用 `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
- **AND** 产生更优雅的滑入/滑出效果

## 缓动曲线对比

| 曲线 | 特点 | 适用场景 |
|------|------|----------|
| power3.out | 中等减速 | 通用动画 |
| power4.out | 更强减速 | 平移/滑动 |
| expo.out | 指数减速 | 缩放/下沉 |
| ease-out-expo | 指数减速(CSS) | 面板过渡 |
