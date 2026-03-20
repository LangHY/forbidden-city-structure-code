# 阶段一基础提取报告

## 📋 概述

| 项目 | 内容 |
|-----|------|
| **源文件** | `public/opening.html` (2443行) |
| **输出目录** | `extracted/` |
| **提取日期** | 2026-03-19 |
| **文件数量** | 10个TypeScript文件 |

---

## 📁 文件清单

```
extracted/
├── config.ts        # 配置和数据 (120行)
├── types.ts         # 类型定义 (95行)
├── utils.ts         # 工具函数 (180行)
├── FrameLRUCache.ts # LRU缓存类 (200行)
├── FrameLoader.ts   # 帧加载器 (320行)
├── styles.ts        # 样式提取 (450行)
├── animations.ts    # 动画逻辑 (380行)
├── api.ts           # API服务 (180行)
├── hooks.ts         # Hooks接口 (200行)
└── index.ts         # 统一导出 (50行)
```

**总计: ~2175行 TypeScript代码**

---

## 🔍 提取内容详解

### 1. 配置层 (`config.ts`)

| 类别 | 提取内容 |
|-----|---------|
| **主题配置** | 颜色变量(故宫红#b91c1c等)、字体族、尺寸变量 |
| **视频配置** | 20fps、60帧LRU缓存、600vh滚动驱动区 |
| **卡片配置** | 280x400尺寸、分离距离140px、展开角度12° |
| **滚动配置** | 白色遮罩淡出25%、Dashboard出现位置 |
| **数据** | 3张卡片(太和殿/琉璃瓦/金丝楠)、4张瀑布流图片、默认诗句 |

### 2. 类型层 (`types.ts`)

```typescript
// 核心类型
- FrameData          // 帧数据 (bitmap/canvas/offscreen)
- FrameLoaderState   // 加载器状态 (idle/loading/ready/error)
- LoadProgressInfo   // 加载进度信息
- CacheStats         // 缓存统计

// 动画类型
- CardPhase          // 卡片动画阶段 (1|2|3|4)
- CardTransform      // 卡片变换参数
- CardAnimationState // 卡片动画状态

// 应用状态
- ScrollState        // 滚动状态
- OpeningAnimationState // 开场动画状态
```

### 3. 工具层 (`utils.ts`)

```typescript
// 缓动函数
- easeInOutCubic(x)  // 三次缓入缓出
- easeOutCubic(x)    // 三次缓出
- easeInCubic(x)     // 三次缓入
- easeInOutQuad(x)   // 二次缓入缓出

// 效果函数
- typeWriter(text, element, speed) // 打字机效果

// 计算函数
- calculateCoverFit(container, content) // Cover-fit布局计算
- calculateCardAnimationPhase(progress) // 动画阶段计算
- calculateCardTransform(progress, idx, vh) // 卡片变换计算
- calculateFrameIndex(progress, total) // 帧索引计算
```

### 4. 核心类

#### FrameLRUCache (`FrameLRUCache.ts`)

```
LRU缓存管理器
├── 构造参数: maxSize = 60
├── 核心方法:
│   ├── get(idx) → FrameData | null
│   ├── set(idx, frameData)
│   ├── release(idx)
│   └── has(idx) → boolean
├── 保护机制:
│   └── 当前播放位置 ±20% 范围内的帧不会被淘汰
└── 统计功能:
    └── getStats() → CacheStats
```

#### FrameLoader (`FrameLoader.ts`)

```
渐进式帧加载器
├── 加载策略:
│   ├── 关键帧优先 (每秒1帧)
│   ├── 按需加载 (滚动时请求)
│   └── 空闲后台提取 (requestIdleCallback)
├── 帧提取:
│   ├── 支持OffscreenCanvas + ImageBitmap
│   └── 降级到传统Canvas
├── 反向索引:
│   ├── idx=0 → 视频最后一帧
│   └── idx=max → 视频第一帧
└── 核心方法:
    ├── init() → Promise<void>
    ├── loadKeyFrames() → Promise<void>
    ├── extractFrame(idx) → Promise<FrameData>
    └── requestNearbyFrames(center, range)
```

### 5. 样式层 (`styles.ts`)

| 样式模块 | 内容 |
|---------|------|
| `baseStyles` | html/body基础样式、grain噪点、flash闪光 |
| `loaderStyles` | 加载器容器、进度数字、进度条 |
| `uiLayerStyles` | UI层容器、诗句容器 |
| `aiPanelStyles` | AI按钮容器、玻璃态按钮样式 |
| `scrollHintStyles` | 滚动提示容器、箭头动画 |
| `canvasStyles` | 帧Canvas、白色遮罩 |
| `waterfallStyles` | 瀑布流容器、reel、图片样式 |
| `dashboardStyles` | Dashboard区域、frame、背景 |
| `cardStyles` | 扑克牌卡片、正反面、标题描述、角标 |
| `navbarStyles` | 导航栏容器、标题、链接 |
| `destinationStyles` | 目标页面容器、子标题 |
| `keyframeAnimations` | noise/scrollArrow/gentleFloat关键帧 |
| `mobileCardStyles` | 移动端卡片适配 (768px) |
| `smallMobileCardStyles` | 小屏适配 (480px) |

### 6. 动画层 (`animations.ts`)

```typescript
// 开场动画
- createOpeningTimeline(elements, options) → gsap.Timeline
- createMouseParallax(elements, options) → cleanup函数

// 滚动驱动动画
- createVideoScrollTrigger(elements, options) → ScrollTrigger
- createWhiteMaskFade(whiteMask, scrollDriver) → gsap.Tween
- createDashboardAppearTrigger(elements, options) → ScrollTrigger
- createCardSplitTrigger(elements, options) → ScrollTrigger
```

**动画时序图:**
```
0s ────────────────────────────────────────────────────── 4s
 │                                                         │
 ├── 1s: 数字淡入                                           │
 ├────── 4s: 进度条动画 + 计数器 + 瀑布流滚动 ──────────────┤
 │                                                         │
 │                      3.8s: 闪光点                        │
 │                        ↓                                │
 │                   ┌─────┴─────┐                         │
 │                   │ 闪光效果   │ 0.1s                    │
 │                   └─────┬─────┘                         │
 │                         ↓                               │
 │                   Canvas淡入 1.8s                        │
 │                    + 白色遮罩                            │
 │                    + UI淡出                             │
 │                         ↓                               │
 │                   诗句淡入 2.5s                          │
 │                   AI按钮 2s                             │
 └─────────────────────────────────────────────────────────┘
```

### 7. API层 (`api.ts`)

```typescript
// API配置
- apiConfig { baseUrl, model, timeout, systemPrompt }

// 核心函数
- getMuse(apiKey?) → Promise<MuseResponse>

// 降级处理
- fallbackToStaticImage(elements, reason)
- getVideoErrorType(error) → string
- createVideoTimeout(isReady, isDegraded, onTimeout, timeout)

// Canvas绘制
- drawCachedFrame(canvas, frameData)
- resizeCanvas(canvas, frameLoader, currentFrameIdx)
```

### 8. Hooks接口 (`hooks.ts`)

| Hook | 功能 | 返回值 |
|------|------|--------|
| `useFrameLoader` | 视频帧加载 | state, requestFrame, hasFrame... |
| `useVideoScroll` | 滚动控制 | scrollProgress, currentFrameIndex |
| `useCardAnimation` | 卡片动画 | cards[], wrapperState, destinationState |
| `useOpeningAnimation` | 开场动画 | state, start/pause/resume, refs |
| `useMuse` | 诗句生成 | quote, isLoading, regenerate |
| `useMouseParallax` | 鼠标视差 | mousePosition, offset |
| `useScrollHint` | 滚动提示 | isVisible, hide |
| `useCanvasRenderer` | Canvas渲染 | canvasRef, currentFrameIndex |
| `useVideoFallback` | 降级处理 | isDegraded, triggerFallback |

---

## 📊 统计数据

### 代码量统计

| 类别 | 行数 | 占比 |
|-----|------|------|
| 样式层 | ~450行 | 21% |
| 核心类 | ~520行 | 24% |
| 动画层 | ~380行 | 17% |
| 工具函数 | ~180行 | 8% |
| 类型定义 | ~95行 | 4% |
| 配置数据 | ~120行 | 6% |
| API服务 | ~180行 | 8% |
| Hooks接口 | ~200行 | 9% |
| 导出文件 | ~50行 | 3% |

### 功能覆盖

| 功能模块 | 提取状态 | 备注 |
|---------|---------|------|
| 开场动画序列 | ✅ 完整 | Timeline + 元素引用 |
| 视频帧播放 | ✅ 完整 | FrameLoader + LRU缓存 |
| 滚动驱动 | ✅ 完整 | ScrollTrigger配置 |
| 卡片动画 | ✅ 完整 | 4阶段变换计算 |
| 打字机效果 | ✅ 完整 | 异步逐字显示 |
| API调用 | ✅ 完整 | GLM-4接口 + 降级 |
| 鼠标视差 | ✅ 完整 | move事件监听 |
| 样式系统 | ✅ 完整 | CSS-in-JS格式 |
| 响应式适配 | ✅ 完整 | 768px/480px断点 |

---

## ⚠️ 注意事项

### 1. 依赖要求

```json
{
  "gsap": "^3.12.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0"
}
```

### 2. 浏览器兼容性

| 特性 | 支持情况 |
|-----|---------|
| OffscreenCanvas | 可选，有降级方案 |
| ImageBitmap | 可选，有降级方案 |
| requestIdleCallback | 可选，有setTimeout降级 |
| backdrop-filter | 需要webkit前缀 |

### 3. 性能考虑

- LRU缓存默认60帧，可根据内存情况调整
- 关键帧间隔1秒，可根据视频长度调整
- 滚动scrub值0.15，可调整惯性强度

### 4. 未提取内容

以下内容保留在原HTML中，需要在组件化时处理：

- HTML结构 (DOM树)
- 内联事件处理
- 实际的React组件实现
- Context/Store实现
- 单元测试

---

## ✅ 阶段一完成确认

- [x] 配置数据提取
- [x] 类型定义提取
- [x] 工具函数提取
- [x] 核心类提取
- [x] 样式系统提取
- [x] 动画逻辑提取
- [x] API服务提取
- [x] Hooks接口设计
- [x] 导出文件整理
- [x] 文档编写

---

*报告生成时间: 2026-03-19*
