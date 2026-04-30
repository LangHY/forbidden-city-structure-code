# AI 技术应用说明

> 紫禁匠心 -- 故宫斗拱结构沉浸式交互网站

本项目融合多项 AI 技术，覆盖内容生成、知识问答和素材创作三个维度，实现从开发到体验的全方位智能化。

---

## 一、AI 技术架构总览

```
┌──────────────────────────────────────────────────────────────────┐
│                       AI 技术架构                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  前端直接调用                        后端 RAG 服务                  │
│  ┌─────────────────────┐           ┌─────────────────────────┐   │
│  │  GLM-4.7-Flash API  │           │  Express + FAISS 向量库  │   │
│  │  · AI 诗句生成       │           │  · 知识库问答            │   │
│  │  · 斗拱结构描述       │           │  · PDF 论文检索          │   │
│  │  · 中轴建筑介绍       │           │  · 引用来源追溯          │   │
│  └────────┬────────────┘           └───────────┬─────────────┘   │
│           │                                    │                 │
│           ▼                                    ▼                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   AIChatWidget（全局 AI 问答小部件）           │ │
│  │                   在除开场页外的所有页面显示                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  辅助工具                                                         │
│  ┌─────────────────────┐                                         │
│  │  Seedance 2.0       │                                         │
│  │  · 开场视频素材生成   │                                         │
│  └─────────────────────┘                                         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 二、GLM-4.7-Flash — 前端直接调用

### 2.1 应用场景

| 场景 | 位置 | 说明 |
|------|------|------|
| **AI 诗句生成** | 开场页 | 每 10 秒自动更新，展示故宫主题诗词 |
| **斗拱结构描述** | 结构蓝图页 | 23 种斗拱的专业建筑学描述 |
| **中轴建筑介绍** | 中轴巡礼页 | 11 座建筑的背景和历史 |

### 2.2 API 调用方式

```typescript
const response = await fetch(GLM_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_GLM_API_KEY}`,
  },
  body: JSON.stringify({
    model: 'glm-4-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 400,
  }),
});
```

**API Key 安全**：通过环境变量 `VITE_GLM_API_KEY` 注入，不硬编码在源码中。

### 2.3 Prompt Engineering

所有调用均使用结构化 Prompt，要求 AI 返回 JSON 格式的结果：

```typescript
const prompt = `你是故宫古建筑专家，请为"${structureName}"生成专业描述。

返回 JSON 格式：
{
  "title": "斗拱名称",
  "subtitle": "朝代 + 类型",
  "description": "2-3 句结构描述",
  "historicalContext": "历史背景",
  "components": ["组件1", "组件2", ...],
  "technicalParams": { ... },
  "funFacts": ["趣闻1", "趣闻2", ...]
}`;
```

### 2.4 缓存策略

为避免重复 API 调用，前端采用全局缓存：

```typescript
export const structureCache: Record<string, StructureInfo> = {};

// 首次生成后缓存，后续直接命中
if (structureCache[structureId]) {
  return structureCache[structureId];
}

// 相邻章节预生成（用户可能访问的下一个）
preloadAdjacentStructures(currentId, chapters);
```

### 2.5 优雅降级

API 调用失败时返回预设默认数据，确保页面正常展示：

```typescript
try {
  return await callGLMAPI(prompt);
} catch (error) {
  console.warn('AI 调用失败，使用默认数据:', error);
  return getDefaultStructureInfo(structureName);
}
```

---

## 三、RAG 知识库问答 — 后端服务

### 3.1 架构设计

```
用户提问 → Express 后端 → GLM Embedding 向量化 → FAISS 本地检索
                                                      ↓
用户 ← SSE 流式返回答案 ← GLM-4.7-Flash 生成 ← 相关文档片段 + Prompt
```

### 3.2 技术栈

| 组件 | 技术 | 说明 |
|------|------|------|
| 后端框架 | Express.js | RESTful API 服务 |
| 向量嵌入 | GLM Embedding API | 文本向量化 |
| 向量检索 | FAISS (本地) | 相似度搜索，延迟 < 100ms |
| LLM 生成 | GLM-4.7-Flash | 基于检索结果的答案生成 |
| 数据传输 | SSE (Server-Sent Events) | 流式返回答案 |

### 3.3 API 端点

```
POST /api/chat

请求:
{
  "query": "故宫太和殿的斗拱有什么特点？",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}

响应 (SSE 流):
data: {"type":"sources","content":["《故宫建筑研究》P23",...]}
data: {"type":"answer","content":"太和殿的斗拱..."}
data: [DONE]
```

### 3.4 知识库内容

知识库基于 `public/data/` 中的 PDF 论文和 JSON 结构化数据构建：
- 故宫建筑研究论文（PDF 解析后分块）
- 斗拱类型与层级数据（JSON）
- 故宫历史时间线（JSON）
- 博物馆藏品统计（JSON）

构建命令：`GLM_API_KEY=your_key node scripts/build-knowledge.js`

### 3.5 技术自主性

- 向量检索完全在本地执行（FAISS），不依赖外部检索服务
- 仅调用国产 GLM API（Embedding + 文本生成）
- API Key 仅存储在本地 `.env` 文件中

---

## 四、AIChatWidget — 全局 AI 问答小部件

### 4.1 组件说明

AIChatWidget 是一个悬浮 AI 问答小部件，在除开场页（`/`）外的所有页面右下角显示。

### 4.2 交互流程

1. 用户点击右下角 AI 按钮
2. 弹出聊天窗口（玻璃态面板，适配亮/暗主题）
3. 用户输入问题
4. 通过 SSE 流式接收 RAG 后端的回复
5. 回复中包含引用来源（论文名称、页码）

### 4.3 组件结构

```
src/components/chat/
├── AIChatWidget.tsx      # 主入口组件
├── ChatWindow.tsx        # 聊天窗口容器
├── ChatBubble.tsx        # 聊天气泡
├── ChatMessage.tsx       # 单条消息
├── ChatInput.tsx         # 输入框
├── SourceReference.tsx   # 引用来源显示
└── hooks/
    ├── useChatStream.ts   # SSE 流式响应 Hook
    └── useChatHistory.ts  # 会话历史管理
```

---

## 五、Seedance 2.0 — 视频素材生成

基于文本描述生成开场动画视频素材（`gugong_reverse.mp4`），以低成本实现电影级视觉效果。视频作为开场页的背景层，配合滚动驱动的模糊过渡动画。

---

## 六、AI 开发辅助

项目开发过程中使用 GLM-5 大模型进行 AI 辅助编码，包括：
- React 组件生成与重构
- Three.js 3D 场景配置
- TypeScript 类型定义
- 文档编写与维护

---

*文档版本：2.0*
*更新日期：2026年4月*
