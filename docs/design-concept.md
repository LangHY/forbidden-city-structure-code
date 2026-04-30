# 设计思路文档

> 故宫主题沉浸式交互网站 - 设计理念与技术实现

---

## 一、设计背景与目标

### 1.1 项目定位

本项目是一个以**故宫古建筑**为主题的沉浸式交互网站，旨在通过现代 Web 技术展现中国传统建筑之美。项目融合了 3D 可视化、AI 内容生成、电影级动画效果等前沿技术，为用户提供身临其境的文化探索体验。

### 1.2 核心设计理念

| 理念 | 实现方式 |
|------|----------|
| **沉浸感** | 电影级开场动画、3D 展示、无缝过渡效果 |
| **交互性** | 滚轮驱动导航、3D 模型旋转、主题切换 |
| **智能化** | AI 生成诗句和结构描述、RAG 知识库问答 |
| **文化性** | 故宫主题色彩、传统字体、中式装饰元素 |

---

## 二、架构设计

### 2.1 技术栈选型

```
┌─────────────────────────────────────────────────────────────┐
│                     前端技术栈                               │
├─────────────────────────────────────────────────────────────┤
│  框架层    │  React 19 + TypeScript 5.9                     │
│  构建工具  │  Vite 7.3 (Rollup 打包)                        │
│  路由管理  │  React Router DOM 7.13                         │
│  状态管理  │  Context API + useReducer                      │
├─────────────────────────────────────────────────────────────┤
│  样式层    │  Tailwind CSS 4.2 + PostCSS                   │
│  字体      │  Google Fonts + 权衡度量体(免费字体)            │
├─────────────────────────────────────────────────────────────┤
│  3D 渲染   │  Three.js 0.183 + @react-three/fiber          │
│           │  @react-three/drei (相机控制)                   │
├─────────────────────────────────────────────────────────────┤
│  动画库    │  Framer Motion 12.34 + GSAP 3.14              │
├─────────────────────────────────────────────────────────────┤
│  AI 集成   │  GLM-4.7-Flash API (智谱 AI)                   │
│  数据可视化 │  ECharts 6 + echarts-for-react                    │
│  后端服务   │  Node.js Express RAG (FAISS 向量检索)            │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 选型理由

**React 19 + TypeScript**
- React 的组件化架构便于构建复杂的交互界面
- TypeScript 提供类型安全，减少运行时错误
- React 19 的并发特性和 Suspense 支持更好的用户体验

**Vite 7.3**
- 极速的开发服务器启动（ESM 原生支持）
- 高效的热模块替换（HMR）
- 优化的生产构建（Rollup 打包）

**Three.js + React Three Fiber**
- Three.js 是 WebGL 3D 渲染的标准库
- React Three Fiber 提供 React 风格的 3D 编程
- drei 提供丰富的 3D 辅助组件

**Tailwind CSS 4.2**
- 原子化 CSS，快速开发
- 支持自定义设计系统
- 内置暗色模式支持

### 2.3 项目目录结构

```
forbidden-city-structure-code/
├── src/
│   ├── main.tsx                 # 应用入口，路由配置
│   ├── pages/                   # 页面组件
│   │   ├── Opening.tsx          # 开场页
│   │   ├── Exhibition.tsx       # 斗拱展览页
│   │   ├── Router.tsx           # 路由导航页
│   │   ├── Charts.tsx           # 数字考古页
│   │   └── Axis.tsx             # 中轴巡礼页
│   ├── components/              # 组件库
│   │   ├── opening/             # 开场页组件
│   │   ├── exhibition/          # 展览页组件
│   │   ├── router/              # 路由页组件
│   │   ├── axis/                # 中轴巡礼组件
│   │   ├── charts/              # 数字考古组件
│   │   ├── chat/                # AI 问答组件
│   │   ├── ui/                  # 通用 UI 组件
│   │   └── layout/              # 布局组件
│   ├── styles/                  # 全局样式
│   └── store/                   # 状态管理
├── public/
│   ├── models/structures/       # 斗拱 3D 模型 (GLB)
│   ├── axis/                    # 中轴线建筑图片
│   ├── fonts/                   # 自定义字体
│   └── *.mp4                    # 视频资源
├── backend/                      # RAG 后端服务
├── docs/                        # 技术文档
```

---

## 三、核心功能设计

### 3.1 开场页 (Opening)

#### 设计思路

开场页采用**电影级叙事风格**，通过滚动驱动动画引导用户进入故宫文化世界。

**核心机制：滚动进度驱动动画**

```typescript
// 滚动进度 Hook
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(Math.min(scrollTop / docHeight, 1));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return progress;
}
```

#### 动画阶段设计

| 滚动进度 | 触发效果 |
|---------|---------|
| 0% - 50% | 正常显示开场页 UI |
| 50% - 70% | 诗句、准星开始淡出 |
| 70% - 85% | 背景网格模糊，视频层模糊 |
| 85% - 100% | 路由页由模糊渐变为清晰 |

#### 视频定格 + 模糊过渡

```typescript
// 视频层模糊效果
const videoBlurAmount = useMemo(() => {
  if (scrollProgress < 0.85) return 0;
  return Math.min(30, (scrollProgress - 0.85) * 200);
}, [scrollProgress]);

