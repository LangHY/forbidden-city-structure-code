/**
 * ChatInput - 聊天输入组件
 *
 * 适配液态玻璃面板风格
 */

import { useState, useRef, useEffect } from 'react';
import type { ThemeMode } from '@/components/exhibition/types';

interface ChatInputProps {
  theme: ThemeMode;
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ theme, onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isDark = theme === 'dark';

  // 自动聚焦
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // 自动调整高度
  const adjustHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 80) + 'px';
    }
  };

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`
      flex items-end gap-3 rounded-full p-2
      ${isDark ? 'bg-stone-800/40' : 'bg-stone-200/40'}
    `}>
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          adjustHeight();
        }}
        onKeyDown={handleKeyDown}
        placeholder="输入问题..."
        disabled={disabled}
        rows={1}
        className={`
          flex-1 bg-transparent resize-none outline-none text-sm px-3 py-1
          ${isDark ? 'text-stone-100 placeholder-stone-500' : 'text-stone-800 placeholder-stone-400'}
        `}
        style={{ maxHeight: '80px' }}
      />
      <button
        onClick={handleSend}
        disabled={disabled || !input.trim()}
        className={`
          p-2.5 rounded-full transition-all duration-200
          ${disabled || !input.trim()
            ? 'opacity-50 cursor-not-allowed'
            : isDark
              ? 'bg-amber-600 hover:bg-amber-500 hover:scale-105'
              : 'bg-emerald-600 hover:bg-emerald-500 hover:scale-105'
          }
        `}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
}