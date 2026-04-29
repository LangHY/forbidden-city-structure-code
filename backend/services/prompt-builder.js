/**
 * Prompt 构建服务
 *
 * 将检索结果、用户问题和对话历史组合成完整的提示词
 */

/**
 * 构建带对话历史的消息数组
 * @param {string} query - 用户问题
 * @param {Array} searchResults - FAISS 检索结果
 * @param {Array} conversationHistory - 对话历史 [{ role, content }]
 * @returns {Array} OpenAI 格式的消息数组
 */
export function buildPromptWithContext(query, searchResults, conversationHistory = []) {
  const messages = [];

  // 1. 系统消息：定义 AI 角色和知识库内容
  const systemContent = buildSystemMessage(searchResults);
  messages.push({
    role: 'system',
    content: systemContent
  });

  // 2. 添加对话历史（如果有的话）
  if (conversationHistory.length > 0) {
    // 限制历史长度，避免上下文过长
    const limitedHistory = conversationHistory.slice(-10);
    for (const msg of limitedHistory) {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    }
  }

  // 3. 添加当前用户问题
  messages.push({
    role: 'user',
    content: query
  });

  return messages;
}

/**
 * 构建系统消息
 * @param {Array} searchResults - 检索结果
 * @returns {string} 系统消息内容
 */
function buildSystemMessage(searchResults) {
  // 构建知识库上下文
  const contextSections = searchResults
    .map((result, index) => {
      const { chunk, score } = result;
      return `[${index + 1}] 来源: ${chunk.source}\n内容: ${chunk.content}`;
    })
    .join('\n\n');

  const systemPrompt = `你是一位故宫建筑与文化的知识助手。请根据以下参考资料回答用户问题。

## 参考资料

${contextSections || '（未找到相关参考资料）'}

## 回答要求

1. 请用简洁、准确的语言回答问题
2. 回答内容必须优先基于参考资料，不要编造信息
3. 如果参考资料中没有相关信息，可以基于你的知识回答，但要说明"根据我的知识"
4. 如果用户的问题与之前的对话相关，请结合上下文回答
5. 在回答末尾标注引用来源编号（如 [1][2]）
6. 回答长度控制在 200 字以内`;

  return systemPrompt;
}

/**
 * 构建简单的系统提示词（无检索上下文）
 * @param {string} query - 用户问题
 * @returns {string} 完整的提示词
 */
export function buildSimplePrompt(query) {
  return `你是一位故宫建筑与文化的知识助手。请简要回答用户的问题。

用户问题：${query}

请用简洁、准确的语言回答，回答长度控制在 200 字以内。如果涉及具体数据或历史信息，请注明来源。`;
}

/**
 * 构建发送给 LLM 的提示词（旧版本，保留兼容）
 * @param {string} query - 用户问题
 * @param {Array} searchResults - FAISS 检索结果
 * @returns {string} 完整的提示词
 */
export function buildPrompt(query, searchResults) {
  // 构建上下文部分
  const contextSections = searchResults
    .map((result, index) => {
      const { chunk, score } = result;
      return `[${index + 1}] ${chunk.content}（相关度: ${(score * 100).toFixed(1)}%）`;
    })
    .join('\n\n');

  // 构建完整提示词
  const prompt = `你是一位故宫建筑与文化的知识助手。请根据以下参考资料回答用户问题。

## 参考资料

${contextSections}

## 用户问题

${query}

## 回答要求

1. 请用简洁、准确的语言回答问题
2. 回答内容必须基于参考资料，不要编造信息
3. 如果参考资料中没有相关信息，请如实告知用户
4. 在回答末尾标注引用来源编号（如 [1][2]）
5. 回答长度控制在 200 字以内`;

  return prompt;
}