// Router UI 模糊效果（由模糊到清晰）
const routerBlurAmount = useMemo(() => {
  if (scrollProgress < 0.85) return 20;
  return Math.max(0, 20 - (scrollProgress - 0.85) * 133.33);
}, [scrollProgress]);
```

#### 为什么这样设计？

**分层渲染策略**
- 将不同 UI 元素放在不同的 z-index 层
- 每层独立控制透明度和模糊度
- 实现"交叉淡入淡出"的电影剪辑效果

**性能优化**
- 使用 `useMemo` 缓存计算结果
- 使用 CSS `will-change` 提示浏览器优化
- 使用 `passive: true` 优化滚动监听

---

### 3.2 斗拱展览页 (Exhibition)

#### 设计思路

展览页采用**3D 交互展示**模式，用户通过滚轮切换不同斗拱结构，配合 AI 生成的专业描述。

#### 3D 模型加载系统

```typescript
// 全局模型缓存
const modelCache = new Map<string, THREE.Group>();

// 智能预加载相邻章节
export function preloadAdjacentModels(currentChapterId: string) {
  const currentIndex = chapters.findIndex(c => c.id === currentChapterId);

  // 预加载前后各一个模型
  if (currentIndex > 0) preloadModel(chapters[currentIndex - 1].modelId);
  if (currentIndex < chapters.length - 1) preloadModel(chapters[currentIndex + 1].modelId);
}
```

#### 为什么需要模型缓存？

**问题**：每次切换章节都重新加载 5-10MB 的 GLB 模型会造成明显卡顿。

**解决方案**：
1. 首次加载后存入 `Map` 缓存
2. 预加载相邻章节（用户可能访问的下一个）
3. 使用克隆避免引用共享问题

#### 滚轮切换章节系统

```typescript
// 节流控制 - 防止滚动过快
useEffect(() => {
  let lastTime = 0;
  const throttleMs = ANIMATION_DURATION + 50; // 550ms

  const handleWheel = (e: WheelEvent) => {
    const now = Date.now();
    if (now - lastTime < throttleMs) return;

    if (e.deltaY > 0) {
      if (switchChapter('down')) lastTime = now;
    } else if (e.deltaY < 0) {
      if (switchChapter('up')) lastTime = now;
    }
  };

  window.addEventListener('wheel', handleWheel, { passive: true });
  return () => window.removeEventListener('wheel', handleWheel);
}, [switchChapter]);
```

#### MacBook 风格加载动画

```typescript
// 加载进度模拟 - 在实际内容加载时逐渐增加
useEffect(() => {
  if (!isBooting) return;

  const interval = setInterval(() => {
    setBootProgress(prev => {
      // 最高只到 90%，剩余 10% 等待真实内容加载完成
      if (prev >= 90) return prev;
      // 随机增量，模拟真实加载
      const increment = Math.random() * LOADING_SPEED + 0.5;
      return Math.min(prev + increment, 90);
    });
  }, 50);

  return () => clearInterval(interval);
}, [isBooting]);
```

#### 设计意图

- 模拟 Apple 开机动画的高级感
- 进度条不直接到 100%，给用户"正在准备"的预期
- LLM 加载完成后冲刺到 100%，形成完美闭环

---

### 3.3 中轴巡礼页 (Axis)

#### 设计思路

采用 **Three.js 3D 场景**展示故宫中轴线 11 座主要建筑，以俯视视角呈现建筑群的空间关系，配合 Blender 风格网格地面营造"平面图"观感。

#### Three.js 场景构建

```typescript
// AxisScene.tsx — 核心 3D 场景
<Canvas camera={{ position: [0, 15, 0], fov: 60 }}>
  {/* Blender 风格网格地面 */}
  <gridHelper args={[20, 20, '#444', '#222']} />

  {/* 定向光 */}
  <directionalLight position={[5, 10, 5]} intensity={1} />

  {/* 11 座建筑节点 */}
  {buildings.map((b, i) => (
    <BuildingNode
      key={b.id}
      position={[b.x, 0, b.z]}
      data={b}
      isActive={i === activeIndex}
      onClick={() => setActiveIndex(i)}
    />
  ))}

  {/* 轨道控制 */}
  <OrbitControls enableRotate={false} enableZoom={true} />
