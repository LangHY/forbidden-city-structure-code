/**
 * Express.js 后端服务器入口
 *
 * 为故宫斗拱 RAG 知识库问答系统提供 API 端点
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://127.0.0.1:5174',
    'http://127.0.0.1:5175'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));

// 路由
app.use('/api/chat', chatRouter);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`[RAG Backend] Running on http://localhost:${PORT}`);
  console.log(`[RAG Backend] Health check: http://localhost:${PORT}/health`);
});
