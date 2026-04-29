/**
 * GLM LLM 生成服务
 *
 * 调用智谱 GLM-4-Flash API 生成回答（支持流式输出和多轮对话）
 */

import axios from 'axios';

const GLM_API_KEY = process.env.GLM_API_KEY;
const CHAT_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

if (!GLM_API_KEY) {
  console.warn('[LLM] Warning: GLM_API_KEY not set in environment');
}

/**
 * 流式生成回答（支持多轮对话）
 * @param {Array} messages - OpenAI 格式的消息数组 [{ role, content }]
 * @yields {string} 生成的文本片段
 */
export async function* generateStream(messages) {
  if (!GLM_API_KEY) {
    throw new Error('GLM_API_KEY not configured');
  }

  // 确保消息格式正确
  const formattedMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await axios.post(CHAT_URL, {
      model: 'glm-4-flash',
      messages: formattedMessages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${GLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      responseType: 'stream',
      timeout: 60000
    });

    let buffer = '';

    for await (const chunk of response.data) {
      buffer += chunk.toString();

      // 解析 SSE 数据
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          if (data === '[DONE]') {
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const content = parsed?.choices?.[0]?.delta?.content;

            if (content) {
              yield content;
            }
          } catch (parseError) {
            // 忽略解析错误，继续处理
          }
        }
      }
    }
  } catch (error) {
    console.error('[LLM] Error:', error.message);
    throw error;
  }
}

/**
 * 非流式生成回答（简化版，用于测试）
 * @param {Array|string} input - 消息数组或单个提示词
 * @returns {Promise<string>} 生成的回答
 */
export async function generate(input) {
  if (!GLM_API_KEY) {
    throw new Error('GLM_API_KEY not configured');
  }

  // 支持字符串或消息数组
  const messages = typeof input === 'string'
    ? [{ role: 'user', content: input }]
    : input;

  try {
    const response = await axios.post(CHAT_URL, {
      model: 'glm-4-flash',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024
    }, {
      headers: {
        'Authorization': `Bearer ${GLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });

    return response.data?.choices?.[0]?.message?.content || '';
  } catch (error) {
    console.error('[LLM] Error:', error.message);
    throw error;
  }
}