</Canvas>
```

#### 建筑数据

```typescript
// buildingData.ts — 11 座建筑的位置与信息
export const buildings = [
  { id: 'wu-men', name: '午门', x: -10, z: 0, ... },
  { id: 'tai-he-men', name: '太和门', x: -8, z: 1, ... },
  { id: 'tai-he-dian', name: '太和殿', x: -6, z: 2, ... },
  // ... 共 11 座
  { id: 'shen-wu-men', name: '神武门', x: 10, z: 0, ... },
];
```

#### 为什么用 Three.js？

- 俯视 3D 视角能直观展示中轴线建筑的空间序列感
- 支持平滑的相机推拉（zoom in/out），提升沉浸感
- 建筑节点可做 hover 高亮、选中动画等 3D 交互
- 与项目整体的 Three.js 技术栈保持一致，复用已有能力

#### 用户交互

| 操作 | 效果 |
|------|------|
| 键盘 ↑↓ 或 ←→ | 切换建筑节点 |
| 鼠标滚轮 | 相机推拉 |
| 点击建筑节点 | 展开建筑信息面板 |
| 时间轴滑块 | 按历史年代筛选建筑 |

---

### 3.4 数字考古页 (Charts)

#### 设计思路

采用 **ECharts 6** 数据可视化方案，将故宫建筑、文物、历史数据转化为 7 种交互式图表。通过丰富的图表类型（雷达图、旭日图、桑基图、柱状图等）从多维度解读故宫文化。

#### 图表类型与数据

| 图表 | 组件 | 数据源 | 说明 |
|------|------|--------|------|
| 藏品统计 | `CollectionChart` | `museum-collections.json` | 故宫馆藏品类分布 |
| 斗拱层级 | `DougongHierarchy` | `dougong-hierarchy.json` | 斗拱结构的层级关系 |
| 建筑排名 | `BuildingRankChart` | `forbidden-city-timeline.json` | 按年代/规模排列建筑 |
| 宫殿雷达 | `PalaceRadarChart` | `palace-collection-radar.json` | 多维度宫殿对比 |
| 桑基图 | `SankeyChart` | `dougong-types.json` | 斗拱类型流向关系 |

#### ECharts 集成方式

```typescript
// 使用 echarts-for-react 封装
import ReactECharts from 'echarts-for-react';

