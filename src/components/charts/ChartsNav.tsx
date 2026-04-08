/**
 * ChartsNav - 图表页面顶部导航
 *
 * 复用 ExhibitionNav 的风格
 * Logo 点击跳转首页
 */

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ThemeMode } from '../exhibition/types';
import ThemeToggle from '../exhibition/ThemeToggle';
import MenuButton from '../exhibition/MenuButton';

interface ChartsNavProps {
  theme?: ThemeMode;
  onThemeChange?: (theme: ThemeMode) => void;
  isMenuOpen?: boolean;
  onMenuToggle?: (isOpen: boolean) => void;
  showLogo?: boolean;
  className?: string;
}

function ChartsNav({
  theme = 'light',
  onThemeChange,
  isMenuOpen = false,
  onMenuToggle,
  showLogo = true,
  className = '',
}: ChartsNavProps) {
  const navigate = useNavigate();

  const textColor = theme === 'dark' ? 'text-stone-100' : 'text-[#4a7c59]';
  const linkColor = theme === 'dark'
    ? 'text-stone-300/90 hover:text-emerald-400'
    : 'text-[#4a4e4a] hover:text-[#4a7c59]';

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent transition-colors duration-500 ${className}`}
    >
      {/* Logo */}
      <div
        className={`text-2xl font-quanHeng ${textColor} tracking-[0.3em] font-bold transition-opacity duration-500 cursor-pointer hover:opacity-80 ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleLogoClick}
      >
        紫禁匠心
      </div>

      <div className="flex gap-12">
        {/* 导航链接 */}
        <nav className="hidden md:flex gap-8 items-center">
          <a
            href="/exhibition"
            className={`${linkColor} transition-colors duration-300 text-sm tracking-widest font-serif`}
          >
            斗拱展览
          </a>
        </nav>

        {/* 控件区域 */}
        <div className="flex items-center gap-4">
          {onThemeChange && (
            <ThemeToggle theme={theme} onChange={onThemeChange} />
          )}
          {onMenuToggle && (
            <MenuButton
              theme={theme}
              isOpen={isMenuOpen}
              onClick={() => onMenuToggle(!isMenuOpen)}
            />
          )}
        </div>
      </div>
    </header>
  );
}

export default memo(ChartsNav);
