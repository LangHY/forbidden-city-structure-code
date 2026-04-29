/**
 * SourceReference - 引用来源展示组件
 */

import { motion, AnimatePresence } from 'framer-motion';
import type { ThemeMode } from '@/components/exhibition/types';

interface Source {
  source: string;
  type: string;
  preview: string;
  score: string;
}

interface SourceReferenceProps {
  sources: Source[];
  theme: ThemeMode;
  expanded: boolean;
  onToggle: () => void;
}

export default function SourceReference({
  sources,
  theme,
  expanded,
  onToggle
}: SourceReferenceProps) {
  const isDark = theme === 'dark';

  if (sources.length === 0) return null;

  return (
    <div className={`
      px-3 py-2 border-t text-xs
      ${isDark ? 'border-stone-700' : 'border-stone-200'}
    `}>
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-1 w-full text-left
          ${isDark ? 'text-stone-400 hover:text-stone-300' : 'text-stone-500 hover:text-stone-600'}
        `}
      >
        <svg
          className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span>📚 引用来源 ({sources.length})</span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-1.5">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className={`
                    p-2 rounded-lg text-xs
                    ${isDark ? 'bg-stone-800/50' : 'bg-stone-100'}
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span className={`
                      px-1.5 py-0.5 rounded text-[10px] uppercase
                      ${isDark ? 'bg-amber-800 text-amber-200' : 'bg-emerald-100 text-emerald-800'}
                    `}>
                      {source.type}
                    </span>
                    <span className={isDark ? 'text-stone-300' : 'text-stone-600'}>
                      {source.source}
                    </span>
                    <span className={`ml-auto ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                      {(parseFloat(source.score) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className={`mt-1 line-clamp-2 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                    {source.preview}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}