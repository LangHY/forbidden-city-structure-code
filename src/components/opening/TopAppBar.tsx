/**
 * TopAppBar - 顶部导航栏
 *
 * Logo + 菜单按钮
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
    </header>
  );
}

export default memo(TopAppBar);
