# 下一步计划

## 🎯 总体目标

将 `opening.html` (2443行单文件) 迁移为现代化的 React 组件架构，实现：
- 代码可维护性提升
- 组件复用能力
- 类型安全保障
- 性能优化空间

---

## 📋 阶段规划

### 阶段二：基础组件层 (预计2-3天)

#### 2.1 静态组件开发

```
src/components/
├── ui/
│   ├── Loader/
│   │   ├── index.tsx          # 加载器组件
│   │   ├── ProgressNum.tsx    # 进度数字
│   │   └── styles.ts          # 样式
│   ├── ScrollHint/
│   │   └── index.tsx          # 滚动提示
│   ├── AIButton/
│   │   └── index.tsx          # AI按钮
│   └── Grain/
│       └── index.tsx          # 噪点层
```

**任务清单:**
- [ ] Loader组件 (进度数字+进度条+标签)
- [ ] ScrollHint组件 (文字+箭头动画)
- [ ] AIButton组件 (玻璃态按钮)
- [ ] Grain组件 (噪点背景)

#### 2.2 布局组件开发

```
src/components/
├── layout/
│   ├── Navbar/
│   │   └── index.tsx          # 导航栏
│   ├── UILayer/
│   │   └── index.tsx          # UI层容器
│   └── DestinationPage/
│       └── index.tsx          # 目标页面
```

**任务清单:**
- [ ] Navbar组件
- [ ] UILayer组件 (诗句容器)
- [ ] DestinationPage组件

---

### 阶段三：核心功能组件 (预计3-4天)

#### 3.1 视频帧系统

```
src/components/
├── video/
│   ├── FrameCanvas/
│   │   ├── index.tsx          # Canvas渲染器
│   │   ├── useCanvasSetup.ts  # Canvas初始化Hook
│   │   └── useFrameRenderer.ts # 帧渲染Hook
│   ├── WaterfallWindow/
│   │   └── index.tsx          # 瀑布流窗口
│   └── WhiteMask/
│       └── index.tsx          # 白色遮罩
```

**任务清单:**
- [ ] FrameCanvas组件 (主Canvas)
- [ ] useFrameLoader Hook实现
- [ ] useVideoScroll Hook实现
- [ ] WaterfallWindow组件
- [ ] WhiteMask组件

#### 3.2 卡片系统

```
src/components/
├── cards/
│   ├── PokerCard/
│   │   ├── index.tsx          # 单张卡片
│   │   ├── CardFront.tsx      # 正面
│   │   ├── CardBack.tsx       # 背面
│   │   └── CardCorner.tsx     # 角标
│   ├── PokerCardsWrapper/
│   │   └── index.tsx          # 卡片容器
│   └── DashboardSection/
│       └── index.tsx          # Dashboard区域
```

**任务清单:**
- [ ] PokerCard组件 (正反面切换)
- [ ] CardFront组件 (大字)
- [ ] CardBack组件 (标题+描述)
- [ ] CardCorner组件 (emoji角标)
- [ ] PokerCardsWrapper组件
- [ ] DashboardSection组件
- [ ] useCardAnimation Hook实现

---

### 阶段四：动画系统集成 (预计2-3天)

#### 4.1 开场动画

```
src/hooks/
├── useOpeningAnimation.ts     # 开场动画控制
├── useMouseParallax.ts        # 鼠标视差
└── useTypewriter.ts           # 打字机效果
```

**任务清单:**
- [ ] useOpeningAnimation Hook
- [ ] useMouseParallax Hook
- [ ] useTypewriter Hook
- [ ] 开场Timeline集成

#### 4.2 滚动动画

```
src/hooks/
├── useScrollTrigger.ts        # ScrollTrigger封装
├── useScrollProgress.ts       # 滚动进度追踪
└── useScrollHint.ts           # 滚动提示控制
```

**任务清单:**
- [ ] useScrollTrigger Hook
- [ ] useScrollProgress Hook
- [ ] useScrollHint Hook
- [ ] 各ScrollTrigger实例集成

