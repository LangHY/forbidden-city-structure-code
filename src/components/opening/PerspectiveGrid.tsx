/**
 * PerspectiveGrid - 3D 透视网格背景
 *
 * 带 vignette 暗角效果
 * 支持亮/暗主题
 *
 * dark: 暗色主题（黑底白线）
 * light: 亮色主题（白底黑线）
 */

import { memo } from 'react';
import type { OpeningTheme } from './types';

interface PerspectiveGridProps {
  theme?: OpeningTheme;
}

function PerspectiveGrid({ theme = 'dark' }: PerspectiveGridProps) {
  // dark = 暗色主题，light = 亮色主题
  const isDark = theme === 'dark';

  return (
    // 使用 absolute 而不是 fixed，这样父元素的 transform 会生效
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={isDark ? 'perspective-grid' : 'perspective-grid-light'} />
      <div className={`absolute inset-0 ${isDark ? 'vignette' : 'vignette-light'}`} />
    </div>
  );
}

export default memo(PerspectiveGrid);
