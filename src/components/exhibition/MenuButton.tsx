/**
 * MenuButton - 菜单按钮
 *
 * 圆形玻璃态按钮，样式与 ThemeToggle 一致
 * 点击时切换图标
 */

import { memo } from 'react';
import type { ThemeMode } from './types';

interface MenuButtonProps {
  theme: ThemeMode;
  isOpen: boolean;
  onClick: () => void;
}

function MenuButton({ theme, isOpen, onClick }: MenuButtonProps) {
  const isDark = theme === 'dark';
  const panelClass = isDark ? 'glass-panel-dark' : 'glass-panel';
  const iconColor = isDark ? 'text-stone-300 hover:text-stone-100' : 'text-[#74796e] hover:text-[#4a7c59]';

  return (
    <button
      onClick={onClick}
      className={`w-10 h-10 rounded-full ${panelClass} flex items-center justify-center ${iconColor} transition-all duration-300`}
      aria-label={isOpen ? '关闭菜单' : '打开菜单'}
    >
      {isOpen ? (
        // Close icon (X)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      ) : (
        // Menu icon (三横线)
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      )}
    </button>
  );
}

export default memo(MenuButton);
