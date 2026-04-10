# 技术规格文档

> 故宫主题沉浸式交互网站 - 26年计算机设计大赛参赛作品

---

## 一、项目概述

### 1.1 项目定位

本项目是一个以**故宫古建筑**为主题的沉浸式交互网站，旨在通过现代 Web 技术展现中国传统建筑之美。项目融合了 3D 可视化、AI 内容生成、电影级动画效果等前沿技术，为用户提供身临其境的文化探索体验。

### 1.2 核心功能

| 功能模块 | 描述 |
|---------|------|
| **开场动画** | 电影风格的视频滚动动画，展示故宫意境 |
| **AI 诗句生成** | 集成 GLM-4-Flash API，自动生成故宫主题诗句 |
| **斗拱 3D 展览** | 使用 Three.js 展示 23 种斗拱结构的 3D 模型 |
| **中轴巡礼** | 故宫中轴线 11 个建筑的 3D 透视切换展示 |
| **主题切换** | 支持亮/暗主题无缝切换 |
| **章节导航** | 滚轮驱动的章节切换，带滑动动画效果 |

### 1.3 技术亮点

- **电影级开场动画**：基于视频帧的滚动驱动动画，支持定格最后一帧 + 高斯模糊过渡
- **AI 内容生成**：集成大语言模型，动态生成诗句和结构描述
- **3D 模型预加载**：智能预加载相邻章节模型，实现流畅切换
- **MacBook 风格加载**：仿 Apple 开机动画的加载进度条
- **玻璃态 UI**：现代化的磨砂玻璃面板设计

---

## 二、技术架构

### 2.1 技术栈总览

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
│  字体      │  Google Fonts (Literata, Nunito Sans)         │
│           │  + 自定义字体 (权衡度量体)                       │
├─────────────────────────────────────────────────────────────┤
│  3D 渲染   │  Three.js 0.183 + @react-three/fiber          │
│           │  @react-three/drei (相机控制)                   │
├─────────────────────────────────────────────────────────────┤
│  动画库    │  Framer Motion 12.34 + GSAP 3.14              │
├─────────────────────────────────────────────────────────────┤
│  AI 集成   │  GLM-4-Flash API (智谱 AI)                    │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 项目目录结构

```
replicate-website-effect/
├── src/
│   ├── main.tsx                 # 应用入口，路由配置
│   ├── App.tsx                  # 主应用组件
│   ├── pages/                   # 页面组件
│   │   ├── Opening.tsx          # 开场页
│   │   ├── Exhibition.tsx       # 斗拱展览页
│   │   ├── Router.tsx           # 路由导航页
│   │   ├── Charts.tsx           # 数字考古页
│   │   └── Axis.tsx             # 中轴巡礼页
│   ├── components/
│   │   ├── opening/             # 开场页组件
│   │   │   ├── index.tsx        # 主组件
│   │   │   ├── HeroCanvas.tsx   # 英雄区画布
│   │   │   ├── SubjectVideo.tsx # 视频层
│   │   │   ├── PerspectiveGrid.tsx # 透视网格背景
│   │   │   ├── BottomHUD.tsx    # 底部 HUD
│   │   │   ├── TopAppBar.tsx    # 顶部导航栏
│   │   │   ├── Crosshair.tsx    # 十字准星装饰
│   │   │   ├── NarrativeAnchor.tsx # 叙事锚点
│   │   │   ├── hooks/
│   │   │   │   └── useScrollProgress.ts # 滚动进度 Hook
│   │   │   ├── context/
│   │   │   │   └── ScrollProgressContext.tsx # 滚动进度上下文
│   │   │   ├── services/
│   │   │   │   └── llmService.ts # AI 诗句生成服务
│   │   │   └── types.ts         # 类型定义
│   │   ├── exhibition/          # 展览页组件
│   │   │   ├── index.tsx        # 主组件
│   │   │   ├── ExhibitionCanvas.tsx # 3D 画布
│   │   │   ├── ExhibitionNav.tsx # 顶部导航
│   │   │   ├── ChapterNav.tsx   # 左侧章节导航
│   │   │   ├── InfoCard.tsx     # 右侧信息卡片
│   │   │   ├── BottomControls.tsx # 底部控件
│   │   │   ├── DecorativeChar.tsx # 装饰文字
│   │   │   ├── BootLoader.tsx   # MacBook 风格加载
│   │   │   ├── config.ts        # 配置数据
│   │   │   ├── services/
│   │   │   │   └── llmService.ts # AI 结构描述生成
│   │   │   └── types.ts         # 类型定义
│   │   ├── router/              # 路由页组件
│   │   │   ├── index.tsx        # 主组件
│   │   │   ├── RouterBackground.tsx
│   │   │   ├── RouterNavZone.tsx
│   │   │   ├── RouterSideHUD.tsx
│   │   │   ├── RouterFooter.tsx
│   │   │   └── RouterDecorations.tsx
│   │   ├── axis/                # 中轴巡礼组件
│   │   │   ├── AxisCanvas.tsx   # 3D 透视画布
│   │   │   └── AxisInfoPanel.tsx # 信息面板（已弃用）
│   │   ├── ui/                  # 通用 UI 组件
│   │   │   ├── Grain.tsx        # 噪点效果
│   │   │   ├── Loader.tsx       # 加载器
│   │   │   ├── ScrollHint.tsx   # 滚动提示
│   │   │   ├── AIButton.tsx     # AI 按钮
│   │   │   └── ErrorBoundary.tsx # 错误边界
│   │   └── layout/              # 布局组件
│   │       ├── Navbar.tsx
│   │       ├── UILayer.tsx
│   │       └── DestinationPage.tsx
│   ├── store/
│   │   └── index.tsx            # 全局状态管理
│   ├── styles/
│   │   └── globals.css          # 全局样式
│   ├── hooks/                   # 自定义 Hooks
│   └── lib/
│       └── utils.ts             # 工具函数
├── public/
│   ├── models/
│   │   └── structures/          # 斗拱 3D 模型 (GLB 格式)
│   │       ├── R1L1.glb ~ R5L5.glb
│   ├── axis/                    # 中轴线建筑图片
│   │   ├── 午门.webp
│   │   ├── 太和殿.png
│   │   └── ...
│   ├── fonts/
│   │   └── 权衡度量体.ttf       # 中文装饰字体
│   ├── gugong_reverse.mp4       # 开场视频
│   └── *.jpg                    # 图片资源
├── docs/                        # 技术文档
├── vite.config.ts               # Vite 配置
├── tailwind.config.ts           # Tailwind 配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # 依赖配置
```

