# 🏯 AESTHETE - 故宫主题沉浸式网站项目

> 26年计算机设计大赛作品 - 中国古建筑主题网站

---

## 一、项目概述

### 1.1 项目定位

这是一个以**故宫（紫禁城）**为主题的沉浸式交互网站项目，通过现代化的前端技术，展现中国传统建筑之美。项目旨在参加 **2026年计算机设计大赛**。

### 1.2 核心特色

- 🎬 **滚动驱动视频帧播放** - 通过滚动控制视频播放进度
- ✨ **沉浸式开场动画** - 卡片分离、闪光特效、渐入过渡
- 🤖 **AI诗句生成** - 智能生成故宫主题诗词
- 🎨 **中国风视觉设计** - 故宫红、琉璃金等主题色系

---

## 二、技术栈

### 2.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **React** | 19.2.0 | UI框架 |
| **TypeScript** | 5.9.3 | 类型安全 |
| **Vite** | 7.3.1 | 构建工具 |

### 2.2 样式方案

| 技术 | 版本 | 用途 |
|------|------|------|
| **Tailwind CSS** | 4.2.1 | 原子化CSS |
| **PostCSS** | 8.5.6 | CSS后处理 |
| **CSS Variables** | - | 主题配置 |

### 2.3 动画库

| 技术 | 版本 | 用途 |
|------|------|------|
| **GSAP** | 3.14.2 | 专业动画引擎 |
| **Framer Motion** | 12.34.3 | React动画库 |
| **ScrollTrigger** | GSAP插件 | 滚动触发动画 |

### 2.4 3D渲染

| 技术 | 版本 | 用途 |
|------|------|------|
| **Three.js** | 0.183.2 | WebGL 3D引擎 |
| **@react-three/fiber** | 9.5.0 | React Three.js封装 |
| **@react-three/drei** | 10.7.7 | Three.js工具集 |

### 2.5 UI组件库

| 技术 | 版本 | 用途 |
|------|------|------|
| **Shadcn/UI** | - | 无样式组件库 |
| **Lucide Icons** | - | 图标库 |

### 2.6 开发工具

| 技术 | 版本 | 用途 |
|------|------|------|
| **ESLint** | 9.39.1 | 代码检查 |
| **Prettier** | 3.8.1 | 代码格式化 |
| **TypeScript ESLint** | 8.48.0 | TS代码检查 |

---

## 三、项目结构

```
replicate-website-effect/
│
├── 📁 src/                          # 源代码目录
│   ├── 📄 App.tsx                   # 主应用组件
│   ├── 📄 main.tsx                  # 应用入口
│   │
│   ├── 📁 components/               # 组件目录
│   │   ├── 📁 ui/                   # UI基础组件
│   │   │   ├── 📁 AIButton/         # AI按钮组件
│   │   │   ├── 📁 Grain/            # 噪点背景组件
│   │   │   ├── 📁 Loader/           # 加载器组件
│   │   │   │   ├── index.tsx        # 主组件
│   │   │   │   ├── ProgressBar.tsx  # 进度条
│   │   │   │   ├── ProgressNum.tsx  # 进度数字
│   │   │   │   └── ProgressLabel.tsx # 进度标签
│   │   │   └── 📁 ScrollHint/       # 滚动提示组件
│   │   │
│   │   ├── 📁 layout/               # 布局组件
│   │   │   ├── 📁 Navbar/           # 导航栏组件
│   │   │   ├── 📁 UILayer/          # UI层容器
│   │   │   └── 📁 DestinationPage/  # 目标页面组件
│   │   │
│   │   └── 📁 ui/                   # Shadcn UI组件 (未使用)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (50+组件)
│   │
│   ├── 📁 store/                    # 状态管理 (待实现)
│   ├── 📁 hooks/                    # 自定义Hooks
│   ├── 📁 lib/                      # 工具函数
│   │
│   └── 📁 styles/                   # 样式文件
│       └── globals.css              # 全局样式
│
├── 📁 extracted/                    # 提取的核心模块
│   ├── 📄 types.ts                  # 类型定义
│   ├── 📄 config.ts                 # 配置常量
│   ├── 📄 utils.ts                  # 工具函数
│   ├── 📄 styles.ts                 # 样式常量
│   ├── 📄 animations.ts             # 动画配置
│   ├── 📄 api.ts                    # API接口
│   ├── 📄 hooks.ts                  # 自定义Hooks
│   ├── 📄 FrameLoader.ts            # 帧加载器
│   └── 📄 FrameLRUCache.ts          # LRU缓存
│
├── 📁 components/                   # Shadcn组件目录
│   ├── 📁 ui/                       # UI组件
│   ├── theme-provider.tsx           # 主题Provider
│   └── components.json              # Shadcn配置
│
├── 📁 app/                          # Next.js路由 (未使用)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── 📁 public/                       # 静态资源
│   ├── 📄 gugong.mp4                # 故宫视频
│   ├── 📄 pexels-jackerkun-10578436.jpg  # 图片资源
│   ├── 📄 opening.html              # 原始HTML (2443行)
│   ├── 📄 opening_backup.html       # 备份文件
│   └── 📁 stitch/                   # 拼接图片目录
│
├── 📁 .trae/                        # 项目文档
│   ├── 📁 documents/                # 文档
│   │   ├── 项目灵感与思路总结.md
│   │   ├── animation-fix-plan.md
│   │   └── ... (多个优化文档)
│   ├── 📁 specs/                    # 规格说明
│   └── 📁 skills/                   # 技能配置
│
├── 📁 dist/                         # 构建输出
├── 📁 node_modules/                 # 依赖包
├── 📁 logs/                         # 日志文件
├── 📁 plandoc/                      # 计划文档
│
├── 📄 package.json                  # 项目配置
├── 📄 vite.config.ts                # Vite配置
├── 📄 tailwind.config.ts            # Tailwind配置
├── 📄 tsconfig.json                 # TypeScript配置
├── 📄 tsconfig.app.json             # 应用TS配置
├── 📄 eslint.config.js              # ESLint配置
├── 📄 postcss.config.mjs            # PostCSS配置
├── 📄 index.html                    # 入口HTML
├── 📄 README.md                     # 项目说明
├── 📄 PROJECT_STATUS.md             # 项目状态
└── 📄 BUG_REPORT.md                 # Bug报告
```

