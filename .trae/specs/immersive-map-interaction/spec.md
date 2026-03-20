# 沉浸式地图长按交互 Spec

## Why
当前页面布局始终显示左侧文字面板，用户无法获得完整的沉浸式地图浏览体验。通过长按交互，用户可以在沉浸式地图浏览和详细信息查看之间自由切换，提升用户体验。

## What Changes
- 初始状态：地图占据100%视口，左侧文字面板隐藏
- 长按交互：检测鼠标左键长按（≥300ms），触发面板渐入动画
- 松开交互：松开鼠标左键，面板渐出，恢复沉浸式地图
- 滚动交互：长按期间可通过垂直鼠标移动切换地点

## Impact
- Affected specs: axis-map-page, text-float-animation
- Affected code: axis-map.html (CSS样式、JavaScript交互逻辑)

## ADDED Requirements

### Requirement: 沉浸式初始状态
系统应在页面加载时显示全屏沉浸式地图视图。

#### Scenario: 页面初始加载
- **WHEN** 用户首次进入页面
- **THEN** 地图面板占据100%视口宽度
- **AND** 左侧文字面板完全隐藏（opacity: 0, pointer-events: none）
- **AND** 进度条从屏幕左侧开始

### Requirement: 长按检测
系统应检测鼠标左键的长按操作。

#### Scenario: 长按触发
- **WHEN** 用户按下鼠标左键并保持≥300ms
- **THEN** 系统识别为长按操作
- **AND** 触发面板显示动画

#### Scenario: 短按忽略
- **WHEN** 用户按下鼠标左键并在300ms内释放
- **THEN** 不触发任何面板动画
- **AND** 保持当前沉浸式状态

### Requirement: 面板渐入动画
系统应在检测到长按后执行面板渐入动画。

#### Scenario: 面板渐入
- **WHEN** 长按被检测到
- **THEN** 左侧文字面板以500ms ease-in-out动画渐入
- **AND** 地图面板从100%宽度过渡到66.667%宽度
- **AND** 进度条位置相应调整
- **AND** 动画期间保持地图可交互

### Requirement: 面板渐出动画
系统应在用户释放鼠标左键后执行面板渐出动画。

#### Scenario: 鼠标释放
- **WHEN** 用户释放鼠标左键
- **THEN** 左侧文字面板以500ms ease-in-out动画渐出
- **AND** 地图面板从66.667%宽度过渡回100%宽度
- **AND** 进度条恢复到屏幕顶部全宽
- **AND** 过渡平滑无布局跳动

### Requirement: 长按期间地点切换
系统应在长按期间响应垂直鼠标移动来切换地点。

#### Scenario: 垂直移动切换地点
- **WHEN** 用户长按并垂直移动鼠标
- **THEN** 根据Y轴移动距离计算目标地点索引
- **AND** 地点切换即时但平滑
- **AND** 提供适当的视觉反馈
- **AND** 设置合适的灵敏度比例

### Requirement: 性能与响应性
系统应确保交互流畅且响应迅速。

#### Scenario: 响应时间
- **WHEN** 用户执行任何交互操作
- **THEN** 系统响应时间<100ms
- **AND** 所有动画保持60fps帧率

#### Scenario: 节流优化
- **WHEN** 用户快速移动鼠标
- **THEN** 系统使用节流/防抖优化性能
- **AND** 避免过度渲染

## MODIFIED Requirements

### Requirement: CSS过渡动画
现有CSS需要支持动态宽度过渡。

#### Scenario: 地图面板宽度过渡
- **WHEN** 面板显示/隐藏状态改变
- **THEN** 地图面板宽度在500ms内平滑过渡
- **AND** 使用ease-in-out缓动函数

### Requirement: 进度条位置
进度条位置需要随面板状态动态调整。

#### Scenario: 进度条位置调整
- **WHEN** 面板状态改变
- **THEN** 进度条left属性从0过渡到33.333%（面板显示时）
- **OR** 进度条left属性从33.333%过渡到0（面板隐藏时）
