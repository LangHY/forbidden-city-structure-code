/**
 * RouterBackground - 路由页面背景层
 *
 * 包含宣纸纹理、网格、中央图片和晕染效果
 * 支持亮/暗主题
 */

import { memo } from 'react';
import type { RouterTheme } from './types';

interface RouterBackgroundProps {
  theme?: RouterTheme;
}

function RouterBackground({ theme = 'light' }: RouterBackgroundProps) {
  const isLight = theme === 'light';

  // 主题相关的样式
  const bgClass = isLight ? 'bg-[#f9f7f2]' : 'bg-[#111413]';
  const gridOpacity = isLight ? 'opacity-60' : 'opacity-40';
  const imageOpacity = isLight ? 'opacity-50' : 'opacity-60';
  const imageFilter = isLight
    ? 'grayscale contrast-110 brightness-95'
    : 'grayscale invert brightness-75 contrast-125';

  return (
    <div className={`fixed inset-0 z-0 ${bgClass}`}>
      {/* 宣纸纹理 (仅浅色主题) */}
      {isLight && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            opacity: 0.03,
          }}
        />
      )}

      {/* 网格覆盖 */}
      <div
        className={`absolute inset-0 ${gridOpacity}`}
        style={{
          backgroundImage: isLight
            ? 'linear-gradient(to right, rgba(42,37,32,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,37,32,0.04) 1px, transparent 1px)'
            : 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      {/* 中央图片 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`relative w-full h-full max-w-6xl max-h-[819px] ${imageOpacity}`}>
          <img
            className={`w-full h-full object-contain ${imageFilter}`}
            alt="monochrome wireframe axonometric drawing of a traditional Chinese wooden pavilion"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIwpkIbeug7VMxtxZUb-94PQNS_PtokOv6toCpaBsVqHb4Zp7ssPGTtqGkDm8Y6EYbOpL_P9s0zrUnlUNq8LY9aAuSyCBD2Ho2BMWTfPrGZpb1vH-wwW6LbpOZHfmuf8lZ09Y5CPZts_bhc4OxSi_k5T_00NC599hWGJvcRM49JgJMaZZw80ZlZm3Gd6dOXe8q-UYUxKRWU7av2qQlzMqF_U-STzvfxgzu-dfZVQrecN8eoGTfcYSYYZ6KNFqLyubHmMrzoyDdc0"
          />
          {/* 晕染效果 */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isLight
                ? 'radial-gradient(circle, transparent 30%, rgba(42,37,32,0.03) 100%)'
                : 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.8) 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(RouterBackground);
