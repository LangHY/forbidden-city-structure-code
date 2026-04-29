/**
 * useChatStream - SSE 流式聊天 Hook
 *
 * 管理聊天消息状态和 SSE 流式接收
 * 支持多轮对话上下文
 */

import { useState, useCallback, useRef } from 'react';

interface Source {
  source: string;
  type: string;
  preview: string;
  score: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  timestamp: number;
}

interface UseChatStreamReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (query: string) => Promise<void>;
  clearMessages: () => void;
}

// 后端 API 地址
const API_BASE_URL = 'http://localhost:3000';

// 最大保留的对话历史轮数
const MAX_HISTORY_TURNS = 5;

export function useChatStream(): UseChatStreamReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    // 添加用户消息
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);

    // 创建 AbortController
    abortControllerRef.current = new AbortController();

    try {
      // 构建对话历史（取最近 N 轮）
      const recentMessages = messages.slice(-MAX_HISTORY_TURNS * 2);
      const conversationHistory = recentMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          conversationHistory
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      // 处理 SSE 流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let assistantContent = '';
      let sources: Source[] = [];

      const assistantMessageId = `assistant-${Date.now()}`;

      // 先添加一个空的助手消息占位
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        sources: [],
        timestamp: Date.now()
      }]);

      while (reader) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);

            if (data.trim() === '') continue;

            try {
              const parsed = JSON.parse(data);

              if (parsed.type === 'sources') {
                sources = parsed.sources;
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, sources }
                    : msg
                ));
              } else if (parsed.type === 'chunk') {
                assistantContent += parsed.content;
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent }
                    : msg
                ));
              } else if (parsed.type === 'done') {
                // 完成，更新最终内容
                setMessages(prev => prev.map(msg =>
                  msg.id === assistantMessageId
                    ? { ...msg, content: assistantContent, sources }
                    : msg
                ));
              } else if (parsed.type === 'error') {
                setError(parsed.message);
              }
            } catch {
              // 忽略解析错误
            }
          }
        }
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // 用户取消，不报错
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // 移除占位消息
        setMessages(prev => prev.filter(msg => msg.role === 'user'));
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
}