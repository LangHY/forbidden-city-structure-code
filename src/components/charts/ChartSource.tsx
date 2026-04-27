/**
 * ChartSource - 数据来源标注组件
 *
 * 显示图表的数据来源和 Flourish 技术标识
 * 遵循项目设计规范
 */

import { memo } from 'react';
import type { ThemeMode } from '../exhibition/types';

interface ChartSourceProps {
  theme: ThemeMode;
  dataSource?: string;
}

function ChartSource({ theme, dataSource = '故宫博物院官方数据' }: ChartSourceProps) {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-stone-500' : 'text-stone-400';
  const linkColor = isDark
    ? 'text-emerald-400 hover:text-emerald-300'
    : 'text-[#4a7c59] hover:text-[#3d6a4a]';

  return (
    <div
      className={`flex justify-between items-center text-[10px] ${textColor} mt-3 px-1 transition-colors duration-300`}
    >
      {/* 数据来源 */}
      <span className="flex items-center gap-1">
        <svg
          className="w-3 h-3 opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>数据来源：{dataSource}</span>
      </span>

      {/* Flourish 标识 */}
      <span className="flex items-center gap-1">
        <span className="opacity-60">Powered by</span>
        <a
          href="https://flourish.studio"
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkColor} transition-colors duration-200 font-medium`}
        >
          Flourish
        </a>
        <svg
          className="w-3 h-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </span>
    </div>
  );
}

export default memo(ChartSource);