---

### 阶段五：状态管理与API (预计1-2天)

#### 5.1 状态管理

```
src/store/
├── index.ts                   # Store配置
├── slices/
│   ├── openingSlice.ts        # 开场状态
│   ├── videoSlice.ts          # 视频状态
│   ├── scrollSlice.ts         # 滚动状态
│   └── uiSlice.ts             # UI状态
└── hooks.ts                   # Typed Hooks
```

**技术选型建议:**
- 简单场景: React Context + useReducer
- 复杂场景: Zustand (轻量) 或 Redux Toolkit

**任务清单:**
- [ ] 选择状态管理方案
- [ ] 定义Store结构
- [ ] 实现各Slice
- [ ] 创建自定义Hooks

#### 5.2 API集成

```
src/services/
├── museApi.ts                 # 诗句API
└── useMuse.ts                 # API Hook
```

**任务清单:**
- [ ] museApi服务封装
- [ ] useMuse Hook实现
- [ ] 错误处理与降级

---

### 阶段六：集成与优化 (预计2天)

#### 6.1 主应用集成

```
src/
├── App.tsx                    # 主应用
├── OpeningScene.tsx           # 开场场景
└── main.tsx                   # 入口
```

**任务清单:**
- [ ] App.tsx主框架
- [ ] OpeningScene场景组件
- [ ] 组件间通信测试
- [ ] 完整流程测试

#### 6.2 性能优化

**优化点:**
- [ ] React.memo 合理使用
- [ ] useMemo/useCallback 优化
- [ ] 懒加载组件分割
- [ ] 动画帧率监控

#### 6.3 响应式适配

**任务清单:**
- [ ] 移动端布局适配
- [ ] 触摸事件处理
- [ ] 断点样式调整

---

## 🗓️ 时间估算

| 阶段 | 预计时间 | 优先级 |
|-----|---------|--------|
| 阶段二: 基础组件 | 2-3天 | P0 |
| 阶段三: 核心功能 | 3-4天 | P0 |
| 阶段四: 动画系统 | 2-3天 | P0 |
| 阶段五: 状态管理 | 1-2天 | P1 |
| 阶段六: 集成优化 | 2天 | P1 |

**总计: 10-14天**

---

## 📦 目录结构规划

```
src/
├── components/           # React组件
│   ├── ui/              # 基础UI组件
│   ├── layout/          # 布局组件
│   ├── video/           # 视频相关
│   └── cards/           # 卡片相关
├── hooks/               # 自定义Hooks
├── store/               # 状态管理
├── services/            # API服务
├── utils/               # 工具函数
├── types/               # 类型定义
├── styles/              # 全局样式
├── extracted/           # 阶段一提取代码(参考)
├── App.tsx              # 主应用
└── main.tsx             # 入口
```

---

## 🔧 技术栈确认

| 类别 | 技术 | 版本 |
|-----|------|------|
| 框架 | React | 18.x |
| 构建 | Vite | 5.x |
| 动画 | GSAP | 3.12+ |
| 样式 | Tailwind CSS | 3.x |
| 类型 | TypeScript | 5.x |
| 状态 | Zustand (建议) | 4.x |

---

## ⚠️ 风险点

1. **GSAP ScrollTrigger与React生命周期**
   - 需要正确处理组件卸载时的清理
   - ScrollTrigger.refresh()时机控制

2. **Canvas渲染性能**
   - 帧缓存内存管理
   - 高分辨率屏幕适配

3. **动画状态同步**
   - 滚动方向切换时的状态回滚
   - 快速滚动时的帧请求队列

---

## 📝 下一步行动

**立即开始: 阶段二 - 基础组件开发**

从最简单的组件开始:
1. 创建 `src/components/ui/` 目录
2. 实现 Loader 组件
3. 实现 ScrollHint 组件
4. 验证样式系统正确性

---

*计划生成时间: 2026-03-19*
