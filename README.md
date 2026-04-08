# 故宫斗拱结构沉浸式交互网站

> 26年计算机设计大赛参赛作品 | AESTHETE - Cinematic Art Transition

---

## 版权声明

本项目为 **2026年中国大学生计算机设计大赛** 参赛作品，由参赛团队原创开发。

- **参赛赛道**：信息可视化 - 交互式信息设计
- **开源时间**：2026年4月
- **开发团队**：THE EXTRAORDINARY LAB

本项目采用 MIT 许可证开源，欢迎学习交流。如需引用或二次开发，请注明出处：

```
故宫斗拱结构沉浸式交互网站
https://github.com/LangHY/forbidden-city-structure-code
© 2026 THE EXTRAORDINARY LAB
```

---

## 项目简介

本项目是一个以**故宫古建筑**为主题的沉浸式交互网站，通过现代 Web 技术展现中国传统建筑之美。融合了 3D 可视化、AI 内容生成、电影级动画效果等前沿技术，为用户提供身临其境的文化探索体验。

### 核心功能

| 功能 | 描述 |
|------|------|
| 🎬 **电影级开场动画** | 基于视频帧的滚动驱动动画，支持定格最后一帧 + 高斯模糊过渡 |
| 🏛️ **3D 斗拱展览** | 使用 Three.js 展示 23 种斗拱结构的 3D 模型 |
| 🤖 **AI 内容生成** | 集成 GLM-4-Flash 大语言模型，动态生成诗句和结构描述 |
| 🌓 **主题切换** | 支持亮/暗主题无缝切换 |
| ⌨️ **滚轮交互** | 滚轮驱动的章节切换，带滑动动画效果 |

### 技术栈

```
React 19 + TypeScript 5.9
├── 构建工具: Vite 7.3
├── 样式: Tailwind CSS 4.2
├── 3D 渲染: Three.js + @react-three/fiber
├── 动画: Framer Motion + GSAP
└── AI: GLM-4-Flash API (智谱 AI)
```

---

## 快速开始

### 环境要求

- Node.js 18.0+
- npm 9.0+
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 安装运行

```bash
# 克隆仓库
git clone https://github.com/LangHY/forbidden-city-structure-code.git
cd forbidden-city-structure-code

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的 GLM API Key

# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 构建部署

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 在线演示

🔗 **https://replicate-website-effect.vercel.app**

---

## 页面导航

| 路径 | 页面 | 描述 |
|------|------|------|
| `/` | 开场页 | 电影风格开场动画，展示故宫意境 |
| `/router` | 路由页 | 导航门户，进入不同展厅 |
| `/exhibition` | 展览页 | 3D 斗拱结构展览，23 种类型 |
| `/charts` | 图表页 | 数据可视化，藏品统计与历史演变 |

---

## 操作指南

### 开场页

| 操作 | 效果 |
|------|------|
| **向下滚动** | 触发视频定格动画，过渡到路由页 |
| **点击右上角图标** | 切换亮/暗主题 |
| **等待 10 秒** | 自动生成新的 AI 诗句 |

### 展览页

| 操作 | 效果 |
|------|------|
| **滚轮向下/向上** | 切换到上/下一个斗拱类型 |
| **鼠标拖拽** | 旋转 3D 模型 |
| **点击左侧章节** | 直接跳转到对应章节 |
| **点击"放大"按钮** | 相机推进 20% |
| **点击"重置"按钮** | 恢复初始视角 |

---

## 📚 详细文档

### 用户文档

- [使用说明](./docs/user-guide.md) - 面向用户的功能介绍和操作指南

### 技术文档

- [技术规格文档](./docs/technical-specification.md) - 技术架构、核心模块实现
- [运行手册](./docs/operation-manual.md) - 开发环境配置、构建部署
- [AI 技术应用说明](./docs/ai-application.md) - AI 技术在项目中的应用
- [开源组件说明](./docs/open-source-components.md) - 开源代码与组件

### 文档目录

```
docs/
├── README.md                    # 文档索引
├── technical-specification.md   # 技术规格文档
├── user-guide.md               # 使用说明
├── operation-manual.md         # 运行手册
├── ai-application.md           # AI 技术应用说明
└── open-source-components.md   # 开源组件说明
```

---

## 项目结构

```
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 主应用组件
│   ├── pages/                   # 页面组件
│   │   ├── Opening.tsx          # 开场页
│   │   ├── Exhibition.tsx       # 展览页
│   │   ├── Router.tsx           # 路由页
│   │   └── Charts.tsx           # 图表页
│   ├── components/              # 组件目录
│   │   ├── opening/             # 开场页组件
│   │   ├── exhibition/          # 展览页组件
│   │   ├── router/              # 路由页组件
│   │   ├── charts/              # 图表页组件
│   │   └── ui/                  # 通用 UI 组件
│   ├── store/                   # 状态管理
│   └── styles/                  # 样式文件
├── public/
│   ├── models/structures/       # 3D 斗拱模型 (GLB)
│   ├── data/                    # 数据文件 (JSON/CSV)
│   ├── fonts/                   # 自定义字体
│   └── *.mp4                    # 视频资源
├── docs/                        # 技术文档
└── package.json
```

---

## 环境变量

| 变量名 | 描述 | 获取方式 |
|--------|------|---------|
| `VITE_GLM_API_KEY` | GLM-4-Flash API Key | [智谱 AI 开放平台](https://open.bigmodel.cn/) |

---

## 浏览器兼容性

| 浏览器 | 最低版本 | 推荐版本 |
|--------|---------|---------|
| Chrome | 90 | 最新版 |
| Firefox | 88 | 最新版 |
| Safari | 14 | 最新版 |
| Edge | 90 | 最新版 |

---

## 许可证

MIT License

---

## 致谢

- 3D 模型来源：故宫斗拱结构数字档案
- AI 服务：[智谱 AI GLM-4-Flash](https://open.bigmodel.cn/)
- 字体：[权衡度量体](https://fonts.google.com/)

---

<p align="center">
  <b>AESTHETE - Cinematic Art Transition</b><br>
  <sub>© 2026 THE EXTRAORDINARY LAB</sub>
</p>
