/**
 * DecorativeChar - 装饰性大字
 *
 * 右上角显示当前章节名称
 * 第一行 2 个字，剩余放第二行
 * 如果两行字数不同，第一行靠左错开
 */

import { memo, useMemo } from 'react';
import type { ThemeMode } from './types';

interface DecorativeCharProps {
  char: string;
  theme?: ThemeMode;
  isBlurred?: boolean;
  className?: string;
}

function DecorativeChar({ char, theme = 'light', isBlurred = false, className = '' }: DecorativeCharProps) {
  // 暗色模式使用更高对比度
  const textColor = theme === 'dark' ? 'text-stone-100' : 'text-[#2e3230]';
  const opacity = theme === 'dark' ? 'opacity-[0.08]' : 'opacity-6';

  // 分割：第一行 2 个字，剩余放第二行
  const lines = useMemo(() => {
    if (char.length <= 2) {
      return [char];
    }
    return [char.slice(0, 2), char.slice(2)];
  }, [char]);

  // 判断是否需要错开（两行且字数不同）
  const shouldOffset = lines.length === 2 && lines[0].length !== lines[1].length;

  return (
    <div
      className={`fixed top-24 right-24 ${opacity} pointer-events-none z-20 flex flex-col items-end transition-colors duration-500 ${className}`}
      style={{
        filter: isBlurred ? 'blur(12px)' : undefined,
        opacity: isBlurred ? 0.5 : undefined,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
      {lines.map((line, index) => (
        <div
          key={index}
          className={`font-serif select-none leading-tight tracking-[0.15em] ${textColor}`}
          style={{
            fontSize: '48px',
            marginTop: index > 0 ? '12px' : '0',
            // 第一行错开
            marginRight: index === 0 && shouldOffset ? '180px' : '0',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
}

export default memo(DecorativeChar);
