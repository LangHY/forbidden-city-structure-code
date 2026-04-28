/**
 * ChartsNav - 图表页面顶部导航
 *
 * 复用 ExhibitionNav 的风格
 * Logo 点击跳转首页
 */

import { memo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
  const location = useLocation();

  const textColor = theme === 'dark' ? 'text-stone-100' : 'text-[#4a7c59]';
  const linkColor = theme === 'dark'
    ? 'text-stone-300/90 hover:text-emerald-400'
    : 'text-[#4a4e4a] hover:text-[#4a7c59]';
  const activeLinkColor = theme === 'dark' ? 'text-emerald-400' : 'text-[#4a7c59]';

  const handleLogoClick = () => {
    navigate('/');
  };

  // 导航项配置
  const navItems = [
    { label: '数字考古', path: '/charts' },
    { label: '结构蓝图', path: '/exhibition' },
    { label: '中轴巡礼', path: '/axis' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-6 bg-transparent transition-colors duration-500 ${className}`}
    >
      {/* Logo */}
      <div
        className={`text-2xl font-quanHeng ${textColor} tracking-[0.3em] font-bold transition-opacity duration-500 cursor-pointer hover:opacity-80 ${
          showLogo ? 'opacity-100' : 'opacity-0'
        }`}
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleLogoClick()
          }
        }}
        aria-label="返回首页"
      >
        紫禁匠心
      </div>

      <div className="flex gap-12">
        {/* 导航链接 */}
        <nav className="hidden md:flex gap-10 items-center" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`transition-colors duration-300 text-sm tracking-widest font-serif ${
                location.pathname === item.path ? activeLinkColor : linkColor
              }`}
            >
              {item.label}
            </Link>
          ))}
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