---

## 四、核心功能模块

### 4.1 视频帧播放系统

**位置**: `extracted/FrameLoader.ts`

这是一个**渐进式帧加载器**，核心思想：

1. **关键帧优先** - 先加载每秒1帧，确保视频可立即播放
2. **按需加载** - 用户滚动时优先加载当前播放位置附近的帧
3. **空闲后台提取** - 使用 `requestIdleCallback` 在浏览器空闲时提取剩余帧
4. **保持原始分辨率** - 不做任何画质损失
5. **LRU 缓存管理** - 自动释放不活跃的帧，控制内存使用

**反向播放逻辑**:
- `idx=0` 对应视频最后一帧（时间 t=duration）
- `idx=max` 对应视频第一帧（时间 t=0）

```typescript
// 使用示例
const frameLoader = new FrameLoader(videoElement, {
  targetFps: 20,
  keyFrameInterval: 1,
  maxCacheSize: 60,
  onProgress: (info) => console.log(info),
  onKeyFramesReady: () => console.log('关键帧加载完成'),
});

await frameLoader.init();
await frameLoader.loadKeyFrames();
```

### 4.2 状态管理

**位置**: `src/store/` (待实现完整版)

使用 **Context + useReducer** 模式管理全局状态：

```typescript
// 状态结构
interface AppState {
  opening: {
    isLoading: boolean;
    loadProgress: number;
    phase: 'loading' | 'burst' | 'fadein' | 'complete';
  };
  ui: {
    isNavbarVisible: boolean;
    isScrollHintVisible: boolean;
  };
}
```

### 4.3 动画系统

**使用 GSAP ScrollTrigger** 实现滚动驱动动画：

```typescript
// 滚动配置
const scrollConfig = {
  whiteMaskFade: {
    start: 'top top',
    end: '25% top',
    scrub: 1.5,
  },
  videoScrub: {
    scrub: 0.15,
  },
  cardSplit: {
    start: 'top bottom',
    end: 'center center',
    scrub: 1,
  },
};
```

### 4.4 主题系统

**位置**: `tailwind.config.ts` + `src/styles/globals.css`

**故宫主题色系**：

| 颜色名称 | 色值 | 用途 |
|----------|------|------|
| 故宫红 | `#B91C1C` | 主色调 |
| 琉璃金 | `#D4AF37` | 强调色 |
| 石青蓝 | `#1E3A5F` | 深色背景 |
| 朱砂红 | `#B94E48` | 辅助色 |
| 玉石绿 | `#5F9EA0` | 装饰色 |
| 宣纸米 | `#FAF9F7` | 背景色 |

**动态时间系统**（规划中）：

