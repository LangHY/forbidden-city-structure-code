/**
 * BottomControls - 底部控件栏
 *
 * 包含文物来源、观察模式切换、缩放/重置控件
 */

import { memo } from 'react';
import type { BottomControlsProps, ThemeMode } from './types';

interface ExtendedBottomControlsProps extends BottomControlsProps {
  theme?: ThemeMode;
  isBlurred?: boolean;
  showZoom?: boolean;
}

/**
 * 拼装图标 SVG
 * 斗拱榫卯结构抽象
 */
function AssemblyIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 上层横栱 */}
      <rect x="6" y="2" width="12" height="4" rx="1" />
      {/* 中层十字交叉 */}
      <rect x="2" y="9" width="20" height="4" rx="1" />
      {/* 下层横栱 */}
      <rect x="6" y="16" width="12" height="4" rx="1" />
      {/* 立柱连接 */}
      <line x1="12" y1="6" x2="12" y2="9" />
      <line x1="12" y1="13" x2="12" y2="16" />
    </svg>
  );
}

/**
 * 放大图标 SVG
 * 放大镜 + 加号
 */
function ZoomInIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 放大镜圆圈 */}
      <circle cx="11" cy="11" r="7" />
      {/* 手柄 */}
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      {/* 加号 */}
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

/**
 * 重置图标 SVG
 * 循环箭头
 */
function ResetIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* 主弧线 */}
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      {/* 箭头 */}
      <path d="M3 3v5h5" />
    </svg>
  );
}

function BottomControls({
  artifactOrigin,
  artifactOriginEn,
  onZoom,
  onReset,
  onExplodeToggle,
  isExploded = false,
  onStartGame,
  theme = 'light',
  isBlurred = false,
  showZoom = true,
  className = '',
}: ExtendedBottomControlsProps) {
  const isDark = theme === 'dark';

  // 暗色模式使用更高的对比度
  const panelBorder = isDark ? 'border-white/10' : 'border-white/20';
  const glassClass = isDark ? 'glass-panel-dark' : 'glass-panel';
  const labelColor = isDark ? 'text-emerald-400/70' : 'text-[#4a7c59]/60';
  const textColor = isDark ? 'text-stone-100' : 'text-[#2e3230]';
  const btnColor = isDark ? 'text-stone-300 hover:text-emerald-400' : 'text-[#74796e] hover:text-[#4a7c59]';

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full px-12 py-8 flex justify-between items-end pointer-events-none ${className}`}
      style={{
        filter: isBlurred ? 'blur(12px)' : undefined,
        opacity: isBlurred ? 0.5 : 1,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
      {/* 文物来源 */}
      <div className={`${glassClass} px-6 py-4 rounded-xl flex flex-col gap-1 pointer-events-auto ${panelBorder}`}>
        <span className={`text-[10px] ${labelColor} tracking-[0.3em] uppercase`}>
          Artifact Origin
        </span>
        <span className={`${textColor} font-serif tracking-widest`}>
          {artifactOrigin} ({artifactOriginEn})
        </span>
      </div>

      {/* 缩放控件 */}
      <div className="flex gap-6 pointer-events-auto">
        {onStartGame && (
          <button
            onClick={onStartGame}
            className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
            aria-label="开始拼装"
            title="开始拼装"
          >
            <AssemblyIcon className="w-4 h-4" />
          </button>
        )}
        {showZoom && (
          <button
            onClick={onZoom}
            className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
            aria-label="放大"
          >
            <ZoomInIcon className="w-4 h-4" />
          </button>
        )}
        {onExplodeToggle && (
          <button
            onClick={onExplodeToggle}
            className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
            aria-label={isExploded ? '合并' : '爆炸图'}
            aria-pressed={isExploded}
            title={isExploded ? '合并' : '爆炸图'}
          >
            <span className="material-symbols-outlined text-base">
              {isExploded ? 'compress' : 'burst_mode'}
            </span>
          </button>
        )}
        <button
          onClick={onReset}
          className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
          aria-label="重置视角"
        >
          <ResetIcon className="w-4 h-4" />
        </button>
      </div>
    </footer>
  );
}

export default memo(BottomControls);
