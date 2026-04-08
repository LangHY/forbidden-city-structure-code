/**
 * ThemeToggle - 主题切换按钮
 *
 * 玻璃态风格，与整体页面一致
 */

import { memo } from 'react';
import type { ThemeMode } from './types';

interface ThemeToggleProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

function ThemeToggle({ theme, onChange }: ThemeToggleProps) {
  const isDark = theme === 'dark';
  const panelClass = isDark ? 'glass-panel-dark' : 'glass-panel';
  const iconColor = isDark ? 'text-stone-300 hover:text-stone-100' : 'text-[#74796e] hover:text-[#4a7c59]';

  return (
    <button
      onClick={() => onChange(isDark ? 'light' : 'dark')}
      className={`w-10 h-10 rounded-full ${panelClass} flex items-center justify-center ${iconColor} transition-all duration-300`}
      aria-label={isDark ? '切换到浅色模式' : '切换到暗色模式'}
    >
      <span className="text-lg">
        {isDark ? '☀️' : '🌙'}
      </span>
    </button>
  );
}

export default memo(ThemeToggle);
