/**
 * RouterNavZone - 路由页面导航区域
 *
 * 三个导航卡片：数字考古、结构蓝图、沉浸空间
 * 支持亮/暗主题
 */

import { memo } from 'react';
import { Link } from 'react-router-dom';
import type { RouterTheme, NavZone } from './types';

interface RouterNavZoneProps {
  theme?: RouterTheme;
}

const navZones: NavZone[] = [
  {
    id: 'archive',
    sequence: '/ SEQUENCE_01',
    titleCn: '数字考古',
    titleEn: 'DIGITAL ARCHIVE',
    action: 'ACCESS DATABASE',
    href: '/exhibition',
  },
  {
    id: 'blueprint',
    sequence: '/ SEQUENCE_02',
    titleCn: '结构蓝图',
    titleEn: 'STRUCTURAL BLUEPRINT',
    action: 'RUN_SIMULATION',
    href: '/exhibition',
  },
  {
    id: 'immersive',
    sequence: '/ SEQUENCE_03',
    titleCn: '沉浸空间',
    titleEn: 'IMMERSIVE SPACE',
    action: 'ENGAGE_VR',
    href: '#',
  },
];

function RouterNavZone({ theme = 'light' }: RouterNavZoneProps) {
  const isLight = theme === 'light';

  // 主题相关样式
  const borderColor = isLight ? 'border-[#2a2520]/5' : 'border-stone-100/5';
  const hoverBg = isLight ? 'hover:bg-[#2a2520]/[0.02]' : 'hover:bg-stone-100/[0.02]';
  const sequenceColor = isLight
    ? 'text-[#6b635a] group-hover:text-[#4a7c59]'
    : 'text-stone-500 group-hover:text-stone-300';
  const titleCnColor = isLight ? 'text-[#2a2520]' : 'text-stone-100';
  const titleEnColor = isLight
    ? 'text-[#6b635a] group-hover:text-[#2a2520]'
    : 'text-stone-400 group-hover:text-stone-100';
  const accentColor = isLight ? 'bg-[#8b4513]' : 'bg-primary';
  const cornerColor = isLight ? 'bg-[#2a2520]/20' : 'bg-stone-100/20';
  const actionColor = isLight ? 'text-[#6b635a]' : 'text-stone-400';
  const actionLineColor = isLight ? 'bg-[#2a2520]/10' : 'bg-stone-100/10';

  return (
    <main className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 md:px-24">
      {/* 大标题 */}
      <div className="mb-24 text-center pointer-events-none">
        <h1
          className={`font-headline italic text-5xl md:text-9xl ${isLight ? 'text-[#2a2520] opacity-[0.06]' : 'text-stone-100 opacity-10'} tracking-[0.3em] leading-none select-none`}
        >
          ZIJING CRAFTSMANSHIP
        </h1>
      </div>

      {/* 导航区域 */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-0 w-full max-w-7xl border-x ${borderColor}`}>
        {navZones.map((zone, index) => (
          <Link
            key={zone.id}
            className={`group relative block p-12 ${index < navZones.length - 1 ? `border-r ${borderColor}` : ''} transition-all duration-700 ${hoverBg}`}
            to={zone.href}
          >
            {/* 左上角装饰线 (第一个) */}
            {index === 0 && (
              <>
                <div className={`absolute top-0 left-0 w-4 h-[1px] ${cornerColor} group-hover:${accentColor} transition-colors`}></div>
                <div className={`absolute top-0 left-0 w-[1px] h-4 ${cornerColor} group-hover:${accentColor} transition-colors`}></div>
              </>
            )}

            {/* 右上角装饰线 (最后一个) */}
            {index === navZones.length - 1 && (
              <>
                <div className={`absolute top-0 right-0 w-4 h-[1px] ${cornerColor} group-hover:${accentColor} transition-colors`}></div>
                <div className={`absolute top-0 right-0 w-[1px] h-4 ${cornerColor} group-hover:${accentColor} transition-colors`}></div>
              </>
            )}

            {/* 序号 */}
            <div className={`mb-20 font-label text-[10px] tracking-[0.4em] ${sequenceColor} transition-colors uppercase`}>
              {zone.sequence}
            </div>

            {/* 标题 */}
            <div className="space-y-2">
              <span className={`block font-headline italic text-3xl ${titleCnColor}`}>
                {zone.titleCn}
              </span>
              <h2 className={`font-label text-xl tracking-tighter ${titleEnColor} transition-colors`}>
                {zone.titleEn}
              </h2>
            </div>

            {/* 悬停显示的操作提示 */}
            <div className="mt-12 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className={`text-[10px] font-mono tracking-widest ${actionColor}`}>
                {zone.action} [ ]
              </span>
              <div className={`h-[1px] flex-grow ${actionLineColor}`}></div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default memo(RouterNavZone);
