# 项目文档中心

> 紫禁匠心 -- 故宫斗拱结构沉浸式交互网站 - 技术文档导航

---

## 文档概览

本目录包含项目的完整技术文档，面向不同角色的读者。

### 文档列表

| 文档名称 | 文件名 | 目标读者 | 内容概要 |
|---------|--------|---------|---------|
| **设计思路文档** | [design-concept.md](./design-concept.md) | 所有读者 | 设计理念、架构设计、技术实现思路 |
| **设计重点难点** | [design-challenges.md](./design-challenges.md) | 开发者、评委 | 技术挑战、解决方案、性能优化 |
| **技术规格文档** | [technical-specification.md](./technical-specification.md) | 开发者、架构师 | 技术栈、架构设计、核心模块实现 |
| **使用说明** | [user-guide.md](./user-guide.md) | 用户、评委 | 功能介绍、操作指南、常见问题 |
| **运行手册** | [operation-manual.md](./operation-manual.md) | 开发者、运维 | 开发流程、构建部署、故障排查 |
| **AI 技术应用** | [ai-application.md](./ai-application.md) | 所有读者 | AI 技术在项目中的应用说明 |
| **开源组件说明** | [open-source-components.md](./open-source-components.md) | 开发者 | 开源依赖、许可证与 AI 工具 |

---

## 快速导航

### 我是用户/评委

👉 请阅读 [设计思路文档](./design-concept.md) + [使用说明](./user-guide.md)

你将了解：
- 设计理念和架构思路
- 如何访问和运行项目
- 各页面功能介绍
- 操作方式说明
- 常见问题解答

### 我是开发者

👉 请阅读 [设计思路文档](./design-concept.md) + [技术规格文档](./technical-specification.md) + [运行手册](./operation-manual.md)

你将了解：
- 设计理念和架构思路
- 项目技术架构
- 核心模块实现细节
- 开发环境配置
- 构建部署流程
- 故障排查方法

---

## 项目概述

### 基本信息

- **项目名称：** 故宫主题沉浸式交互网站
- **项目类型：** 26年计算机设计大赛参赛作品
- **技术栈：** React + TypeScript + Three.js + Vite
- **核心功能：** 开场动画、3D 展览、数字考古、中轴巡礼、AI 内容生成、知识库问答

### 目录结构

```
docs/
├── README.md                    # 本文件（文档索引）
├── design-concept.md            # 设计思路文档
├── design-challenges.md         # 设计重点难点文档
├── technical-specification.md   # 技术规格文档
├── user-guide.md               # 使用说明
├── operation-manual.md         # 运行手册
├── ai-application.md           # AI 技术应用说明
└── open-source-components.md   # 开源组件说明
```

---

## 技术亮点

### 1. 电影级开场动画

基于视频帧的滚动驱动动画，支持定格最后一帧 + 高斯模糊过渡效果。

### 2. 3D 斗拱展览

使用 Three.js 展示 23 种斗拱结构的 3D 模型，支持交互旋转和章节切换。

### 3. AI 内容生成

集成 GLM-4.7-Flash 大语言模型，动态生成故宫主题诗句和结构描述。

### 4. MacBook 风格加载

仿 Apple 开机动画的加载进度条，提升等待体验。

### 5. 数字考古

通过 ECharts 6 展示 7 种交互式数据图表，多维度解读故宫文化数据。

### 6. 中轴巡礼

Three.js 3D 场景展示故宫中轴线 11 座建筑，俯视视角呈现空间序列。

### 7. AI 知识库问答

基于 RAG + FAISS 向量检索的全局 AI 问答系统，支持引用来源追溯。

---

## 核心技术栈

```
React 19 + TypeScript 5.9
├── 框架层
│   ├── React Router DOM 7.13
│   └── Context API (状态管理)
├── 样式层
│   ├── Tailwind CSS 4.2
│   └── Google Fonts + 自定义字体
├── 3D 渲染
│   ├── Three.js 0.183
│   └── @react-three/fiber + drei
├── 数据可视化
│   └── ECharts 6 + echarts-for-react
├── 动画库
│   ├── Framer Motion 12.34
│   └── GSAP 3.14
├── AI 集成
│   ├── GLM-4.7-Flash API (智谱 AI)
│   └── RAG 后端 (Express + FAISS)
└── 状态管理
    └── Context API + useReducer
```

---

## 开发团队

- **项目灵感：** 参考 `.trae/documents/项目灵感与思路总结.md`
- **开发框架：** React + Vite
- **3D 资源：** 斗拱结构 GLB 模型

---

---

*文档版本：2.0*
*创建时间：2026年4月*
