# 开源代码与组件说明

> 故宫斗拱结构沉浸式交互网站 - 技术栈与开源组件详解

---

## 一、开源技术栈概览

| 层级        | 技术            | 版本      | 许可证        | 用途          |
| --------- | ------------- | ------- | ---------- | ----------- |
| **框架**    | React         | 19.2.0  | MIT        | 前端 UI 框架    |
| **构建**    | Vite          | 7.3.1   | MIT        | 开发服务器与打包    |
| **语言**    | TypeScript    | 5.9.3   | Apache-2.0 | 类型安全        |
| **样式**    | Tailwind CSS  | 4.2.1   | MIT        | 原子化 CSS     |
| **3D 渲染** | Three.js      | 0.183.2 | MIT        | WebGL 3D 引擎 |
| **动画**    | Framer Motion | 12.34.3 | MIT        | React 动画库   |
| **动画**    | GSAP          | 3.14.2  | GreenSock  | 高性能动画       |
| **路由**    | React Router  | 7.13.1  | MIT        | 单页应用路由      |

---

## 二、核心开源组件

### 2.1 React 生态

#### React 19.2.0
- **官网**：https://react.dev/
- **GitHub**：https://github.com/facebook/react
- **许可证**：MIT License
- **用途**：项目核心框架，组件化开发
- **关键特性**：
  - Server Components 支持
  - 改进的并发渲染
  - 新的 Hooks API

#### React Router DOM 7.13.1
- **官网**：https://reactrouter.com/
- **GitHub**：https://github.com/remix-run/react-router
- **许可证**：MIT License
- **用途**：页面路由管理
- **本项目使用**：
  - 路由配置（`/`, `/exhibition`, `/charts`, `/router`）
  - 懒加载页面组件
  - `useNavigate` 导航跳转

---

### 2.2 3D 可视化

#### Three.js 0.183.2
- **官网**：https://threejs.org/
- **GitHub**：https://github.com/mrdoob/three.js
- **许可证**：MIT License
- **用途**：3D 渲染引擎
- **本项目使用**：
  - GLTFLoader 加载斗拱模型
  - 场景、相机、灯光配置
  - 模型缩放与定位

#### @react-three/fiber 9.5.0
- **官网**：https://docs.pmnd.rs/react-three-fiber
- **GitHub**：https://github.com/pmndrs/react-three-fiber
- **许可证**：MIT License
- **用途**：Three.js 的 React 封装
- **本项目使用**：
  - `<Canvas>` 画布组件
  - `useFrame` 动画循环
  - `useThree` 获取 Three.js 对象

#### @react-three/drei 10.7.7
- **官网**：https://github.com/pmndrs/drei
- **GitHub**：https://github.com/pmndrs/drei
- **许可证**：MIT License
- **用途**：React Three Fiber 工具集
- **本项目使用**：
  - `<OrbitControls>` 相机控制
  - `<PerspectiveCamera>` 透视相机

---

### 2.3 动画库

#### Framer Motion 12.34.3
- **官网**：https://www.framer.com/motion/
- **GitHub**：https://github.com/framer/motion
- **许可证**：MIT License
- **用途**：React 动画库
- **本项目使用**：
  - 页面过渡动画
  - 组件入场/出场动画
  - 手势交互

#### GSAP 3.14.2
- **官网**：https://greensock.com/gsap/
- **GitHub**：https://github.com/greensock/GSAP
- **许可证**：GreenSock Standard License（免费商用）
- **用途**：高性能 JavaScript 动画
- **本项目使用**：
  - 滚动驱动动画
  - 时间轴动画控制
  - 缓动函数

---

### 2.4 样式工具

#### Tailwind CSS 4.2.1
- **官网**：https://tailwindcss.com/
- **GitHub**：https://github.com/tailwindlabs/tailwindcss
- **许可证**：MIT License
- **用途**：原子化 CSS 框架
- **本项目使用**：
  - 响应式布局
  - 主题切换（亮/暗）
  - 动画类名
  - 自定义 CSS 变量

