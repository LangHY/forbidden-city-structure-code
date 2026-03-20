# Role
你是一位拥有 10 年经验的高级前端工程师和 UI/UX 设计师，擅长像素级还原高端创意类网站（如摄影师/导演作品集），精通 React + TypeScript + Tailwind CSS，熟悉 GSAP 或 Framer Motion 动画库，对电影感排版、沉浸式滚动体验和响应式适配有深刻理解。

# Task
请根据提供的参考截图，完整复现一个名为 “Jason Bergh” 的个人创意作品集首页。页面需具备强烈的电影氛围、极简主义美学与动态交互感，所有元素必须严格对齐原图视觉比例、字体层级、色彩系统与空间节奏。

# Design Analysis & Requirements

## 1. 整体布局 (Layout)
- 全屏背景视频/图像层（模糊处理）作为底层视觉基底。
- 中央垂直主轴：顶部小尺寸预览视频 → 中部大标题“Ismael Cruz Cordova”横跨画面 → 底部小型视频缩略图。
- 左右两侧对称分布导航菜单与信息模块。
- 右侧固定悬浮按钮组（网格切换 + 主题切换）。
- 底部横向信息栏：左侧版权年份 + 切换模式滑块 / 列表；右侧分类筛选器 + 时间码 + credits 链接。
- 使用绝对定位 + z-index 分层控制，确保文字始终在最上层且不被背景干扰。

## 2. 视觉风格 (Visual Style)

### 配色方案
- 主背景色：深灰黑 #1a1a1a（带轻微噪点纹理）
- 文字主色：米白/奶油色 #f5e6d3（高对比度，非纯白）
- 辅助强调色：淡粉红 #ff6b8b（用于图标 hover）、浅灰 #cccccc（次要文本）
- 边框/分割线：半透明白 rgba(255,255,255,0.1)

### 字体排版
- 品牌名 “Jason Bergh”：衬线体（类似 Playfair Display 或 Cormorant Garamond），字号 24px，字重 700，左上角固定。
- 主标题 “Ismael Cruz Cordova”：超大号衬线体（同品牌字体），字号 96px+，居中横跨屏幕，字母间距宽松，略微倾斜营造动感。
- 分类标签（FASHION FILM / EDITORIAL / FLAUNT）：无衬线体（Inter 或 Helvetica Neue），字号 12px，全大写，字重 500，颜色 #cccccc。
- 导航项（WORK REPORTAGE / ARCHIVE ABOUT / CONTACT）：无衬线体，字号 14px，字重 400，右对齐排列。
- 底部元数据（©2026, SLIDER/LIST, ALL (42), TV & FILM...）：等宽字体（JetBrains Mono 或 Roboto Mono），字号 11px，颜色 #999999。

### 圆角与阴影
- 所有卡片/视频容器：无边框、无圆角、无阴影 —— 强调扁平化与真实影像融合。
- 悬浮按钮：圆形，直径 40px，背景半透明黑 rgba(0,0,0,0.6)，内嵌图标白色。
- 视频预览框：细边框 1px solid rgba(255,255,255,0.2)，四角微圆角 4px。

### 间距系统
- 垂直方向以 8px 为基础单位，关键区域使用 16px / 24px / 32px 增量。
- 水平方向保持左右对称，边距约 5%~8% 屏幕宽度。
- 标题与副标题之间留白至少 48px，避免拥挤。

## 3. 组件细节 (Component Details)

### 顶部导航区
- 左上角：“Jason Bergh” 品牌标识，静态不动。
- 中上部：“CREATIVE” 标签，前缀实心圆点 •，字号 12px，颜色 #f5e6d3。
- 右上角三列导航：
  - 第一列：“WORK REPORTAGE”
  - 第二列：“ARCHIVE ABOUT”
  - 第三列：“CONTACT”
  - 均为无衬线体，hover 时变为 #ff6b8b 并下划线动画。

### 中央内容区
- 上方小视频窗口：位于顶部中央偏上，尺寸约为 320x180px，播放状态显示 NPR logo 水印。
- 主标题 “Ismael Cruz Cordova”：
  - “Ismael” 在左，“Cruz Cordova” 在右，中间由人物侧脸自然分隔。
  - 字体大小随视口缩放，最小不低于 64px。
  - 添加 subtle text-shadow: 0 2px 10px rgba(0,0,0,0.5) 提升可读性。
