/**
 * ChatWindow - 底部全宽聊天面板
 *
 * 从底部向上展开的液态玻璃风格面板
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import SourceReference from './SourceReference';
import { useChatStream } from './hooks/useChatStream';
import { useChatHistory } from './hooks/useChatHistory';
import type { ThemeMode } from '@/components/exhibition/types';

interface ChatWindowProps {
  theme: ThemeMode;
  onClose: () => void;
}

export default function ChatWindow({ theme, onClose }: ChatWindowProps) {
  const isDark = theme === 'dark';
  const { messages, isLoading, error, sendMessage, clearMessages } = useChatStream();
  const { addToHistory } = useChatHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSources, setShowSources] = useState(false);
  const [currentSources, setCurrentSources] = useState<NonNullable<typeof messages[0]['sources']>>([]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 当有新消息时，更新引用来源
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'assistant' && lastMessage.sources?.length) {
      setCurrentSources(lastMessage.sources);
    }
  }, [messages]);

  // 关闭时保存历史
  const handleClose = () => {
    if (messages.length > 1) {
      addToHistory(messages);
    }
    onClose();
  };

  const textClass = isDark ? 'text-stone-100' : 'text-stone-800';
  const subTextClass = isDark ? 'text-stone-400' : 'text-stone-500';

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 420, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`
        fixed bottom-0 left-0 right-0 z-50
        overflow-hidden
      `}
    >
      {/* 液态玻璃面板容器 */}
      <div
        className={`
          h-full w-full max-w-4xl mx-auto
          backdrop-blur-2xl backdrop-saturate-200
          ${isDark
            ? 'bg-stone-900/50 border-t border-stone-600/20'
            : 'bg-white/40 border-t border-white/40'
          }
          shadow-2xl shadow-black/10
        `}
        style={{
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          backdropFilter: 'blur(32px) saturate(200%)',
        }}
      >
        {/* 内部容器 */}
        <div className="h-full flex flex-col">
          {/* 头部 - 紧凑横条风格 */}
          <div className={`
            px-6 py-3 flex items-center justify-between
            ${isDark ? 'border-b border-stone-600/20' : 'border-b border-white/30'}
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${isDark ? 'bg-amber-600/80' : 'bg-emerald-600/80'}
              `}>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.866-.354-1.692-.949-2.287l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className={`font-medium text-sm ${textClass}`}>故宫知识助手</h3>
                <p className={`text-xs ${subTextClass}`}>AI RAG 问答</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearMessages}
                className={`
                  p-2 rounded-full transition-colors
                  ${isDark ? 'hover:bg-stone-800/50' : 'hover:bg-stone-200/50'}
                  ${subTextClass}
                `}
                title="清空对话"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={handleClose}
                className={`
                  p-2 rounded-full transition-colors
                  ${isDark ? 'hover:bg-stone-800/50' : 'hover:bg-stone-200/50'}
                  ${subTextClass}
                `}
                title="收起面板"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>

      {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {messages.length === 0 ? (
              <div className={`h-full flex flex-col items-center justify-center ${subTextClass}`}>
                <div className={`
                  w-16 h-16 rounded-full mb-4 flex items-center justify-center
                  ${isDark ? 'bg-stone-800/50' : 'bg-stone-200/50'}
                `}>
                  <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm text-center">
                  你好！我是故宫知识助手<br />
                  可以问我关于建筑、斗拱、历史等问题
                </p>
                <div className={`mt-3 text-xs opacity-60`}>
                  例如："太和殿有多高？"
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} theme={theme} />
              ))
            )}

            {/* 加载指示器 */}
            {isLoading && (
              <div className={`flex items-center gap-2 ${subTextClass}`}>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-xs">思考中...</span>
              </div>
            )}

            {/* 错误提示 */}
            {error && (
              <div className={`text-xs rounded-lg px-3 py-2 ${isDark ? 'text-red-400 bg-red-500/20' : 'text-red-500 bg-red-500/10'}`}>
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

      {/* 引用来源 */}
          {currentSources.length > 0 && (
            <div className="px-6">
              <SourceReference
                sources={currentSources}
                theme={theme}
                expanded={showSources}
                onToggle={() => setShowSources(!showSources)}
              />
            </div>
          )}

          {/* 输入区域 */}
          <div className="px-6 pb-4">
            <ChatInput
              theme={theme}
              onSend={sendMessage}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}