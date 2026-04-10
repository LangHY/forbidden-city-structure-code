# 项目文档中心

> 故宫主题沉浸式交互网站 - 技术文档导航

---

## 文档概览

本目录包含项目的完整技术文档，面向不同角色的读者。

### 文档列表

| 文档名称 | 文件名 | 目标读者 | 内容概要 |
|---------|--------|---------|---------|
| **技术规格文档** | [technical-specification.md](./technical-specification.md) | 开发者、架构师 | 技术栈、架构设计、核心模块实现 |
| **使用说明** | [user-guide.md](./user-guide.md) | 用户、评委 | 功能介绍、操作指南、常见问题 |
| **运行手册** | [operation-manual.md](./operation-manual.md) | 开发者、运维 | 开发流程、构建部署、故障排查 |

---

## 快速导航

### 我是用户/评委

👉 请阅读 [使用说明](./user-guide.md)

你将了解：
- 如何访问和运行项目
- 各页面功能介绍
- 操作方式说明
- 常见问题解答

### 我是开发者

👉 请阅读 [技术规格文档](./technical-specification.md) + [运行手册](./operation-manual.md)

你将了解：
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
- **核心功能：** 开场动画、3D 展览、AI 内容生成

### 目录结构

```
docs/
├── README.md                    # 本文件（文档索引）
├── technical-specification.md   # 技术规格文档
├── user-guide.md               # 使用说明
└── operation-manual.md         # 运行手册
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

### 5. 智能预加载

预加载相邻章节的模型和数据，实现流畅切换。

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
├── 动画库
│   ├── Framer Motion 12.34
│   └── GSAP 3.14
└── AI 集成
    └── GLM-4.7-Flash API (智谱 AI)
```

---

## 开发团队

- **项目灵感：** 参考 `.trae/documents/项目灵感与思路总结.md`
- **开发框架：** React + Vite
- **3D 资源：** 斗拱结构 GLB 模型

---

## 联系方式

- **问题反馈：** [[GitHub Issues]](https://github.com/LangHY/forbidden-city-structure-code/issues)
- **项目地址：** [[GitHub Repository]](https://github.com/LangHY/forbidden-city-structure-code)

---

*文档版本：1.0*
*创建时间：2026年4月*
