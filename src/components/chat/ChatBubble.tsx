/**
 * ChatBubble - 收起状态的气泡按钮
 */

import { motion } from 'framer-motion';
import type { ThemeMode } from '@/components/exhibition/types';

interface ChatBubbleProps {
  theme: ThemeMode;
  onClick: () => void;
}

export default function ChatBubble({ theme, onClick }: ChatBubbleProps) {
  const isDark = theme === 'dark';

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        transition-colors duration-300
        ${isDark
          ? 'bg-gradient-to-br from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700'
          : 'bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700'
        }
      `}
      aria-label="打开 AI 助手"
    >
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </motion.button>
  );
}