### 2.3 架构图

```
┌────────────────────────────────────────────────────────────────┐
│                        应用入口 (main.tsx)                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  BrowserRouter                                           │  │
│  │  ├── ErrorBoundary                                       │  │
│  │  │   └── Suspense (懒加载)                               │  │
│  │  │       ├── /          → Opening                        │  │
│  │  │       ├── /router    → Router                         │  │
│  │  │       ├── /exhibition → Exhibition                    │  │
│  │  │       └── /charts    → Charts                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                    状态管理层 (store/index.tsx)                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AppProvider (Context)                                   │  │
│  │  ├── opening: { isLoading, loadProgress, phase }         │  │
│  │  └── ui: { isNavbarVisible, isScrollHintVisible }        │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                     服务层 (Services)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  LLM Service (opening)                                   │  │
│  │  └── generatePoem() → GLM-4-Flash API                    │  │
│  │                                                          │  │
│  │  LLM Service (exhibition)                                │  │
│  │  └── generateStructureInfo() → GLM-4-Flash API           │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────┐
│                       组件层 (Components)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │   Opening   │  │  Exhibition │  │   Router    │            │
│  │  (开场页)   │  │  (展览页)   │  │  (导航页)   │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
│        │                │                │                     │
│        ▼                ▼                ▼                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ HeroCanvas  │  │Canvas(3D)   │  │ Background  │            │
│  │ VideoLayer  │  │ InfoCard    │  │ NavZone     │            │
│  │ Grid        │  │ ChapterNav  │  │ SideHUD     │            │
│  └─────────────┘  └─────────────┘  └─────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

---

## 三、核心模块详解

### 3.1 开场页 (Opening)

#### 3.1.1 滚动驱动动画系统

```typescript
// src/components/opening/hooks/useScrollProgress.ts
// 核心逻辑：监听滚动事件，计算 0-1 的进度值

