/**
 * ChartsMenu - 图表页面菜单
 *
 * 点击右上角菜单按钮时展开
 * 竖排显示在页面左侧，用于快捷选择图表
 */

import { memo } from 'react';
import type { ThemeMode } from '../exhibition/types';

interface ChartItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
}

interface ChartsMenuProps {
  isOpen: boolean;
  theme: ThemeMode;
  charts: ChartItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}

function ChartsMenu({ isOpen, theme, charts, activeIndex, onSelect, onClose }: ChartsMenuProps) {
  const isDark = theme === 'dark';

  // 颜色
  const activeText = isDark ? 'text-emerald-300' : 'text-[#4a7c59]';
  const inactiveText = isDark ? 'text-stone-300/80' : 'text-[#4a4e4a]/70';
  const activeDot = isDark ? 'bg-emerald-400' : 'bg-[#4a7c59]';
  const inactiveDot = isDark ? 'bg-stone-500/50' : 'bg-stone-400/40';

  return (
    <div
      role="navigation"
      aria-label="图表菜单导航"
      className={`fixed left-12 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        perspective: '800px',
      }}
    >
      <div
        className="flex flex-col gap-6"
        style={{
          transform: isOpen ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.9)',
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {charts.map((chart, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={chart.id}
              onClick={() => {
                onSelect(index);
                onClose();
              }}
              className={`flex items-center gap-4 cursor-pointer group transition-all duration-300 text-left ${
                isActive ? activeText : inactiveText
              }`}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: `translateX(${isOpen ? 0 : -20}px)`,
                transition: `transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.05}s, opacity 0.4s ease ${index * 0.05}s`,
                filter: isDark && isActive ? 'drop-shadow(0 0 12px rgba(52, 211, 153, 0.4))' : 'none',
              }}
            >
              {/* 指示点 */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive ? activeDot : inactiveDot
                }`}
                style={{
                  width: isActive ? '10px' : '6px',
                  height: isActive ? '10px' : '6px',
                  boxShadow: isActive
                    ? (isDark ? '0 0 15px rgba(52, 211, 153, 0.6)' : '0 0 15px rgba(74, 124, 89, 0.5)')
                    : 'none',
                }}
              />

              {/* 文字 */}
              <div className="flex flex-col">
                <span
                  className="font-serif tracking-[0.2em] whitespace-nowrap transition-all duration-300"
                  style={{
                    fontSize: isActive ? '1.25rem' : '1rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {chart.title}
                </span>
                <span
                  className={`text-[10px] tracking-widest mt-0.5 transition-all duration-300 ${
                    isDark ? 'opacity-40' : 'opacity-35'
                  }`}
                >
                  {chart.titleEn}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default memo(ChartsMenu);
