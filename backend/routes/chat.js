/**
 * 聊天 API 路由
 *
 * 处理 /api/chat 端点的请求，返回 SSE 流式响应
 * 支持多轮对话上下文
 */

import express from 'express';
import { getEmbedding } from '../services/embedding.js';
import { search, loadIndex, getChunkCount } from '../services/faiss.js';
import { generateStream } from '../services/llm.js';
import { buildPromptWithContext } from '../services/prompt-builder.js';

const router = express.Router();

// 启动时加载知识库索引
let indexLoaded = false;
try {
  indexLoaded = loadIndex();
  if (indexLoaded) {
    console.log('[Chat] Knowledge base loaded successfully');
  } else {
    console.warn('[Chat] Knowledge base not loaded. Run build-knowledge.js first.');
  }
} catch (error) {
  console.error('[Chat] Failed to load knowledge base:', error.message);
}

/**
 * POST /api/chat
 *
 * 处理聊天请求，返回 SSE 流式响应
 * 支持对话历史上下文
 */
router.post('/', async (req, res) => {
  const { query, conversationHistory = [] } = req.body;

  // 参数验证
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query is required' });
  }

  console.log(`[Chat] Received query: "${query.substring(0, 50)}..."`);

  // 设置 SSE 响应头
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  try {
    let searchResults = [];

    // 如果知识库已加载，进行向量检索
    if (indexLoaded && getChunkCount() > 0) {
      console.log('[Chat] Getting embedding for query...');
      const queryEmbedding = await getEmbedding(query);

      console.log('[Chat] Searching knowledge base...');
      searchResults = search(queryEmbedding, 3);

      console.log(`[Chat] Found ${searchResults.length} relevant chunks`);

      // 发送引用来源
      const sources = searchResults.map(r => ({
        source: r.chunk.source,
        type: r.chunk.type,
        preview: r.chunk.content.substring(0, 100) + '...',
        score: r.score.toFixed(3)
      }));

      res.write(`data: ${JSON.stringify({ type: 'sources', sources })}\n\n`);
    }

    // 构建带上下文的 Prompt
    const messages = buildPromptWithContext(query, searchResults, conversationHistory);

    // 流式生成回答
    console.log('[Chat] Generating response...');
    let totalContent = '';

    for await (const chunk of generateStream(messages)) {
      totalContent += chunk;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: chunk })}\n\n`);
    }

    // 发送完成信号
    res.write(`data: ${JSON.stringify({ type: 'done', totalLength: totalContent.length })}\n\n`);
    console.log(`[Chat] Response complete (${totalContent.length} chars)`);

  } catch (error) {
    console.error('[Chat] Error:', error.message);

    // 发送错误信息
    res.write(`data: ${JSON.stringify({
      type: 'error',
      message: error.message
    })}\n\n`);
  } finally {
    res.end();
  }
});

/**
 * GET /api/chat/status
 *
 * 返回知识库状态
 */
router.get('/status', (req, res) => {
  res.json({
    indexLoaded,
    chunkCount: getChunkCount(),
    status: indexLoaded ? 'ready' : 'knowledge_base_not_loaded'
  });
});

export default router;