export function useScrollProgress(): number {
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

**动画阶段映射：**

| 滚动进度 | 触发效果 |
|---------|---------|
| 0 - 0.5 | 正常显示 Opening UI |
| 0.5 - 0.7 | Opening UI 开始淡出 |
| 0.7 - 0.85 | 背景网格模糊 + 视频层模糊 |
| 0.85 - 1.0 | Router UI 由模糊到清晰 |

#### 3.1.2 视频定格 + 模糊过渡

```typescript
// src/components/opening/index.tsx (关键代码片段)

// 视频层模糊效果（progress > 0.85 时开始模糊）
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

#### 3.1.3 AI 诗句生成服务

```typescript
// src/components/opening/services/llmService.ts

export async function generatePoem(forceNew = false): Promise<PoemData> {
  const prompt = `你是故宫文化专家，请生成一句描写故宫的诗句...
  返回 JSON: { "left": "前半句", "right": "后半句" }`;

  const response = await fetch(GLM_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    }),
  });

  // 解析返回结果...
}
```

---

### 3.2 展览页 (Exhibition)

#### 3.2.1 3D 模型加载系统

```typescript
// src/components/exhibition/ExhibitionCanvas.tsx

// 全局模型缓存
const modelCache = new Map<string, THREE.Group>();

// 模型预加载函数
function preloadModel(modelId: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    if (modelCache.has(modelId)) {
      resolve(modelCache.get(modelId)!);
      return;
    }

    const modelPath = `/models/structures/${modelId}.glb`;
    loader.load(modelPath, (gltf) => {
      // 计算包围盒，缩放到合适大小
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4 / maxDim;
      gltf.scene.scale.setScalar(scale);

      // 缓存模型
      modelCache.set(modelId, gltf.scene.clone());
      resolve(gltf.scene);
    });
  });
}

// 智能预加载相邻章节
export function preloadAdjacentModels(currentChapterId: string) {
  const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
  // 预加载前后各一个模型
  if (currentIndex > 0) preloadModel(chapters[currentIndex - 1].modelId);
  if (currentIndex < chapters.length - 1) preloadModel(chapters[currentIndex + 1].modelId);
}
```

#### 3.2.2 滚轮切换章节系统

```typescript
// src/components/exhibition/index.tsx

// 滚轮事件处理 - 节流控制
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

#### 3.2.3 MacBook 风格加载动画

```typescript
// src/components/exhibition/BootLoader.tsx

// 加载进度模拟
useEffect(() => {
  if (!isBooting) return;

  const interval = setInterval(() => {
    setBootProgress(prev => {
      if (prev >= 90) return prev; // 等待真实加载完成
      const increment = Math.random() * LOADING_SPEED + 0.5;
      return Math.min(prev + increment, 90);
    });
  }, 50);

  return () => clearInterval(interval);
}, [isBooting]);
```

#### 3.2.4 相机控制系统

```typescript
// 相机控制 Hook
export function useCameraControl() {
  const [actions] = useState(() => {
    const listeners = new Set<(action: CameraControlAction) => void>();
    return {
      trigger: (action: CameraControlAction) => {
        listeners.forEach(cb => cb(action));
      },
      subscribe: (callback) => {
        listeners.add(callback);
        return () => listeners.delete(callback);
      }
    };
  });
  return actions;
}

// 支持的动作
type CameraControlAction = 'zoomIn' | 'resetView' | 'modelSlideUp' | 'modelSlideDown';
```

---

### 3.3 路由页 (Router)

#### 3.3.1 主题系统

```typescript
// src/components/router/index.tsx

const [theme, setTheme] = useState<RouterTheme>('light');

// 主题配置
const themeConfig = {
  light: {
    bg: 'bg-[#f9f7f2]',
    text: 'text-[#2a2520]',
  },
  dark: {
    bg: 'bg-[#111413]',
    text: 'text-[#e1e3e1]',
  },
};
```

---

## 四、数据流设计

### 4.1 章节数据

```typescript
// src/components/exhibition/config.ts

export const chapters: Chapter[] = [
  { id: 'zhong-gong-su-fang', label: '重栱素方' },
  { id: 'dai-ang-zhuan-jiao', label: '带昂转角铺作' },
  { id: 'shu-zhu-duo-ceng', label: '竖柱式多层' },
  // ... 共 23 种斗拱类型
];

// 章节与 3D 模型映射
export const chapterModelMap: Record<string, string> = {
  'zhong-gong-su-fang': 'R1L1',
  'dai-ang-zhuan-jiao': 'R1L2',
  // ...
};
```

### 4.2 LLM 响应数据结构

