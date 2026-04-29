/**
 * ChatMessage - 单条消息组件
 */

import { memo } from 'react';
import type { ThemeMode } from '@/components/exhibition/types';

interface Message {
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
}

interface ChatMessageProps {
  message: Message;
  theme: ThemeMode;
}

const ChatMessage = memo(function ChatMessage({ message, theme }: ChatMessageProps) {
  const isDark = theme === 'dark';
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`
          max-w-[70%] px-4 py-2.5 rounded-2xl text-sm
          ${isUser
            ? isDark
              ? 'bg-amber-600/80 text-white rounded-br-md'
              : 'bg-emerald-600/80 text-white rounded-br-md'
            : isDark
              ? 'bg-stone-800/60 text-stone-100 rounded-bl-md'
              : 'bg-stone-200/60 text-stone-800 rounded-bl-md'
          }
        `}
      >
        <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

        {/* 引用来源标记 */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className={`mt-2 pt-2 border-t ${isDark ? 'border-white/10' : 'border-stone-400/20'}`}>
            <span className={`text-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
              📚 引用：{message.sources.map(s => s.source).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

export default ChatMessage;