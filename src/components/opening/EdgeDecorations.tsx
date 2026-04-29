/**
 * EdgeDecorations - 边缘装饰线
 *
 * 左右两侧的垂直装饰线
 * 支持亮/暗主题
 * 支持滚动淡出动画
 *
 * dark: 暗色主题（白色线）
 * light: 亮色主题（黑色线）
 */

import { memo } from 'react';
import type { OpeningTheme } from './types';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface EdgeDecorationsProps {
  theme?: OpeningTheme;
}

function EdgeDecorations({ theme = 'dark' }: EdgeDecorationsProps) {
  // dark = 暗色主题（白色线），light = 亮色主题（黑色线）
  const isDark = theme === 'dark';
  const lineColor = isDark ? 'bg-white/10' : 'bg-black/10';

  // 滚动进度
  const { progress } = useScrollProgressContext();

  // 淡出动画：与图片扩散同步
  const fadeProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
  const opacity = 1 - fadeProgress;

  return (
    <>
      <div
        className={`fixed top-1/2 left-4 -translate-y-1/2 h-32 w-[1px] ${lineColor} hidden md:block`}
        style={{
          opacity,
          willChange: 'opacity',
        }}
      />
      <div
        className={`fixed top-1/2 right-4 -translate-y-1/2 h-32 w-[1px] ${lineColor} hidden md:block`}
        style={{
          opacity,
          willChange: 'opacity',
        }}
      />
    </>
  );
}

export default memo(EdgeDecorations);
