/**
 * RouterDecorations - 路由页面装饰元素
 *
 * 角落装饰标记
 * 支持亮/暗主题
 */

import { memo } from 'react';
import type { RouterTheme } from './types';

interface RouterDecorationsProps {
  theme?: RouterTheme;
}

function RouterDecorations({ theme = 'light' }: RouterDecorationsProps) {
  const isLight = theme === 'light';
  const lineColor = isLight ? 'bg-[#2a2520]' : 'bg-stone-100';

  return (
    <>
      {/* 左上角 */}
      <div className="fixed top-24 left-12 w-8 h-8 pointer-events-none opacity-20">
        <div className={`absolute top-0 left-0 w-4 h-[1px] ${lineColor}`}></div>
        <div className={`absolute top-0 left-0 w-[1px] h-4 ${lineColor}`}></div>
      </div>

      {/* 右下角 */}
      <div className="fixed bottom-24 right-12 w-8 h-8 pointer-events-none opacity-20">
        <div className={`absolute bottom-0 right-0 w-4 h-[1px] ${lineColor}`}></div>
        <div className={`absolute bottom-0 right-0 w-[1px] h-4 ${lineColor}`}></div>
      </div>
    </>
  );
}

export default memo(RouterDecorations);
