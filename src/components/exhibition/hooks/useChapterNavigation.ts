/**
 * useChapterNavigation - 章节导航 Hook
 *
 * 管理章节切换、滚轮控制、动画方向等
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { chapters } from '../config';

// 动画时长（毫秒）
const ANIMATION_DURATION = 500;

export interface ChapterNavigationState {
  /** 当前活动章节 ID */
  activeChapter: string;
  /** 滑动方向 */
  slideDirection: 'up' | 'down' | null;
  /** 是否正在动画中 */
  isAnimating: boolean;
}

export interface ChapterNavigationActions {
  /** 切换到下一个章节（向下） */
  goNext: () => boolean;
  /** 切换到上一个章节（向上） */
  goPrev: () => boolean;
  /** 直接切换到指定章节 */
  goToChapter: (chapterId: string) => void;
  /** 设置活动章节（无动画） */
  setActiveChapter: (chapterId: string) => void;
}

export type UseChapterNavigationReturn = ChapterNavigationState & ChapterNavigationActions;

/**
 * 章节导航 Hook
 *
 * @example
 * ```tsx
 * const {
 *   activeChapter,
 *   slideDirection,
 *   goNext,
 *   goPrev,
 *   goToChapter,
 * } = useChapterNavigation();
 *
 * // 滚轮控制已自动绑定
 * return <ChapterNav activeId={activeChapter} onChange={goToChapter} />;
 * ```
 */
export function useChapterNavigation(): UseChapterNavigationReturn {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);

  // 动画锁 - 使用 ref 避免重新渲染
  const isAnimating = useRef(false);

  // 内部切换章节方法（带动画方向）
  const switchChapter = useCallback((direction: 'up' | 'down') => {
    if (isAnimating.current) return false;

    const currentIndex = chapters.findIndex(c => c.id === activeChapter);
    let newIndex: number;

    if (direction === 'down' && currentIndex < chapters.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return false; // 边界，不切换
    }

    // 开始动画
    isAnimating.current = true;
    setSlideDirection(direction);
    setActiveChapter(chapters[newIndex].id);

    // 动画结束后解锁
    setTimeout(() => {
      isAnimating.current = false;
      setSlideDirection(null);
    }, ANIMATION_DURATION);

    return true;
  }, [activeChapter]);

  // 向下切换
  const goNext = useCallback(() => switchChapter('down'), [switchChapter]);

  // 向上切换
  const goPrev = useCallback(() => switchChapter('up'), [switchChapter]);

  // 直接切换到指定章节
  const goToChapter = useCallback((newChapterId: string) => {
    if (isAnimating.current || newChapterId === activeChapter) return;

    const currentIndex = chapters.findIndex(c => c.id === activeChapter);
    const newIndex = chapters.findIndex(c => c.id === newChapterId);

    if (newIndex === -1) return;

    // 根据索引位置决定滑动方向
    const direction = newIndex > currentIndex ? 'down' : 'up';

    // 开始动画
    isAnimating.current = true;
    setSlideDirection(direction);
    setActiveChapter(newChapterId);

    // 动画结束后解锁
    setTimeout(() => {
      isAnimating.current = false;
      setSlideDirection(null);
    }, ANIMATION_DURATION);
  }, [activeChapter]);

  // 滚轮事件处理 - 使用节流
  useEffect(() => {
    let lastTime = 0;
    const throttleMs = ANIMATION_DURATION + 50;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      if (now - lastTime < throttleMs) return;

      if (e.deltaY > 0) {
        if (switchChapter('down')) {
          lastTime = now;
        }
      } else if (e.deltaY < 0) {
        if (switchChapter('up')) {
          lastTime = now;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [switchChapter]);

  return {
    activeChapter,
    slideDirection,
    isAnimating: isAnimating.current,
    goNext,
    goPrev,
    goToChapter,
    setActiveChapter,
  };
}
