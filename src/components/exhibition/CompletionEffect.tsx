/**
 * CompletionEffect - 通关祝贺动画
 *
 * 全部构件归位后显示光晕 + 文字
 * 2 秒后自动消失
 */

import { useEffect, useState, memo } from 'react';
import type { ThemeMode } from './types';

interface CompletionEffectProps {
  visible: boolean;
  theme: ThemeMode;
  onComplete: () => void;
}

function CompletionEffect({ visible, theme, onComplete }: CompletionEffectProps) {
  const [show, setShow] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    if (visible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        // 等淡出动画结束后回调
        setTimeout(onComplete, 500);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [visible, onComplete]);

  if (!visible && !show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      style={{
        opacity: show ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      {/* 光晕背景 */}
      <div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(74,124,89,0.3) 0%, transparent 70%)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      {/* 文字 */}
      <div className="relative text-center">
        <p
          className={`text-3xl font-serif tracking-[0.5em] ${
            isDark ? 'text-emerald-400' : 'text-[#4a7c59]'
          }`}
          style={{
            animation: 'scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          拼装完成！
        </p>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default memo(CompletionEffect);