<ReactECharts
  option={chartOption}
  style={{ height: '100%', width: '100%' }}
  opts={{ renderer: 'canvas' }}
  onChartReady={(echarts) => {
    // 注册暗色/亮色主题
  }}
/>
```

#### 设计考量

- **Canvas 渲染**：大量数据点场景下优于 SVG
- **主题适配**：跟随全局亮/暗主题动态切换图表配色
- **响应式**：图表尺寸随窗口 resize 自适应
- **骨架屏**：加载中显示 `ChartSkeleton`，优化等待体验

---

### 3.5 AI 内容生成

#### 设计思路

集成**GLM-4.7-Flash API**，动态生成故宫主题诗句和斗拱结构描述。

#### API 调用封装

```typescript
export async function generateStructureInfo(
  structureName: string
): Promise<StructureInfo> {
  const prompt = `你是故宫古建筑专家，请为"${structureName}"生成专业描述...

  返回 JSON 格式：
  {
    "title": "斗拱名称",
    "subtitle": "简短副标题",
    "description": "详细描述",
    "historicalContext": "历史背景",
    "components": [...],
    "technicalParams": {...},
    "funFacts": [...]
  }`;

  const response = await fetch(GLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'GLM-4.7-Flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 400,
    }),
  });

  // 解析响应...
}
```

#### 智能缓存策略

```typescript
// 全局缓存
export const structureCache: Record<string, StructureInfo> = {};

// 预加载相邻章节的 AI 内容
export function preloadAdjacentStructures(
  currentId: string,
  chapters: Chapter[]
) {
  const index = chapters.findIndex(c => c.id === currentId);

  // 后台预生成前后章节内容
  if (index > 0 && !structureCache[chapters[index - 1].id]) {
    generateStructureInfo(chapters[index - 1].label);
  }
  if (index < chapters.length - 1 && !structureCache[chapters[index + 1].id]) {
    generateStructureInfo(chapters[index + 1].label);
  }
}
```

#### 为什么需要缓存？

**问题**：API 调用需要 500-1500ms，用户切换章节时会感觉卡顿。

**解决方案**：
1. 首次生成后存入缓存
2. 预加载相邻章节
3. 缓存命中时瞬间显示

---

## 四、样式系统设计

### 4.1 主题系统

#### CSS 变量设计

```css
:root {
  /* 亮色主题 */
  --color-bg: #faf9f7;
  --color-accent: #1a1a1a;
  --color-primary: #b91c1c;  /* 故宫红 */
  --color-secondary: #78716c;
}

[data-theme="dark"] {
  /* 暗色主题 */
  --color-bg: #1a1a1a;
  --color-accent: #faf9f7;
  --color-primary: #ef4444;  /* 亮红色 */
  --color-secondary: #a8a29e;
}
```

### 4.2 玻璃态效果

```css
/* 玻璃态面板 - 亮色 */
.glass-panel {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px 0 rgba(74, 124, 89, 0.05);
}

/* 玻璃态面板 - 暗色 */
.glass-panel-dark {
  background: rgba(250, 246, 240, 0.08);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
}
```

### 4.3 动画系统

#### 关键帧动画

```css
/* 木门飞入动画 */
@keyframes doorSwingIn {
  0% { transform: perspective(1000px) rotateY(-45deg); }
  50% { transform: perspective(1000px) rotateY(8deg); }
  100% { transform: perspective(1000px) rotateY(0deg); }
}

/* 文字上浮动画 */
@keyframes floatUp {
  0% {
    transform: translateY(40px);
    opacity: 0;
    filter: blur(8px);
  }
  100% {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0);
  }
}