- 下方小视频窗口：位于底部中央，尺寸同上，展示舞台表演场景。
- 标签叠加层：
  - “FASHION FILM” 在上部中央，“EDITORIAL” 在右上，“FLAUNT” 在下部中央。
  - 均置于半透明黑色蒙版之上，增强辨识度。

### 右侧悬浮控件
- 两个圆形按钮垂直排列于右侧边缘（距右边界 20px）：
  - 上按钮：网格图标（代表 Gallery View），默认激活态。
  - 下按钮：调色板图标（代表 Theme Toggle），点击切换亮暗模式。
  - Hover 时背景变亮，图标变色至 #ff6b8b。

### 底部信息栏
- 左下角：
  - “© 2026” 固定显示。
  - “SLIDER / LIST” 切换开关，当前选中项加粗并高亮。
- 右下角：
  - 分类过滤器：“ALL (42)”、“TV & FILM”、“COMMERCIAL”、“EDITORIAL”，纵向排列。
  - 时间码 “02:52:13” 显示在分类下方，等宽字体。
  - “CREDITS” 链接靠最右，点击跳转至致谢页。

## 4. 交互与响应式 (Interaction & Responsiveness)

### 交互状态
- 所有可点击元素（导航、按钮、分类）均需定义：
  - `hover`: 颜色变化 + 微缩放 transform scale(1.05)
  - `active`: 颜色加深 + 快速 fade-in/out 过渡
  - `focus`: 外发光 outline: 2px solid #ff6b8b
- 视频预览框支持点击放大模态窗（暂不实现功能，仅预留结构）。
- 主题切换按钮触发全局 CSS variable 更新（--bg-color, --text-color）。

### 动画效果
- 页面加载时：主标题从透明度 0 → 1，伴随轻微 upward slide-in（duration: 800ms, ease-out）。
- 滚动时：背景视频缓慢 parallax 移动（速度系数 0.3）。
- 鼠标移动时：主标题轻微跟随 cursor 偏移（max 10px），制造立体感。
- 分类切换时：列表项 fade-out → fade-in（duration: 300ms）。

### 响应式断点
- Desktop (>1024px)：完整布局，多栏并列。
- Tablet (768px–1024px)：
  - 主标题缩小至 72px，取消左右分拆，改为单行居中。
  - 右侧悬浮按钮移至底部角落。
  - 底部信息栏折叠为两行。
- Mobile (<768px)：
  - 隐藏部分装饰性标签（如 FASHION FILM / EDITORIAL）。
  - 主标题进一步缩小至 48px，允许换行。
  - 导航菜单收拢为汉堡菜单（暂未实现，预留接口）。
  - 视频预览框自动调整为 100% 宽度，高度按比例维持。

# Technical Constraints
- 框架：React 18 + TypeScript
- 样式：Tailwind CSS v3+（启用 JIT 模式），禁止内联样式。
- 图标：Lucide-react（Grid, Palette, ChevronDown 等）
- 动画：Framer Motion（用于入场动画与 hover 效果）
- 字体：通过 Google Fonts 引入 Playfair Display + Inter + JetBrains Mono
- 语义化 HTML：使用 `<header>`, `<main>`, `<section>`, `<footer>` 等标签。
- 无障碍：所有按钮添加 aria-label，图片设置 alt 属性（即使为装饰也写 empty string）。
- 性能优化：懒加载视频资源，使用 IntersectionObserver 控制动画触发。

# Output Format
请直接输出以下文件内容：

1. `App.tsx` — 主应用入口，包含路由结构与全局 provider。
2. `HomePage.tsx` — 核心页面组件，整合所有视觉模块。
3. `components/Navbar.tsx` — 顶部导航栏。
4. `components/HeroTitle.tsx` — 主标题组件（含动画）。
5. `components/VideoPreview.tsx` — 视频预览卡片。
6. `components/SidebarControls.tsx` — 右侧悬浮按钮组。
7. `components/FooterBar.tsx` — 底部信息栏。
8. `styles/globals.css` — 全局变量与基础重置。
9. `tailwind.config.js` — 自定义主题配置（字体、颜色、动画）。

每个文件需独立完整，无需额外说明。代码应可直接复制粘贴运行。