```typescript
// 展览页结构信息
interface StructureInfo {
  title: string;              // 标题
  subtitle: string;           // 副标题
  description: string;        // 描述
  historicalContext: string;  // 历史背景
  components: ComponentData[]; // 构件列表
  technicalParams: TechnicalParams; // 技术参数
  funFacts: string[];         // 趣味知识
}

// 开场页诗句
interface PoemData {
  left: string;   // 诗句前半句
  right: string;  // 诗句后半句
}
```

---

## 五、样式系统

### 5.1 CSS 变量

```css
:root {
  /* 主题色 */
  --color-bg: #faf9f7;
  --color-accent: #1a1a1a;
  --color-primary: #b91c1c;
  --color-secondary: #78716c;

  /* 玻璃态效果 */
  --glass-bg: rgba(255, 255, 255, 0.15);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-blur: 12px;

  /* 动画时长 */
  --duration-fast: 200ms;
  --duration-normal: 400ms;
  --duration-slow: 800ms;
}

[data-theme="dark"] {
  --color-bg: #1a1a1a;
  --color-accent: #faf9f7;
  --color-primary: #ef4444;
}
```

### 5.2 动画关键帧

```css
/* 木门飞入动画 */
@keyframes doorSwingIn {
  0% { transform: perspective(1000px) rotateY(-45deg); }
  50% { transform: perspective(1000px) rotateY(8deg); }
  100% { transform: perspective(1000px) rotateY(0deg); }
}

/* 文字上浮动画 */
@keyframes floatUp {
  0% { transform: translateY(40px); opacity: 0; filter: blur(8px); }
  100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}

/* 诗句模糊渐显 */
@keyframes charFloat {
  0% { opacity: 0; transform: translateY(12px); filter: blur(4px); }
  100% { opacity: 1; transform: translateY(0); filter: none; }
}
```

---

## 六、性能优化

### 6.1 代码分割

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],                      // ~500KB
          'three-fiber': ['@react-three/fiber', '@react-three/drei'], // ~300KB
          'react-vendor': ['react', 'react-dom', 'react-router-dom'], // ~150KB
          'animation': ['framer-motion', 'gsap'],  // ~200KB
        },
      },
    },
  },
});
```

### 6.2 懒加载

```typescript
// src/main.tsx
const Exhibition = lazy(() => import('./pages/Exhibition.tsx'));
const Opening = lazy(() => import('./pages/Opening.tsx'));
const Router = lazy(() => import('./pages/Router.tsx'));
```

### 6.3 模型缓存

```typescript
// 全局模型缓存，避免重复加载
const modelCache = new Map<string, THREE.Group>();

// 智能预加载：只加载当前章节前后各一个模型
export function preloadAdjacentModels(currentChapterId: string) {
  // 预加载策略...
}
```

### 6.4 节流控制

```typescript
// 滚轮事件节流：500ms 内只响应一次
const throttleMs = ANIMATION_DURATION + 50;

const handleWheel = (e: WheelEvent) => {
  const now = Date.now();
  if (now - lastTime < throttleMs) return;
  // ...
};
```

---

## 七、API 接口

### 7.1 GLM-4-Flash API

**请求地址：** `https://open.bigmodel.cn/api/paas/v4/chat/completions`

**请求示例：**

```typescript
const response = await fetch(GLM_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'glm-4-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 400,
  }),
});
```

**返回格式：**

```json
{
  "choices": [
    {
      "message": {
        "content": "{\"title\": \"重栱素方\", ...}"
      }
    }
  ]
}
```

---

## 八、环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| `VITE_GLM_API_KEY` | GLM-4-Flash API Key | (内置) |

---

## 九、浏览器兼容性

| 浏览器 | 最低版本 | 备注 |
|--------|---------|------|
| Chrome | 90+ | 推荐使用 |
| Firefox | 88+ | - |
| Safari | 14+ | 需要 WebGL 2.0 |
| Edge | 90+ | - |

**关键特性依赖：**
- WebGL 2.0 (Three.js)
- CSS backdrop-filter (玻璃态效果)
- ES2020+ (可选链、空值合并)
- ResizeObserver

---

## 十、安全考虑

### 10.1 API Key 保护

```typescript
// API Key 硬编码在代码中（仅用于演示）
// 生产环境应使用环境变量：
const apiKey = import.meta.env.VITE_GLM_API_KEY;
```

### 10.2 XSS 防护

- React 自动转义 HTML
- 用户输入不直接渲染

### 10.3 CORS 处理

- API 调用由客户端直接发起
- 服务端已配置 CORS 头

---

*文档版本：1.0*
*最后更新：2026年4月*
