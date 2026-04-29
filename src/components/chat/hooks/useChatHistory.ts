/**
 * useChatHistory - 聊天历史管理 Hook
 *
 * 使用 localStorage 持久化聊天历史
 */

import { useState, useEffect, useCallback } from 'react';

interface ChatHistoryItem {
  id: string;
  messages: Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Array<{
      source: string;
      type: string;
      preview: string;
      score: string;
    }>;
    timestamp: number;
  }>;
  createdAt: number;
  title: string;
}

const STORAGE_KEY = 'rag-chat-history';
const MAX_HISTORY_ITEMS = 20;

interface UseChatHistoryReturn {
  history: ChatHistoryItem[];
  addToHistory: (messages: ChatHistoryItem['messages']) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  restoreFromHistory: (id: string) => ChatHistoryItem['messages'] | null;
}

export function useChatHistory(): UseChatHistoryReturn {
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);

  // 初始化时从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistory(parsed);
      }
    } catch {
      // 忽略解析错误
    }
  }, []);

  // 保存到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // 忽略存储错误
    }
  }, [history]);

  const addToHistory = useCallback((messages: ChatHistoryItem['messages']) => {
    if (messages.length === 0) return;

    // 从第一条用户消息提取标题
    const firstUserMessage = messages.find(m => m.role === 'user');
    const title = firstUserMessage?.content.slice(0, 50) || '新对话';

    const newItem: ChatHistoryItem = {
      id: `history-${Date.now()}`,
      messages,
      createdAt: Date.now(),
      title
    };

    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const restoreFromHistory = useCallback((id: string) => {
    const item = history.find(h => h.id === id);
    return item?.messages || null;
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    restoreFromHistory
  };
}