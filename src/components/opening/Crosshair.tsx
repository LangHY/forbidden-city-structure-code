/**
 * Crosshair - 十字准星装饰
 *
 * 四角准星 + 中心准星
 * 支持亮/暗主题
 *
 * dark: 暗色主题（白色准星）
 * light: 亮色主题（黑色准星）
 */

import { memo } from 'react';
import type { OpeningTheme } from './types';

interface CrosshairProps {
  theme?: OpeningTheme;
}

function Crosshair({ theme = 'dark' }: CrosshairProps) {
  // dark = 暗色主题（白色准星），light = 亮色主题（黑色准星）
  const isDark = theme === 'dark';
  const crosshairClass = isDark ? 'crosshair' : 'crosshair-light';
  const centerColor = isDark ? 'bg-white/10' : 'bg-black/10';

  return (
    <>
      {/* 四角准星 */}
      <div className={`${crosshairClass} top-0 left-0 border-r-0 border-b-0`} />
      <div className={`${crosshairClass} top-0 right-0 border-l-0 border-b-0`} />
      <div className={`${crosshairClass} bottom-0 left-0 border-r-0 border-t-0`} />
      <div className={`${crosshairClass} bottom-0 right-0 border-l-0 border-t-0`} />
      {/* 中心准星 */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-8 ${centerColor}`} />
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[1px] w-8 ${centerColor}`} />
    </>
  );
}

export default memo(Crosshair);
