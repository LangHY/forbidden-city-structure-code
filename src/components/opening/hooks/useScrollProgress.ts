/**
 * useScrollProgress - 滚动进度 Hook
 *
 * 返回当前滚动进度 (0 ~ 1) 和原始 scrollY。
 * 固定参考高度 200vh，不随页面总高度变化。
 */

import { useState, useEffect, useCallback } from 'react';

export function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, scrollY: 0 });

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const refHeight = window.innerHeight * 2;
    const progress = Math.min(1, Math.max(0, scrollY / refHeight));
    setState({ progress, scrollY });
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return state;
}