/* 字符逐个浮现 */
@keyframes charFloat {
  0% {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(4px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: none;
  }
}
```

#### 为什么使用 filter: blur 动画？

**设计意图**：模拟文字从水中浮现的效果，增加高级感。

**实现原理**：
- 初始状态：文字模糊 + 透明 + 下移
- 结束状态：清晰 + 不透明 + 原位
- `filter: none` 确保模糊完全清除（避免残留）

---

## 五、性能优化策略

### 5.1 代码分割

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],                      // ~500KB
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion', 'gsap'],
        },
      },
    },
  },
});
```

### 5.2 懒加载

```typescript
// src/main.tsx
const Exhibition = lazy(() => import('./pages/Exhibition.tsx'));
const Opening = lazy(() => import('./pages/Opening.tsx'));
const Router = lazy(() => import('./pages/Router.tsx'));
const Axis = lazy(() => import('./pages/Axis.tsx'));
const Charts = lazy(() => import('./pages/Charts.tsx'));
```

### 5.3 资源预加载

| 资源类型 | 预加载策略 |
|---------|-----------|
| 3D 模型 | 预加载相邻章节 |
| AI 内容 | 后台预生成相邻章节 |
| 字体 | `font-display: swap` |
| 图片 | 懒加载 + 占位图 |

### 5.4 渲染优化

```typescript
// 节流滚动事件
const throttleMs = ANIMATION_DURATION + 50;

// 使用 useMemo 缓存计算结果
const videoBlurAmount = useMemo(() => {
  if (scrollProgress < 0.85) return 0;
  return Math.min(30, (scrollProgress - 0.85) * 200);
}, [scrollProgress]);

// 使用 will-change 提示浏览器
style={{ willChange: 'filter, opacity, transform' }}
```

---

## 六、可访问性设计

### 6.1 减少动画

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 6.2 焦点样式

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### 6.3 键盘导航

| 按键 | 功能 |
|------|------|
| `↓` / `PageDown` | 向下滚动/下一章节 |
| `↑` / `PageUp` | 向上滚动/上一章节 |
| `Home` | 回到页面顶部 |
| `End` | 滚动到页面底部 |

---

## 七、技术亮点总结

### 7.1 电影级开场动画

**创新点**：基于视频帧的滚动驱动动画，支持定格最后一帧 + 高斯模糊过渡。

**技术实现**：
- 滚动进度驱动多层 UI 状态
- CSS `filter: blur()` 实现动态模糊
- 分层渲染策略实现交叉淡入淡出

### 7.2 3D 斗拱展览

**创新点**：使用 Three.js 展示 23 种斗拱结构的 3D 模型，支持交互旋转和章节切换。

**技术实现**：
- GLTFLoader 加载 GLB 模型
- 全局模型缓存避免重复加载
- 智能预加载相邻章节

### 7.3 AI 内容生成

**创新点**：集成 GLM-4.7-Flash 大语言模型，动态生成故宫主题诗句和结构描述。

**技术实现**：
- Prompt Engineering 优化生成质量
- 结构化 JSON 输出便于解析
- 预生成 + 缓存策略提升响应速度

### 7.4 MacBook 风格加载

**创新点**：仿 Apple 开机动画的加载进度条，提升等待体验。

**技术实现**：
- 模拟进度（随机增量）
- 真实加载完成时冲刺到 100%
- Logo 飞行动画增强仪式感

### 7.5 玻璃态 UI

**创新点**：现代化的磨砂玻璃面板设计，支持亮/暗主题。

**技术实现**：
- `backdrop-filter: blur()` 实现模糊效果
- 渐变背景增强层次感
- CSS 变量实现主题切换

---

## 八、总结与展望

### 8.1 项目价值

本项目成功将现代 Web 技术与传统文化展示相结合，实现了：
- 沉浸式的用户体验
- 智能化的内容生成
- 电影级的视觉效果
- 高性能的交互响应

### 8.2 未来展望

| 方向       | 计划                   |
| -------- | -------------------- |
| VR 支持    | 添加 WebXR 支持，实现 VR 浏览 |
| 移动端优化    | 手势交互、触摸优化            |
| 更多 AI 功能 | 语音导览、多语言翻译           |
| 社交功能     | 分享、收藏、评论             |

---

*文档版本：2.0*
*更新日期：2026年4月*