```
🌅 清晨 (5:00-8:00)  → 暖红主题
☀️ 白昼 (8:00-17:00) → 故宫红主题
🌆 黄昏 (17:00-20:00) → 深红主题
🌙 夜晚 (20:00-5:00) → 金色主题
```

---

## 五、NPM Scripts

```json
{
  "dev": "vite",                    // 启动开发服务器
  "build": "tsc -b && vite build",  // 构建生产版本
  "lint": "eslint .",               // 代码检查
  "format": "prettier --write ...", // 格式化代码
  "preview": "vite preview"         // 预览生产构建
}
```

---

## 六、开发规范

### 6.1 代码风格

- **TypeScript 严格模式**: 启用所有严格检查
- **ESLint**: 使用 `typescript-eslint` 推荐规则
- **Prettier**: 统一代码格式化
- **路径别名**: `@/` 指向 `src/`

### 6.2 组件设计原则

```typescript
// ✅ 推荐的组件结构
src/components/ui/Loader/
├── types.ts           # 类型定义
├── index.tsx          # 主组件
├── ProgressBar.tsx    # 子组件
└── ProgressNum.tsx    # 子组件

// ✅ 使用 React.memo 优化
export default memo(Loader);

// ✅ 正确清理 GSAP Timeline
useEffect(() => {
  const tl = gsap.timeline();
  return () => tl.kill();
}, []);
```

### 6.3 Git 提交规范

```bash
feat: 添加新功能
fix: 修复Bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具相关
```

---

## 七、项目进度

### 7.1 已完成 ✅

- [x] 项目初始化
- [x] Vite + React + TypeScript 配置
- [x] Tailwind CSS v4 配置
- [x] Shadcn/UI 组件库集成
- [x] 全局样式和CSS Variables
- [x] 基础UI组件（Loader, Grain, ScrollHint, AIButton）
- [x] 布局组件（Navbar, UILayer, DestinationPage）
- [x] 状态管理架构（Context + useReducer）
- [x] 视频帧加载器（FrameLoader）
- [x] LRU缓存系统（FrameLRUCache）

### 7.2 进行中 🚧

- [ ] 视频帧播放组件
- [ ] 卡片动画系统
- [ ] 滚动驱动动画完善
- [ ] 开场动画完整实现

### 7.3 规划中 📋

- [ ] 中轴线长卷地图
- [ ] 榫卯3D爆炸图
- [ ] AI互动叙事
- [ ] 沉浸式声音设计
- [ ] 游戏化：寻找神兽
- [ ] 动态时间系统
- [ ] 多语言国际化

---

## 八、已知问题

详见 `BUG_REPORT.md`：

| 优先级 | 问题 | 状态 |
|--------|------|------|
| 🔴 P0 | Tailwind CSS 未注入 | 待修复 |
| 🔴 P0 | 图片资源不存在 | 待修复 |
| 🟡 P1 | 视频播放器渲染逻辑 | 待修复 |
| 🟡 P1 | 容器高度问题 | 待修复 |

---

## 九、开发路线图

### 第一阶段：架构重构 ✅ (已完成)

- 将 `opening.html` 改造为 React 组件
- 建立模块化架构
- 配置开发环境

### 第二阶段：核心功能 🚧 (进行中)

- 视频帧播放系统
- 卡片动画系统
- 滚动驱动动画

### 第三阶段：内容扩展 (3-4周)

- 中轴线长卷地图
- 榫卯3D模块
- 数字典藏

### 第四阶段：优化完善 (1-2周)

- 性能优化
- 移动端适配
- 跨浏览器测试

---

## 十、学习资源

| 技术点 | 资源链接 |
|--------|----------|
| GSAP ScrollTrigger | [官方教程](https://greensock.com/scrolltrigger/) |
| Three.js 基础 | [Three.js Journey](https://threejs-journey.com/) |
| React Three Fiber | [官方文档](https://docs.pmnd.rs/react-three-fiber) |
| Tailwind CSS v4 | [官方文档](https://tailwindcss.com/) |
| 中国古建筑知识 | 《中国古代建筑史》、故宫博物院官网 |

---

## 十一、团队信息

- **项目名称**: AESTHETE - Cinematic Art Transition
- **比赛**: 26年计算机设计大赛
- **主题**: 中国古建筑（故宫）
- **开发者**: ᴘɪɴ🇸 ʏɴᴏᴜɴ
- **AI助手**: Claude Sonnet 4.5

---

## 十二、快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173/

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

**文档生成时间**: 2026-03-22
**项目状态**: 🚧 开发中
**最后更新**: 阶段二重构完成

---

*此文档由 Claude Code 自动生成*
