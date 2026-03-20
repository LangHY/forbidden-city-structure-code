# 视频加载优化 Spec

## Why
当前视频帧预加载策略存在严重的性能问题：一次性提取所有视频帧到内存，导致初始加载时间长、内存占用高、用户体验差。需要优化加载策略，提升首屏速度和整体性能，同时保持视频原始画质。

## What Changes
- 实现渐进式帧加载策略，优先加载关键帧
- 添加视频加载进度指示器
- 实现动态帧缓存池，按需加载和释放帧
- 优化 Canvas 绘制性能（使用 OffscreenCanvas）
- 添加视频加载失败的降级方案
- 优化帧提取算法，减少阻塞

## Impact
- Affected specs: 视频播放系统、用户体验
- Affected code: `public/opening.html` (视频帧提取和渲染逻辑)

## ADDED Requirements

### Requirement: 渐进式帧加载
系统应支持渐进式加载视频帧，优先加载关键帧以确保用户可以快速开始交互，保持原始分辨率。

#### Scenario: 首屏快速可用
- **WHEN** 用户打开页面
- **THEN** 系统优先加载首帧和关键帧（每秒1帧，原始分辨率）
- **AND** 用户可以在 2 秒内看到首帧画面
- **AND** 后台继续加载剩余帧

#### Scenario: 滚动时按需加载
- **WHEN** 用户滚动页面
- **THEN** 系统动态加载当前滚动位置附近的帧
- **AND** 释放远离当前位置的帧以节省内存

### Requirement: 加载进度指示
系统应提供清晰的视频加载进度指示。

#### Scenario: 显示加载进度
- **WHEN** 视频正在加载
- **THEN** 显示加载百分比
- **AND** 进度条与实际加载进度同步

### Requirement: 动态帧缓存池
系统应实现动态帧缓存池，智能管理内存使用。

#### Scenario: 缓存池管理
- **WHEN** 缓存帧数量超过阈值（默认 60 帧）
- **THEN** 系统释放最久未使用的帧
- **AND** 保留当前播放位置 ±20% 范围内的帧

### Requirement: 性能优化
系统应优化 Canvas 绘制性能。

#### Scenario: 使用 OffscreenCanvas
- **WHEN** 浏览器支持 OffscreenCanvas
- **THEN** 使用 OffscreenCanvas 进行帧缓存
- **AND** 使用 transferToImageBitmap 提升绘制效率

#### Scenario: 帧提取优化
- **WHEN** 提取视频帧
- **THEN** 使用 requestIdleCallback 在空闲时间提取
- **AND** 避免阻塞主线程

### Requirement: 降级方案
系统应提供视频加载失败的降级方案。

#### Scenario: 视频加载失败
- **WHEN** 视频加载失败或超时（超过 10 秒）
- **THEN** 显示静态背景图片作为降级方案
- **AND** 记录错误日志以便排查

## MODIFIED Requirements

### Requirement: 帧提取策略
原有策略：一次性提取所有帧到内存。

修改后策略：
1. 首先提取关键帧（每秒 1 帧，共约 5 帧），保持原始分辨率
2. 然后按需提取当前播放位置附近的帧
3. 使用 LRU 缓存策略管理帧内存

### Requirement: 视频预加载配置
原有配置：`preload='auto'`

修改后配置：
```javascript
video.preload = 'metadata'; // 先只加载元数据
// 然后根据需要动态加载
```

## REMOVED Requirements

### Requirement: 全量帧预加载
**Reason**: 导致初始加载时间过长，内存占用过高
**Migration**: 改用渐进式加载策略
