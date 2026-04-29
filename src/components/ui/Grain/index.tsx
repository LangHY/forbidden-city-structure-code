/**
 * Grain - 噪点背景层
 */

import { memo } from 'react';

interface GrainProps {
  opacity?: number;
}

function Grain({ opacity = 0.05 }: GrainProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity }}
    >
      <svg className="w-full h-full">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

export default memo(Grain);