---

### 2.5 开发工具

#### Vite 7.3.1
- **官网**：https://vitejs.dev/
- **GitHub**：https://github.com/vitejs/vite
- **许可证**：MIT License
- **用途**：下一代前端构建工具
- **本项目使用**：
  - 开发服务器（HMR）
  - 生产构建
  - 代码分割
  - 路径别名配置

#### TypeScript 5.9.3
- **官网**：https://www.typescriptlang.org/
- **GitHub**：https://github.com/microsoft/TypeScript
- **许可证**：Apache-2.0 License
- **用途**：类型安全的 JavaScript 超集
- **本项目使用**：
  - 类型定义
  - 接口声明
  - 类型检查

#### ESLint 9.39.1 + Prettier 3.8.1
- **ESLint GitHub**：https://github.com/eslint/eslint
- **Prettier GitHub**：https://github.com/prettier/prettier
- **许可证**：MIT License
- **用途**：代码质量与格式化
- **本项目使用**：
  - React Hooks 规则
  - TypeScript 规则
  - 代码自动格式化

---

## 三、第三方 API 服务

### 3.1 GLM-4-Flash API
- **提供商**：智谱 AI
- **官网**：https://open.bigmodel.cn/
- **用途**：AI 文本生成
- **调用场景**：
  - 诗句生成（开场页）
  - 斗拱结构描述（展览页）

---

## 四、数据可视化工具

### 4.1 Flourish 图表模板

- **平台**：Flourish (https://flourish.studio/)
- **用途**：数据可视化图表展示
- **本项目使用**：
  - 功能流向图（桑基图）
  - 藏品统计图
  - 斗拱结构层级图
  - 建筑等级散点图

**版权声明**：

本项目使用 Flourish 平台的图表模板进行数据可视化展示。根据 Flourish 服务条款：
- 图表模板版权归 Flourish 所有
- 数据内容由项目团队独立采集、整理和维护
- 图表逻辑、数据处理和视觉配置由团队自主设计
- 嵌入式展示遵循 Flourish 免费版许可协议

**数据来源**：
- `public/data/building-density-heatmap.csv` - 建筑密度热力图数据
- `public/data/dougong-building-sankey.csv` - 斗拱建筑桑基图数据
- `public/data/doupan-building-rank.csv` - 斗拱踩数与建筑等级数据

---

## 五、开源资源

### 5.1 3D 模型
- **格式**：GLB (glTF Binary)
- **位置**：`public/models/structures/`
- **数量**：23 个斗拱模型
- **工具**：FBX 转 GLB（fbx2gltf）

### 5.2 字体资源
| 字体          | 来源           | 许可证 |
| ----------- | ------------ | --- |
| Literata    | Google Fonts | OFL |
| Nunito Sans | Google Fonts | OFL |
| 权衡度量体       | 本地           | -   |

### 5.3 视频素材
- **文件**：`gugong_reverse.mp4`
- **来源**：AI 生成（Seedance 2.0）
- **用途**：开场页背景视频

---

## 六、许可证声明

本项目使用的所有开源组件许可证：

| 许可证 | 组件 |
|--------|------|
| **MIT** | React, Vite, Three.js, Tailwind CSS, Framer Motion, React Router, @react-three/fiber, @react-three/drei |
| **Apache-2.0** | TypeScript |
| **OFL** | Google Fonts |
| **GreenSock** | GSAP |
| **Flourish TOS** | 图表模板（数据版权归团队所有） |

---

## 七、致谢

感谢以下开源社区和平台的贡献：
- React 团队
- Three.js 社区
- Tailwind CSS 团队
- Vite 团队
- Flourish 数据可视化平台
- 所有开源贡献者

---

*文档版本：1.1*
*更新时间：2026年4月*
