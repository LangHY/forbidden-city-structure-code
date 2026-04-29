/**
 * GLM Embedding 服务
 *
 * 调用智谱 GLM Embedding API 将文本转换为向量
 */

import axios from 'axios';

const GLM_API_KEY = process.env.GLM_API_KEY;
const EMBEDDING_URL = 'https://open.bigmodel.cn/api/paas/v4/embeddings';

if (!GLM_API_KEY) {
  console.warn('[Embedding] Warning: GLM_API_KEY not set in environment');
}

/**
 * 获取文本的向量嵌入
 * @param {string} text - 要向量化的文本
 * @returns {Promise<number[]>} 向量数组
 */
export async function getEmbedding(text) {
  if (!GLM_API_KEY) {
    throw new Error('GLM_API_KEY not configured');
  }

  try {
    const response = await axios.post(EMBEDDING_URL, {
      model: 'embedding-3',
      input: text
    }, {
      headers: {
        'Authorization': `Bearer ${GLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    if (response.data?.data?.[0]?.embedding) {
      return response.data.data[0].embedding;
    }

    throw new Error('Invalid embedding response');
  } catch (error) {
    console.error('[Embedding] Error:', error.message);
    throw error;
  }
}

/**
 * 批量获取文本向量
 * @param {string[]} texts - 文本数组
 * @returns {Promise<number[][]>} 向量数组
 */
export async function getBatchEmbeddings(texts) {
  const results = [];

  // 逐个处理，避免 API 限流
  for (let i = 0; i < texts.length; i++) {
    const embedding = await getEmbedding(texts[i]);
    results.push(embedding);

    // 进度日志
    if ((i + 1) % 10 === 0) {
      console.log(`[Embedding] Progress: ${i + 1}/${texts.length}`);
    }

    // 避免请求过快
    if (i < texts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return results;
}
