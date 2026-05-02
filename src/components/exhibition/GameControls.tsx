/**
 * GameControls - 游戏模式底部控件
 *
 * 展览模式：显示「开始拼装」按钮
 * 游戏中：显示进度 + 重置 + 退出按钮
 * 通关时：隐藏（由 CompletionEffect 接管）
 */

import { memo } from 'react';
import type { GameMode, ThemeMode } from './types';

interface GameControlsProps {
  gameMode: GameMode;
  theme: ThemeMode;
  isBlurred?: boolean;
  placedCount: number;
  totalCount: number;
  onStart: () => void;
  onReset: () => void;
  onExit: () => void;
}

function GameControls({
  gameMode,
  theme,
  isBlurred = false,
  placedCount,
  totalCount,
  onStart,
  onReset,
  onExit,
}: GameControlsProps) {
  const isDark = theme === 'dark';
  const glassClass = isDark ? 'glass-panel-dark' : 'glass-panel';
  const btnColor = isDark
    ? 'text-stone-300 hover:text-emerald-400'
    : 'text-[#74796e] hover:text-[#4a7c59]';
  const textColor = isDark ? 'text-stone-100' : 'text-[#2e3230]';
  const labelColor = isDark ? 'text-emerald-400/70' : 'text-[#4a7c59]/60';

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full px-12 py-8 flex justify-between items-center pointer-events-none ${isBlurred ? 'opacity-50' : ''}`}
      style={{
        filter: isBlurred ? 'blur(12px)' : undefined,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
      {/* 左侧：进度或占位 */}
      <div className="pointer-events-auto">
        {gameMode === 'playing' && (
          <div className={`${glassClass} px-6 py-4 rounded-xl`}>
            <span className={`text-[10px] ${labelColor} tracking-[0.3em] uppercase`}>
              Progress
            </span>
            <div className={`${textColor} font-serif tracking-widest text-lg`}>
              {placedCount} / {totalCount}
            </div>
          </div>
        )}
      </div>

      {/* 右侧：按钮 */}
      <div className="flex gap-4 pointer-events-auto">
        {gameMode === 'exhibit' && (
          <button
            onClick={onStart}
            className={`px-6 py-3 rounded-full ${glassClass} ${btnColor} font-serif tracking-widest transition-all duration-300 hover:scale-105 active:scale-95`}
          >
            开始拼装
          </button>
        )}
        {gameMode === 'playing' && (
          <>
            <button
              onClick={onReset}
              className={`w-10 h-10 rounded-full ${glassClass} flex items-center justify-center ${btnColor} transition-all duration-300 hover:scale-110 active:scale-95`}
              aria-label="重置"
              title="重新散开"
            >
              <span className="material-symbols-outlined text-base">refresh</span>
            </button>
            <button
              onClick={onExit}
              className={`px-6 py-3 rounded-full ${glassClass} ${btnColor} font-serif tracking-widest transition-all duration-300 hover:scale-105 active:scale-95`}
            >
              退出
            </button>
          </>
        )}
      </div>
    </footer>
  );
}

export default memo(GameControls);
