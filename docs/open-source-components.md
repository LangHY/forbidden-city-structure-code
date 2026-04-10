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

| 工具 | 类型 | 用途 | 接入模型 | 来源 |
|------|------|------|---------|------|
| Claude Code CLI | AI 编程智能体 | 代码生成、重构、调试、文档 | GLM-5 | 腾讯云 CodingPlan Lite |
| GLM-4.7-Flash API | 大语言模型 | 运行时 AI 文本生成 | GLM-4.7-Flash | 智谱 AI |

**模型接入架构**：
```
Claude Code CLI ──┬── GLM-5（主要推理模型，腾讯云 CodingPlan Lite）
                  ├── GLM-4.7-Flash（快速任务，智谱 AI）
                  └── 本地工具链（文件操作、命令执行）
```

---

### 3.3 Agentic Engine 工程级能力

Agentic Engine 不仅仅是一个 AI 对话工具，而是具备完整工程能力的智能编程系统：

**核心工程能力矩阵**：

| 能力维度 | 功能描述 | 工程价值 |
|---------|---------|---------|
| **多轮对话上下文管理** | 自动维护长对话上下文，智能压缩历史信息 | 保持项目连贯性，支持复杂任务拆解 |
| **项目级代码理解** | 全仓库代码索引，跨文件引用分析 | 精准定位代码位置，理解架构依赖 |
| **智能重构引擎** | 批量重命名、API 迁移、模式应用 | 降低重构风险，保证一致性 |
| **自动化测试集成** | 单元测试生成、覆盖率分析、回归检测 | 提高代码质量，减少人为疏漏 |
| **CI/CD 流水线集成** | 构建验证、部署触发、状态监控 | 打通开发到部署全链路 |
| **错误诊断与修复** | 编译错误分析、运行时异常定位、自动修复建议 | 加速调试周期，减少重复劳动 |
| **文档自动生成** | API 文档、README、代码注释 | 保持文档与代码同步 |

**工程级工作流示例**：

```
用户需求: "重构用户认证模块，改用 JWT"

Agentic Engine 执行链:
├── 1. 代码分析
│   └── 扫描 src/auth/ 目录，识别 Session 相关代码
├── 2. 影响评估
│   └── 分析依赖关系，生成变更文件列表
├── 3. 方案设计
│   └── 设计 JWT 认证流程，规划 API 变更
├── 4. 代码重构
│   ├── 修改 auth.service.ts
│   ├── 更新 middleware/auth.ts
│   └── 调整类型定义
├── 5. 测试更新
│   ├── 重写单元测试
│   └── 添加 JWT 验证测试用例
├── 6. 构建验证
│   └── 运行 npm run build && npm test
└── 7. 文档同步
    └── 更新 API 文档和 README
```

---

### 3.4 Skills 系统

通过 Skills 系统封装领域知识和最佳实践，实现可复用的能力模块。

**本项目使用的 Skills**：

| Skill 名称 | 功能 | 应用场景 |
|-----------|------|---------|
| `react-best-practices` | React 开发最佳实践 | 组件开发、Hooks 使用、性能优化 |
| `vercel-plugin` | Vercel 部署集成 | 项目部署、环境配置、日志查看 |
| `code-reviewer` | 代码审查 | PR 审查、代码质量检查、安全漏洞扫描 |
| `ui-sketcher` | UI 蓝图设计 | 界面布局设计、用户旅程规划 |
| `bug-analyzer` | 错误分析 | 调试代码执行流程、根因分析 |
| `using-superpowers` | 技能系统使用指南 | Skills 发现与调用规范 |
| `ai-sdk` | Vercel AI SDK 集成 | AI 应用开发、模型调用、流式响应 |
| `ai-gateway` | AI 网关配置 | AI 服务管理、流量控制、模型路由 |
| `Explore` | 代码库探索 | 文件搜索、代码分析、架构理解 |
| `Plan` | 架构设计规划 | 实现方案设计、任务拆解、文件识别 |
| `deployment-expert` | 部署专家 | CI/CD 策略、预览 URL、回滚操作 |
| `performance-optimizer` | 性能优化 | Core Web Vitals、缓存策略、Bundle 优化 |
| `dev` | 开发辅助 | 代码开发、功能实现、问题解决 |
| `ui-design` | UI 设计指南 | 界面设计规范、视觉风格、交互设计 |

