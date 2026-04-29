/**
 * 内存向量检索服务
 *
 * 使用余弦相似度进行向量检索（替代 FAISS，避免安装问题）
 * 适合小规模数据（<10000 条），性能足够
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 知识库数据
let chunks = [];       // 文本块数组
let embeddings = [];    // 向量数组

/**
 * 计算两个向量的余弦相似度
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) {
    throw new Error('Vector length mismatch');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * 加载知识库索引
 */
export function loadIndex() {
  const chunksPath = path.join(__dirname, '../knowledge/chunks.json');
  const embeddingsPath = path.join(__dirname, '../knowledge/embeddings.json');

  if (!fs.existsSync(chunksPath) || !fs.existsSync(embeddingsPath)) {
    console.warn('[FAISS] Warning: Knowledge index not found. Run build-knowledge.js first.');
    return false;
  }

  try {
    chunks = JSON.parse(fs.readFileSync(chunksPath, 'utf-8'));
    embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf-8'));

    console.log(`[FAISS] Loaded ${chunks.length} knowledge chunks`);
    return true;
  } catch (error) {
    console.error('[FAISS] Error loading index:', error.message);
    return false;
  }
}

/**
 * 检索最相关的文本块
 * @param {number[]} queryEmbedding - 查询向量
 * @param {number} topK - 返回前 K 个结果
 * @returns {Array} 检索结果数组
 */
export function search(queryEmbedding, topK = 3) {
  if (chunks.length === 0 || embeddings.length === 0) {
    console.warn('[FAISS] No data loaded, returning empty results');
    return [];
  }

  // 计算所有向量与查询向量的相似度
  const similarities = embeddings.map((emb, idx) => ({
    index: idx,
    score: cosineSimilarity(queryEmbedding, emb)
  }));

  // 按相似度排序，取前 K 个
  similarities.sort((a, b) => b.score - a.score);
  const topResults = similarities.slice(0, Math.min(topK, similarities.length));

  // 返回结果
  return topResults.map(result => ({
    chunk: chunks[result.index],
    score: result.score
  }));
}

/**
 * 保存向量索引到文件
 */
export function saveIndex(chunksData, embeddingsData) {
  const knowledgeDir = path.join(__dirname, '../knowledge');

  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(knowledgeDir, 'chunks.json'),
    JSON.stringify(chunksData, null, 2)
  );

  fs.writeFileSync(
    path.join(knowledgeDir, 'embeddings.json'),
    JSON.stringify(embeddingsData)
  );

  console.log(`[FAISS] Saved ${chunksData.length} chunks to knowledge/`);
}

/**
 * 获取已加载的块数量
 */
export function getChunkCount() {
  return chunks.length;
}
