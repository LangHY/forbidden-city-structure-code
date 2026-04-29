/**
 * RouterHeader - 路由页面顶部导航栏
 *
 * 包含 Logo、导航链接和工具图标
 * 支持亮/暗主题
 */

import { memo } from 'react';
import type { RouterTheme } from './types';

interface RouterHeaderProps {
  theme?: RouterTheme;
  onThemeToggle?: () => void;
}

function RouterHeader({ theme = 'light', onThemeToggle }: RouterHeaderProps) {
  const isLight = theme === 'light';

  // 主题相关样式
  const bgClass = isLight
    ? 'bg-[#f9f7f2]/80 border-b border-[#2a2520]/5'
    : 'bg-stone-950/60';
  const logoColor = isLight ? 'text-[#2a2520]' : 'text-stone-100';
  const navActiveColor = isLight
    ? 'text-[#2a2520] border-b border-[#2a2520]/30'
    : 'text-stone-100 border-b border-stone-100/50';
  const navInactiveColor = isLight
    ? 'text-[#6b635a] hover:text-[#2a2520]'
    : 'text-stone-400 hover:text-stone-100';
  const iconColor = isLight ? 'text-[#2a2520]' : 'text-stone-100';

  return (
    <header
      className={`fixed top-0 w-full z-50 flex justify-between items-center px-12 py-6 backdrop-blur-xl ${bgClass}`}
    >
      {/* Logo */}
      <div className={`text-2xl font-serif italic tracking-tighter ${logoColor}`}>
        ARCH-LAB
      </div>

      {/* 导航链接 */}
      <nav className="hidden md:flex items-center gap-12">
        <a
          className={`${navActiveColor} pb-1 font-mono text-xs tracking-widest transition-colors duration-500`}
          href="#"
        >
          EXPLORE
        </a>
        <a
          className={`${navInactiveColor} font-mono text-xs tracking-widest transition-colors duration-500`}
          href="#"
        >
          ARCHIVE
        </a>
        <a
          className={`${navInactiveColor} font-mono text-xs tracking-widest transition-colors duration-500`}
          href="#"
        >
          TECHNICAL
        </a>
      </nav>

      {/* 工具图标 */}
      <div className={`flex items-center gap-6 ${iconColor}`}>
        <span className="material-symbols-outlined text-[20px] cursor-pointer hover:opacity-70 transition-opacity">
          videocam
        </span>
        <span
          className="material-symbols-outlined text-[20px] cursor-pointer hover:opacity-70 transition-opacity"
          onClick={onThemeToggle}
        >
          {isLight ? 'dark_mode' : 'light_mode'}
        </span>
      </div>
    </header>
  );
}

export default memo(RouterHeader);
