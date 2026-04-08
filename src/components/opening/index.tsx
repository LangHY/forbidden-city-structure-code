/**
 * Opening - 开场页主组件
 *
 * 支持亮/暗主题切换
 * 支持滚动动画
 * 滚动结束时：视频定格在最后一帧 + 高斯模糊，Router UI 由模糊到清晰
 */

import { memo, useState, useCallback, useMemo } from 'react';
import PerspectiveGrid from './PerspectiveGrid';
import TopAppBar from './TopAppBar';
import HeroCanvas from './HeroCanvas';
import BottomHUD from './BottomHUD';
import EdgeDecorations from './EdgeDecorations';
import SubjectVideo from './SubjectVideo';
import type { OpeningTheme } from './types';
import { useScrollProgress } from './hooks/useScrollProgress';
import { ScrollProgressProvider } from './context/ScrollProgressContext';

// Router 页面组件
import RouterBackground from '../router/RouterBackground';
import RouterSideHUD from '../router/RouterSideHUD';
import RouterNavZone from '../router/RouterNavZone';
import RouterFooter from '../router/RouterFooter';
import RouterDecorations from '../router/RouterDecorations';

interface OpeningProps {
  initialTheme?: OpeningTheme;
}

function Opening({ initialTheme = 'dark' }: OpeningProps) {
  const [theme, setTheme] = useState<OpeningTheme>(initialTheme);
  const scrollProgress = useScrollProgress();

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const isDark = theme === 'dark';
  const routerTheme = isDark ? 'dark' : 'light';

  // 背景色
  const bgColor = isDark ? 'bg-background' : 'bg-light-background';
  const textColor = isDark ? 'text-on-background' : 'text-light-on-background';
  const selectionBg = isDark
    ? 'selection:bg-primary-container selection:text-on-primary-container'
    : 'selection:bg-secondary-container selection:text-on-secondary-container';

  // 背景向上移动
  const backgroundTransform = useMemo(() => {
    const translateY = -scrollProgress * 100;
    return `translateY(${translateY}vh)`;
  }, [scrollProgress]);

  // 背景网格模糊效果（progress > 0.8 时开始）
  const gridBlurAmount = useMemo(() => {
    if (scrollProgress < 0.8) return 0;
    return Math.min(20, (scrollProgress - 0.8) * 100);
  }, [scrollProgress]);

  // 视频层模糊效果（progress > 0.85 时开始模糊）
  const videoBlurAmount = useMemo(() => {
    if (scrollProgress < 0.85) return 0;
    return Math.min(30, (scrollProgress - 0.85) * 200);
  }, [scrollProgress]);

  // Opening UI 组件透明度（progress > 0.7 时淡出）
  const uiOpacity = useMemo(() => {
    if (scrollProgress < 0.7) return 1;
    return Math.max(0, 1 - (scrollProgress - 0.7) / 0.25);
  }, [scrollProgress]);

  // Router UI 透明度（progress > 0.85 时显示）
  const routerOpacity = useMemo(() => {
    if (scrollProgress < 0.85) return 0;
    return Math.min(1, (scrollProgress - 0.85) / 0.15);
  }, [scrollProgress]);

  // Router UI 模糊效果（由模糊到清晰）
  const routerBlurAmount = useMemo(() => {
    if (scrollProgress < 0.85) return 20;
    return Math.max(0, 20 - (scrollProgress - 0.85) * 133.33);
  }, [scrollProgress]);

  return (
    <ScrollProgressProvider progress={scrollProgress}>
      <div className={`relative h-screen ${bgColor} ${textColor} font-body overflow-hidden ${selectionBg}`}>
        {/* 最底层：Router 背景色 */}
        <div className="fixed inset-0 z-0">
          <RouterBackground theme={routerTheme} />
        </div>

        {/* 视频层 - 定格在最后一帧 + 高斯模糊，高于 Router 背景 */}
        <div
          className="fixed inset-0 z-10"
          style={{
            filter: `blur(${videoBlurAmount}px)`,
            transition: 'filter 0.3s ease-out',
            willChange: 'filter',
            pointerEvents: 'none',
          }}
        >
          <SubjectVideo theme={theme} />
        </div>

        {/* 背景网格层 - 单独模糊 */}
        <div
          className="fixed inset-0 z-15 pointer-events-none"
          style={{
            filter: `blur(${gridBlurAmount}px)`,
            opacity: uiOpacity,
            transform: backgroundTransform,
            willChange: 'filter, opacity, transform',
          }}
        >
          <PerspectiveGrid theme={theme} />
        </div>

        {/* Router 页面文字组件 - 由模糊到清晰，高于视频层 */}
        <div
          className="fixed inset-0 z-20"
          style={{
            opacity: routerOpacity,
            filter: `blur(${routerBlurAmount}px)`,
            pointerEvents: scrollProgress > 0.9 ? 'auto' : 'none',
            transition: 'filter 0.3s ease-out',
            willChange: 'opacity, filter',
          }}
        >
          <RouterSideHUD theme={routerTheme} />
          <RouterNavZone theme={routerTheme} />
          <RouterFooter theme={routerTheme} />
          <RouterDecorations theme={routerTheme} />
        </div>

        {/* Opening UI 组件层 */}
        <div
          className="fixed inset-0 z-30 pointer-events-none"
          style={{ opacity: uiOpacity }}
        >
          <div className={scrollProgress > 0.85 ? 'pointer-events-none' : 'pointer-events-auto'}>
            <TopAppBar theme={theme} />
            <HeroCanvas theme={theme} />
            <BottomHUD theme={theme} />
            <EdgeDecorations theme={theme} />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="fixed top-8 right-20 z-50 w-10 h-10 flex items-center justify-center rounded-full transition-all hover:scale-110 pointer-events-auto"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', display: scrollProgress > 0.85 ? 'none' : undefined }}
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined" style={{ color: isDark ? '#fff' : '#1d201f' }}>
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
        </div>
      </div>

      {/* 滚动占位空间 */}
      <div className="h-[200vh] bg-white" />
    </ScrollProgressProvider>
  );
}

export default memo(Opening);
