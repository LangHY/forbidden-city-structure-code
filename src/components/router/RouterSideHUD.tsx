/**
 * RouterSideHUD - 路由页面侧边 HUD 信息
 *
 * 左侧：REC、时间码、ISO
 * 右侧：帧率、分辨率、比例尺
 * 支持亮/暗主题
 */

import { memo } from 'react';
import type { RouterTheme } from './types';

interface RouterSideHUDProps {
  theme?: RouterTheme;
}

function RouterSideHUD({ theme = 'light' }: RouterSideHUDProps) {
  const isLight = theme === 'light';

  // 主题相关样式
  const textColor = isLight ? 'text-[#6b635a]' : 'text-stone-500';
  const recColor = isLight ? 'text-[#c41e3a]' : 'text-red-500';
  const dotColor = isLight ? 'bg-[#6b635a]' : 'bg-stone-500';

  return (
    <>
      {/* 左侧 HUD */}
      <aside className="fixed left-0 top-1/2 -translate-y-1/2 h-auto z-40 flex flex-col gap-8 px-6 bg-transparent">
        {/* REC */}
        <div className={`${recColor} flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]`}>
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            radio_button_checked
          </span>
          REC
        </div>

        {/* 时间码 */}
        <div className={`${textColor} flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]`}>
          <span className="material-symbols-outlined text-sm">timer</span>
          TC 00:14:02:12
        </div>

        {/* ISO */}
        <div className={`${textColor} flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em]`}>
          <span className="material-symbols-outlined text-sm">settings_input_component</span>
          ISO 800
        </div>
      </aside>

      {/* 右侧 HUD */}
      <aside
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-1 font-mono text-[10px] tracking-widest ${textColor} uppercase`}
      >
        <div className="flex items-center gap-2">
          <span>24 FPS</span>
          <div className={`w-1 h-1 ${dotColor} rounded-full`}></div>
        </div>
        <div className="flex items-center gap-2">
          <span>4K RAW</span>
          <div className={`w-1 h-1 ${dotColor} rounded-full`}></div>
        </div>
        <div className="mt-4 flex flex-col items-end opacity-40">
          <div className={`h-12 w-[1px] ${dotColor} mb-2`}></div>
          <span className="rotate-90 origin-bottom-right mb-12">SCALE_REF</span>
        </div>
      </aside>
    </>
  );
}

export default memo(RouterSideHUD);
