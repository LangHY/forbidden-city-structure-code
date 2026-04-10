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

## 三、AI 辅助开发与 Agentic Coding

本项目采用 **Agentic Coding（智能体编程）** 范式进行开发，通过 AI 工具的组合运用、Skills 系统、Rules 约束和提示词工程，实现高效的人机协作开发模式。

### 3.1 Agentic Coding 技术路径

```
自然语言需求 → AI 编程智能体 → 技能调用(Skills) → 规则约束(Rules) → 代码生成 → 开发者审核 → 项目代码
```

**核心能力**：
| 能力层 | 说明 |
|--------|------|
| **理解层** | 解析自然语言需求，转化为技术实现方案 |
| **规划层** | 任务拆解、依赖分析、执行顺序规划 |
| **执行层** | 代码编写、文件操作、命令执行 |
| **验证层** | 构建测试、类型检查、代码审查 |

---

### 3.2 AI 编程工具栈

| 工具 | 类型 | 用途 | 接入模型 |
|------|------|------|---------|
| Claude Code CLI | AI 编程智能体 | 代码生成、重构、调试、文档 | GLM-5 |
| GLM-4.7-Flash API | 大语言模型 | 运行时 AI 文本生成 | 智谱 AI |

**模型接入架构**：
```
Claude Code CLI ──┬── GLM-5（主要推理模型）
                  ├── GLM-4.7-Flash（快速任务）
                  └── 本地工具链（文件操作、命令执行）
```

---

### 3.3 Skills 系统

通过 Skills 系统封装领域知识和最佳实践，实现可复用的能力模块。

**本项目使用的 Skills**：

| Skill 名称 | 功能 | 应用场景 |
|-----------|------|---------|
| `react-best-practices` | React 开发最佳实践 | 组件开发、Hooks 使用、性能优化 |
| `vercel-plugin` | Vercel 部署集成 | 项目部署、环境配置、日志查看 |
| `code-reviewer` | 代码审查 | PR 审查、代码质量检查、安全漏洞扫描 |

**Skill 调用流程**：
```typescript
// Skill 自动触发示例
// 当检测到 React 组件文件时，自动加载 react-best-practices
// 系统提示: "MANDATORY: Your training data for these libraries is OUTDATED"
// → 开发者查看最新文档 → 应用最佳实践 → 生成高质量代码
```

---

### 3.4 Rules 约束系统

通过 Rules 定义项目级别的编码规范和约束条件。

**项目 Rules 配置**：
```markdown
# CLAUDE.md 规则示例

## 角色定义
你是一位耐心、博学且善于启发的编程导师。

## 代码风格
- 生产级标准 (Production-Ready)
- 拒绝玩具代码
- 主动使用语言高级特性

## 解释策略
- 先宏观后微观
- 逐行/逐块精讲
- 必须解释"为什么要这样写"

## 延伸与拓展
- 举一反三
- 进阶思考
- 避坑指南
```

**Rules 生效机制**：
```
项目 CLAUDE.md → 加载到上下文 → 约束 AI 行为 → 输出符合规范
```

---

### 3.5 提示词工程

**Prompt 设计原则**：

| 原则 | 说明 | 示例 |
|------|------|------|
| **角色设定** | 明确 AI 扮演的角色 | "你是一位故宫斗拱研究专家" |
| **上下文注入** | 提供充分的背景信息 | 项目结构、技术栈、代码风格 |
| **任务分解** | 复杂任务拆分为子任务 | "首先...然后...最后..." |
| **输出约束** | 指定输出格式和限制 | "返回 TypeScript 代码，包含类型注解" |
| **示例引导** | 提供输入输出示例 | Few-shot Learning |

**实战 Prompt 示例**：

