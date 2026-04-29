# RAG 知识库问答系统设计文档

## 项目概述

为故宫斗拱沉浸式交互网站添加 RAG（检索增强生成）知识库问答系统，让用户可以通过悬浮对话框与 AI 交互，获取建筑、文物、历史、文化等综合知识。

> **技术方案选择说明**：考虑到计算机设计大赛评分对技术自主性的要求，采用自建后端 + FAISS 本地向量库方案，避免过度依赖云服务，提高评委认可度。

---

## 技术架构

### 整体架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                        用户浏览器                                 │
│  ┌─────────────────┐                                             │
│  │ AIChatWidget    │  ← 悬浮对话框组件                           │
│  │ (React 组件)    │                                             │
│  └────────┬────────┘                                             │
└───────────┼──────────────────────────────────────────────────────┘
            │ POST http://localhost:3000/api/chat (SSE)
            ▼
┌──────────────────────────────────────────────────────────────────┐
│                 Express.js 本地后端服务器                        │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ /api/chat 端点                                                │ │
│  │  1. 接收用户问题                                              │ │
│  │  2. 调用 GLM Embedding API 将问题向量化                       │ │
│  │  3. FAISS 本地向量检索 Top-K 相关文档                         │ │
│  │  4. 构建 Prompt + 调用 GLM-4-Flash                            │ │
│  │  5. SSE 流式返回                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│            │                    │                                 │
│            ▼                    ▼                                 │
│  ┌─────────────────┐  ┌─────────────────┐                        │
│  │ FAISS 索引文件  │  │ GLM API         │                        │
│  │ (本地 .index)   │  │ (唯一外部依赖)   │                        │
│  │ 完全自主可控    │  │ 用于 Embedding  │                        │
│  └─────────────────┘  │ 和生成回答      │                        │
│                       └─────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

### 技术选型

| 层级 | 技术选型 | 理由 |
|------|---------|------|
| **前端** | React + Framer Motion + SSE | 与现有架构一致 |
| **后端** | Express.js（本地） | 自主可控，评委认可度高 |
| **向量库** | FAISS 本地索引 | 完全自主实现，无云依赖 |
| **LLM** | GLM-4-Flash API | 与现有项目一致，唯一外部依赖 |
| **Embedding** | GLM Embedding API | 与 LLM 同源，兼容性好 |
| **部署** | 本地笔记本电脑 | 答辩现场演示，无网络风险 |

### 方案优势（答辩话术）

1. **技术自主性**：向量检索算法完全本地实现，核心技术可控
2. **安全合规**：API Key 仅存于本地，无暴露风险
3. **国内友好**：仅依赖国产 GLM API，无海外服务延迟
4. **架构清晰**：前后端分离，符合现代开发规范

---

## 数据设计

### 知识库数据来源

现有 `public/data/` 目录中的 JSON 数据：

| 文件 | 类型 | 条目数 |
|------|------|-------|
| dougong-types.json | 斗拱类型 | ~24 |
| museum-collections.json | 藏品信息 | ~200 |
| forbidden-city-timeline.json | 历史事件 | ~50 |
| dougong-hierarchy.json | 层级结构 | ~30 |
| palace-collection-radar.json | 宫殿收藏 | ~20 |
| building-comparison-radar.json | 建筑对比 | ~15 |

**预计总条目：~300-500 条**（远低于 Pinecone 免费 100K 限制）

### 数据分块策略

按原始 JSON 条目为单位，不进行二次分块：

```typescript
interface KnowledgeChunk {
  id: string;           // 唯一标识 (如 "building-taihedian")
  content: string;      // 文本内容（JSON 条目的自然语言描述）
  metadata: {
    source: string;     // 来源文件名
    type: 'building' | 'dougong' | 'collection' | 'history';
    keywords: string[]; // 关键词标签
  };
}
```

### 内容生成规则

将 JSON 条目转换为自然语言描述：

```
原始数据:
{ "name": "太和殿", "height": 35.05, "function": "举行大典" }

生成内容:
"太和殿是故宫最高等级的建筑，高度35.05米，主要用于举行重大典礼如皇帝登基、大婚等。"
```

---

## API 端点设计

### `/api/chat` 端点

**请求：**

```typescript
interface ChatRequest {
  query: string;           // 用户问题
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}
```

**响应（SSE 流式）：**

```
data: {"type": "sources", "sources": [...]}
data: {"type": "answer", "chunk": "故宫..."}
data: {"type": "answer", "chunk": "的太和殿..."}
data: {"type": "done"}
```

### Prompt 构建

```
你是一位故宫建筑与文化的知识助手。请根据以下参考资料回答用户问题。

参考资料：
1. [建筑] 太和殿是故宫最高等级的建筑...
2. [斗拱] 斗口跳是最简单的斗拱类型...
3. [历史] 1420年故宫建成...

用户问题：太和殿有多高？

请用简洁、准确的语言回答，并在回答末尾标注引用来源。
```

