/**
 * BottomHUD - 底部 HUD 控制栏
 *
 * 左侧: REC / ISO 400
 * 中心: 装饰性文字
 * 右侧: 24FPS / SHUTTER
 * 支持亮/暗主题
 * 支持滚动退场动画
 *
 * dark: 暗色主题（亮色文字）
 * light: 亮色主题（暗色文字）
 */

import { memo } from 'react';
import type { OpeningTheme } from './types';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface BottomHUDProps {
  theme?: OpeningTheme;
}

function BottomHUD({ theme = 'dark' }: BottomHUDProps) {
  // dark = 暗色主题，light = 亮色主题
  const isDark = theme === 'dark';

  // 暗色主题颜色（在黑底上显示亮色）
  const recBgDark = 'bg-stone-100/10';
  const recColorDark = 'text-stone-50';
  const recIconColorDark = 'text-red-500';
  const itemColorDark = 'text-stone-500 hover:text-stone-200';
  const centerColorDark = 'text-white/20';

  // 亮色主题颜色（在白底上显示暗色）
  const recBgLight = 'bg-stone-900/5';
  const recColorLight = 'text-stone-900';
  const recIconColorLight = 'text-red-600';
  const itemColorLight = 'text-stone-500 hover:text-stone-900';
  const centerColorLight = 'text-stone-900/30';

  const recBg = isDark ? recBgDark : recBgLight;
  const recColor = isDark ? recColorDark : recColorLight;
  const recIconColor = isDark ? recIconColorDark : recIconColorLight;
  const itemColor = isDark ? itemColorDark : itemColorLight;
  const centerColor = isDark ? centerColorDark : centerColorLight;

  // 滚动进度
  const { progress } = useScrollProgressContext();

  // 退场动画：与图片扩散同步，当图片边缘接近时开始
  const fadeProgress = Math.max(0, Math.min(1, (progress - 0.4) / 0.4));
  const opacity = 1 - fadeProgress;
  const translateY = fadeProgress * 100;

  return (
    <footer
      className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-end px-12 pb-12 bg-transparent"
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: 'opacity, transform',
      }}
    >
      <div className="flex items-center gap-16">
        {/* REC Indicator */}
        <div className={`flex flex-col items-center ${recColor} ${recBg} rounded-none p-2 text-[10px] tracking-widest font-serif`}>
          <span className={`material-symbols-outlined mb-1 ${recIconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
            videocam
          </span>
          <span>REC</span>
        </div>
        {/* ISO */}
        <div className={`flex flex-col items-center p-2 text-[10px] tracking-widest font-serif transition-colors ${itemColor}`}>
          <span className="material-symbols-outlined mb-1">
            settings_input_component
          </span>
          <span>ISO</span>
        </div>
      </div>

      {/* Center Metadata (Decorative HUD) */}
      <div className={`hidden lg:block font-serif text-[9px] tracking-[0.5em] pb-2 ${centerColor}`}>
        扫描空间增强现实体
      </div>

      <div className="flex items-center gap-16">
        {/* 24FPS */}
        <div className={`flex flex-col items-center p-2 text-[10px] tracking-widest font-serif transition-colors ${itemColor}`}>
          <span className="material-symbols-outlined mb-1">
            speed
          </span>
          <span>FPS</span>
        </div>
        {/* SHUTTER */}
        <div className={`flex flex-col items-center p-2 text-[10px] tracking-widest font-serif transition-colors ${itemColor}`}>
          <span className="material-symbols-outlined mb-1">
            camera_roll
          </span>
          <span>S</span>
        </div>
      </div>
    </footer>
  );
}

export default memo(BottomHUD);