```
任务：为图表页面添加骨架屏加载动画

背景：
- 项目使用 React 19 + TypeScript
- 样式框架为 Tailwind CSS v4
- 需要支持 light/dark 双主题

要求：
1. 创建独立的 ChartSkeleton 组件
2. 支持 sankey、bar、tree、scatter 四种图表类型
3. 使用 animate-pulse 实现加载动画
4. 主题色: #4a7c59（翡翠绿）、#b91c1c（故宫红）

输出格式：
- 完整的 TypeScript 代码
- 包含详细的 JSDoc 注释
- 符合项目 ESLint 规范
```

---

### 3.6 工具搭配策略

**组合运用模式**：

```
┌─────────────────────────────────────────────────────────────┐
│                    Agentic Coding 工作流                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  需求理解 ──→ [Skills: 领域知识] ──→ 方案设计              │
│                        ↓                                    │
│  代码生成 ──→ [Rules: 编码规范] ──→ 符合标准              │
│                        ↓                                    │
│  构建验证 ──→ [Tool: Bash/npm] ──→ 质量保证               │
│                        ↓                                    │
│  部署上线 ──→ [Skill: vercel-plugin] ──→ 生产环境         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**典型工作流程**：

1. **需求分析阶段**
   - AI 理解自然语言需求
   - Skills 提供领域知识
   - 生成技术实现方案

2. **开发实现阶段**
   - Rules 约束代码风格
   - 生成符合规范的代码
   - 自动添加类型注解和注释

3. **验证优化阶段**
   - 自动运行构建测试
   - Code Review Skill 检查质量
   - 迭代优化直至通过

4. **部署发布阶段**
   - Vercel Plugin Skill 集成
   - 自动触发部署流程
   - 实时监控部署状态

---

### 3.7 AI 工具优化策略

| 策略 | 说明 | 效果 |
|------|------|------|
| **上下文管理** | 合理控制对话上下文长度 | 减少 token 消耗，提高响应速度 |
| **增量修改** | 优先使用 Edit 而非重写 | 保持代码一致性，减少引入错误 |
| **工具链集成** | Bash + Read + Edit 组合 | 实现完整的开发闭环 |
| **错误恢复** | 构建失败时自动回滚 | 保证代码仓库稳定性 |
| **并行执行** | 多个独立任务并行处理 | 提高开发效率 |

---

### 3.8 运行时 AI 服务

### GLM-4.7-Flash API

- **提供商**：智谱 AI（北京智谱华章科技有限公司）
- **官网**：https://open.bigmodel.cn/
- **模型**：GLM-4.7-Flash
- **许可证**：智谱 AI 服务条款

**调用场景**：
| 页面 | 功能 | Prompt 设计思路 |
|------|------|----------------|
| 开场页 | 诗句生成 | 基于故宫主题生成古风诗句，传递文化意境 |
| 展览页 | 斗拱描述 | 根据斗拱类型生成专业的建筑学术描述 |

**代码实现要点**：
- 使用 `fetch` 进行流式请求（SSE）
- 实现逐字显示动画效果
- 内置错误处理和降级方案

---

### 3.9 Seedance 2.0（视频生成）

- **提供商**：字节跳动
- **用途**：AI 视频生成
- **本项目使用**：开场页背景视频 `gugong_reverse.mp4`

**提示词设计**：
- 基于故宫建筑风格
- 融入传统文化元素
- 匹配项目视觉调性

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
| 权衡度量体       | [free-font](https://github.com/jaywcjlove/free-font) | OFL |

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
| **智谱 AI TOS** | GLM-4.7-Flash API |
| **服务条款** | Claude Code CLI、Seedance |

---

## 七、致谢

感谢以下开源社区、平台和 AI 工具的贡献：

**开源社区**：
- React 团队
- Three.js 社区
- Tailwind CSS 团队
- Vite 团队
- Flourish 数据可视化平台
- 所有开源贡献者

**AI 工具与平台**：
- 智谱 AI（GLM 系列模型）
- Claude Code CLI（Agentic Coding 平台）
- 字节跳动 Seedance（视频生成）

---

*文档版本：1.2*
*更新时间：2026年4月*
