/**
 * useBootAnimation - MacBook 风格开机加载动画 Hook
 *
 * 管理加载进度、加载状态、Logo 显示等
 */

import { useState, useEffect, useCallback } from 'react';

// 加载进度增量速度（每 50ms 增加的进度）
const LOADING_SPEED = 2;

export interface BootAnimationState {
  /** 当前加载进度 (0-100) */
  bootProgress: number;
  /** 是否正在加载 */
  isBooting: boolean;
  /** 是否显示导航栏 Logo */
  showNavLogo: boolean;
}

export interface BootAnimationActions {
  /** 加载动画完成回调 */
  handleBootComplete: () => void;
  /** 手动设置进度 */
  setBootProgress: (value: number) => void;
}

export type UseBootAnimationReturn = BootAnimationState & BootAnimationActions;

/**
 * 开机加载动画 Hook
 *
 * @example
 * ```tsx
 * const {
 *   bootProgress,
 *   isBooting,
 *   showNavLogo,
 *   handleBootComplete,
 * } = useBootAnimation();
 *
 * return (
 *   <BootLoader
 *     progress={bootProgress}
 *     isLoading={isBooting}
 *     onComplete={handleBootComplete}
 *   />
 * );
 * ```
 */
export function useBootAnimation(): UseBootAnimationReturn {
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  // 加载进度模拟 - 在实际内容加载时逐渐增加
  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootProgress(prev => {
        // 最高只到 90%，剩余 10% 等待真实内容加载完成
        if (prev >= 90) return prev;
        // 随机增量，模拟真实加载
        const increment = Math.random() * LOADING_SPEED + 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isBooting]);

  // 加载动画完成回调
  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setShowNavLogo(true);
  }, []);

  return {
    bootProgress,
    isBooting,
    showNavLogo,
    handleBootComplete,
    setBootProgress,
  };
}