---

## 前端组件设计

### UI 布局

```
┌─────────────────────────────────────────────────────────┐
│屏幕右下角                                                │
│                                                         │
│                      ┌──────────────────────┐           │
│                      │ 💬 AI 助手    [-][×] │           │
│                      ├──────────────────────┤           │
│                      │  [用户] 太和殿高度？  │           │
│                      │                      │           │
│                      │  [AI] 太和殿高度为... │           │
│                      │  ────────────────    │           │
│                      │  📚 来源: 建筑数据库  │           │
│                      ├──────────────────────┤           │
│                      │ 输入问题... [发送]    │           │
│                      └──────────────────────┘           │
│  ┌───┐                                                 │
│  │💬 │ ← 收起状态                                     │
│  └───┘                                                 │
└─────────────────────────────────────────────────────────┘
```

### 组件结构

```
src/components/chat/
├── AIChatWidget.tsx       # 主组件（状态管理）
├── ChatWindow.tsx         # 展开窗口
├── ChatBubble.tsx         # 收起气泡
├── ChatMessage.tsx        # 单条消息
├── ChatInput.tsx          # 输入框
├── SourceReference.tsx    # 引用来源
└── hooks/
    ├── useChatStream.ts   # SSE 流式接收
    └── useChatHistory.ts  # 历史管理
```

### 交互行为

| 状态 | 行为 |
|------|------|
| 收起 | 右下角气泡 |
| 展开 | 点击气泡展开 |
| 最小化 | 点击 [-] 收起 |
| 关闭 | 点击 [×] 隐藏 |

### 主题适配

- dark 模式：黑色背景 + 金色强调
- light 模式：米白背景 + 绿色强调

---

## 文件结构

### 新增文件

```
frontend/（现有项目目录）
├── src/components/chat/       # 前端聊天组件
│   ├── AIChatWidget.tsx
│   ├── ChatWindow.tsx
│   ├── ChatBubble.tsx
│   ├── ChatMessage.tsx
│   ├── ChatInput.tsx
│   ├── SourceReference.tsx
│   └── hooks/
│       ├── useChatStream.ts
│       └── useChatHistory.ts
├── src/services/
│   └── ragChatService.ts      # RAG 调用服务
│
backend/                       # 新建后端目录（Express）
├── server.js                  # Express 入口
├── package.json
├── routes/
│   └── chat.js                # /api/chat 端点
├── services/
│   ├── embedding.js           # GLM Embedding 调用
│   ├── faiss.js               # FAISS 本地检索
│   └── llm.js                 # GLM 生成调用
├── knowledge/
│   ├── index.faiss            # 预构建向量索引（~10MB）
│   └── chunks.json            # 文本块数据
└── .env                       # GLM_API_KEY（不提交 Git）
│
scripts/
└── build-knowledge.js         # 知识库构建脚本
```

### 后端依赖（package.json）

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "faiss-node": "^0.5.0",
    "axios": "^1.6.0"
  }
}
```

### 不修改的文件

保持现有三个 LLM Service 不变：
- `src/components/opening/services/llmService.ts`
- `src/components/exhibition/services/llmService.ts`
- `src/components/axis/axisLLMService.ts`

---

## 验收标准

| 功能 | 验收方式 |
|------|---------|
| 聊天对话框 | 右下角悬浮，展开/收起正常 |
| 流式响应 | 回答逐字显示 |
| 引用来源 | 显示知识来源 |
| 主题适配 | dark/light 正常 |
| API Key 安全 | 仅存于后端 .env，不提交 Git |
| FAISS 检索 | 本地检索延迟 < 100ms |
| 本地运行 | 前后端均可在本地启动 |
| 答辩演示 | 现场演示无网络问题（除 GLM API 外） |

---

## 本地运行指南

### 启动后端

```bash
cd backend
npm install
echo "GLM_API_KEY=your_key" > .env
npm start
# 后端运行在 http://localhost:3000
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
# 前端运行在 http://localhost:5173
```

### 构建知识库

```bash
node scripts/build-knowledge.js
# 生成 backend/knowledge/index.faiss 和 chunks.json
```

---

## 开发里程碑

| 阶段 | 内容 | 预计时间 |
|------|------|---------|
| 1 | 后端 Express 搭建 + FAISS 集成 | 0.5 天 |
| 2 | 知识库构建脚本 + 向量索引生成 | 1 天 |
| 3 | 后端 /api/chat 端点开发 | 1 天 |
| 4 | 前端聊天组件开发 | 1-2 天 |
| 5 | 前后端联调 + 测试 | 0.5 天 |

**总计：4-5 天**

---

## 答辩演示要点

1. **架构说明**：展示架构图，强调"向量检索完全本地实现"
2. **技术对比**：说明对比过 Pinecone 云方案，选择本地 FAISS 提高技术自主性
3. **现场演示**：启动前后端，演示 AI 问答功能
4. **代码展示**：展示 `faiss.js` 核心检索算法