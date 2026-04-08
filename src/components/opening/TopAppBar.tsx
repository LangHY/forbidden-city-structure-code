/**
 * TopAppBar - 顶部导航栏
 *
 * Logo + 导航链接 + 菜单按钮
 * 支持亮/暗主题
 * 支持滚动退场动画
 * 点击 Logo 跳转首页
 *
 * dark: 暗色主题（亮色文字）
 * light: 亮色主题（暗色文字）
 */

import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OpeningTheme } from './types';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface TopAppBarProps {
  theme?: OpeningTheme;
}

function TopAppBar({ theme = 'dark' }: TopAppBarProps) {
  const navigate = useNavigate();

  // dark = 暗色主题（使用亮色文字），light = 亮色主题（使用暗色文字）
  const isDark = theme === 'dark';

  const logoColor = isDark ? 'text-stone-100' : 'text-stone-900';
  const navActiveColor = isDark ? 'text-stone-50 border-stone-50' : 'text-stone-900 border-stone-900';
  const navInactiveColor = isDark
    ? 'text-stone-400 hover:text-stone-200'
    : 'text-stone-500 hover:text-stone-800';
  const menuColor = isDark ? 'text-stone-100' : 'text-stone-900';
  const blurClass = isDark ? 'backdrop-blur-xl' : 'backdrop-blur-sm';

  // 滚动进度
  const { progress } = useScrollProgressContext();

  // 退场动画：当图片边缘即将到达导航栏时开始
  // 图片 scale 从 1 → 2.4，当 scale ≈ 1.8 时图片边缘接近导航栏
  // 对应 progress ≈ 0.57 (因为 scale = 1 + progress * 1.4)
  // 提前一点开始，让动画更平滑
  const fadeProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
  const opacity = 1 - fadeProgress;
  const translateY = -fadeProgress * 100;

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-12 py-8 bg-transparent ${blurClass}`}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: 'opacity, transform',
      }}
    >
      <div
        className={`text-2xl font-quanHeng tracking-widest font-light ${logoColor} cursor-pointer hover:opacity-80 transition-opacity`}
        onClick={handleLogoClick}
      >
        紫禁匠心
      </div>
      <nav className="hidden md:flex items-center gap-12">
        <a
          className={`text-sm tracking-widest font-serif font-bold border-b pb-1 hover:scale-[0.99] transition-transform ${navActiveColor}`}
          href="#"
        >
          展廊
        </a>
        <a
          className={`text-sm tracking-widest font-serif font-normal transition-colors ${navInactiveColor}`}
          href="#"
        >
          技术
        </a>
        <a
          className={`text-sm tracking-widest font-serif font-normal transition-colors ${navInactiveColor}`}
          href="#"
        >
          关于
        </a>
      </nav>
      <div className={`flex items-center gap-4 ${menuColor}`}>
        <span className="material-symbols-outlined hover:opacity-70 transition-opacity cursor-pointer">
          menu
        </span>
      </div>
    </header>
  );
}

export default memo(TopAppBar);