---

### 3.5 Rules 约束系统

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

### 3.6 提示词工程

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

### 3.7 工具搭配策略

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

### 3.8 AI 工具优化策略

| 策略 | 说明 | 效果 |
|------|------|------|
| **上下文管理** | 合理控制对话上下文长度 | 减少 token 消耗，提高响应速度 |
| **增量修改** | 优先使用 Edit 而非重写 | 保持代码一致性，减少引入错误 |
| **工具链集成** | Bash + Read + Edit 组合 | 实现完整的开发闭环 |
| **错误恢复** | 构建失败时自动回滚 | 保证代码仓库稳定性 |
| **并行执行** | 多个独立任务并行处理 | 提高开发效率 |

---

### 3.9 运行时 AI 服务：GLM-4.7-Flash API

- **提供商**：智谱 AI（北京智谱华章科技有限公司）
- **官网**：https://open.bigmodel.cn/
- **模型**：GLM-4.7-Flash
- **许可证**：智谱 AI 服务条款

**调用场景**：
| 页面 | 功能 | Prompt 设计思路 |
|------|------|----------------|
| 开场页 | 诗句生成 | 基于故宫主题生成古风诗句，传递文化意境 |
| 展览页 | 斗拱描述 | 根据斗拱类型生成专业的建筑学术描述 |

#### API 调用详解

**请求端点**：
```
POST https://open.bigmodel.cn/api/paas/v4/chat/completions
```

**请求参数**：
```typescript
interface ChatCompletionRequest {
  model: 'GLM-4.7-Flash';  // 模型标识
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  stream?: boolean;        // 是否启用流式输出
  temperature?: number;    // 温度参数 (0-1)
  max_tokens?: number;     // 最大生成 token 数
  top_p?: number;         // 核采样参数
}
```

**完整调用示例**：

```typescript
// 流式调用 GLM-4.7-Flash API
async function generatePoemStream(prompt: string, onChunk: (text: string) => void) {
  const response = await fetch(
    'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'GLM-4.7-Flash',
        messages: [
          {
            role: 'system',
            content: '你是一位精通中国传统文化的诗人，擅长创作描写故宫的古风诗句。',
          },
          { role: 'user', content: prompt },
        ],
        stream: true,
        temperature: 0.8,
        max_tokens: 256,
      }),
    }
  );

  // 流式读取响应
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  while (reader) {
    const { done, value } = await reader.read();
    if (done) break;

    // 解析 SSE 数据
    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter(line => line.startsWith('data:'));

    for (const line of lines) {
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;

      try {
        const json = JSON.parse(data);
        const content = json.choices?.[0]?.delta?.content;
        if (content) onChunk(content);
      } catch (e) {
        // 忽略解析错误
      }
    }
  }
}

// 使用示例
generatePoemStream(
  '请为太和殿创作一句描写其庄严气势的诗句',
  (text) => {
    // 逐字显示动画
    displayText += text;
    renderPoem(displayText);
  }
);
```

**错误处理机制**：

```typescript
// 带重试和降级的调用封装
async function generateWithFallback(prompt: string): Promise<string> {
  const fallbackTexts = {
    poem: '金碧辉煌映紫微，龙盘虎踞护皇基。',
    description: '此斗拱结构精巧，承托有力，展现古代工匠智慧。',
  };

  try {
    // 尝试调用 API
    return await callGLMApi(prompt);
  } catch (error) {
    console.error('GLM API 调用失败:', error);

    // 降级到预设文本
    if (prompt.includes('诗')) {
      return fallbackTexts.poem;
    }
    return fallbackTexts.description;
  }
}
```

**性能优化建议**：
| 优化项 | 建议值 | 说明 |
|--------|--------|------|
| 连接复用 | Keep-Alive | 减少 TCP 握手开销 |
| 超时设置 | 30s | 避免长时间等待 |
| 重试策略 | 3 次，指数退避 | 应对临时故障 |
| 缓存策略 | 相同 Prompt 缓存 | 减少重复请求 |

---

### 3.10 Seedance 2.0（视频生成）

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
