/**
 * RouterFooter - 路由页面底部页脚
 *
 * 版权信息和链接
 * 支持亮/暗主题
 */

import { memo } from 'react';
import type { RouterTheme } from './types';

interface RouterFooterProps {
  theme?: RouterTheme;
}

function RouterFooter({ theme = 'light' }: RouterFooterProps) {
  const isLight = theme === 'light';

  const textColor = isLight ? 'text-[#6b635a]' : 'text-stone-500';
  const linkColor = isLight ? 'text-[#a39d93]' : 'text-stone-600';
  const linkHoverColor = isLight ? 'hover:text-[#2a2520]' : 'hover:text-stone-300';
  const activeColor = isLight ? 'text-[#2a2520]' : 'text-stone-100';

  return (
    <footer className="fixed bottom-0 w-full z-50 flex justify-between items-end w-full px-12 py-8 bg-transparent">
      <div className={`font-mono text-[9px] tracking-widest ${textColor}`}>
        © 2024 ARCH-LAB / CINEMATIC SEQUENCE
      </div>
      <div className={`flex gap-12 font-mono text-[9px] tracking-widest ${linkColor}`}>
        <a className={`${linkHoverColor} transition-colors ease-in-out uppercase`} href="#">
          TERMS
        </a>
        <a className={`${linkHoverColor} transition-colors ease-in-out uppercase`} href="#">
          SENSORS
        </a>
        <a className={`${linkHoverColor} transition-colors ease-in-out uppercase ${activeColor}`} href="#">
          HUD_v2.1
        </a>
      </div>
    </footer>
  );
}

export default memo(RouterFooter);
