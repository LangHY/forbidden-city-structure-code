/**
 * ChatBar - 底部液态玻璃胶囊横条
 *
 * 收起状态的聊天入口，点击展开面板
 */

import { motion } from 'framer-motion';
import type { ThemeMode } from '@/components/exhibition/types';

interface ChatBarProps {
  theme: ThemeMode;
  onClick: () => void;
}

export default function ChatBar({ theme, onClick }: ChatBarProps) {
  const isDark = theme === 'dark';

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onClick={onClick}
      className={`
        fixed bottom-3 left-1/2 -translate-x-1/2 z-50
        cursor-pointer select-none
      `}
    >
      <div
        className={`
          flex items-center justify-between gap-4
          px-5 py-2 min-w-[280px] max-w-[480px]
          rounded-[2rem]
          backdrop-blur-2xl backdrop-saturate-200
          ${isDark
            ? 'bg-stone-900/40 border border-stone-600/20'
            : 'bg-white/30 border border-white/40'
          }
          shadow-xl shadow-black/5
          transition-all duration-300 ease-out
          hover:${isDark ? 'bg-stone-900/50' : 'bg-white/40'}
          hover:shadow-2xl hover:shadow-black/10
          hover:scale-[1.02]
        `}
        style={{
          WebkitBackdropFilter: 'blur(32px) saturate(200%)',
          backdropFilter: 'blur(32px) saturate(200%)',
        }}
      >
        {/* 左侧：AI 图标 */}
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center
          ${isDark ? 'bg-amber-600/60' : 'bg-emerald-600/50'}
        `}>
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.866-.354-1.692-.949-2.287l-.548-.547z"
            />
          </svg>
        </div>

        {/* 中间：标题 */}
        <div className="flex-1 text-center">
          <span className={`
            text-[13px] font-normal tracking-wide
            ${isDark ? 'text-stone-400/80' : 'text-stone-500/70'}
          `}>
            AI 知识问答 · 点击开始
          </span>
        </div>

        {/* 右侧：展开指示 */}
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center
          ${isDark ? 'bg-stone-700/30' : 'bg-stone-300/30'}
        `}>
          <svg
            className={`w-3.5 h-3.5 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
