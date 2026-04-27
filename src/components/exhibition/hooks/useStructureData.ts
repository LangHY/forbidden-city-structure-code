/**
 * useStructureData - 结构数据加载 Hook
 *
 * 管理 LLM 生成的结构信息、加载状态、缓存等
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { chapters } from '../config';
import {
  generateStructureInfo,
  preloadAdjacentStructures,
  structureCache,
  type StructureInfo,
} from '../services/llmService';

export interface StructureDataState {
  /** 当前结构信息 */
  structureInfo: StructureInfo | null;
  /** 是否正在加载 */
  isLoading: boolean;
  /** 首次加载是否完成 */
  isFirstLoadComplete: boolean;
}

export interface StructureDataActions {
  /** 刷新当前结构数据 */
  refresh: () => void;
  /** 手动设置结构信息 */
  setStructureInfo: (info: StructureInfo | null) => void;
}

export type UseStructureDataReturn = StructureDataState & StructureDataActions & {
  /** 设置首次加载完成回调（用于通知 Boot 动画） */
  onFirstLoadComplete?: () => void;
};

/**
 * 结构数据加载 Hook
 *
 * @param activeChapter 当前活动章节 ID
 * @param onFirstLoadComplete 首次加载完成回调（可选）
 *
 * @example
 * ```tsx
 * const { structureInfo, isLoading, isFirstLoadComplete } = useStructureData(
 *   activeChapter,
 *   () => {
 *     setBootProgress(100);
 *   }
 * );
 *
 * return <InfoCard structureInfo={structureInfo} isLoading={isLoading} />;
 * ```
 */
export function useStructureData(
  activeChapter: string,
  onFirstLoadComplete?: () => void
): UseStructureDataReturn {
  const [structureInfo, setStructureInfo] = useState<StructureInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoadComplete, setIsFirstLoadComplete] = useState(false);

  // 防止重复调用回调
  const hasCalledCallback = useRef(false);

  // 获取当前章节名称
  const getChapterName = useCallback((chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter?.label || '斗拱结构';
  }, []);

  // 首次加载 - 获取第一个章节的数据
  useEffect(() => {
    if (hasCalledCallback.current) return;

    const chapterName = chapters[0]?.label || '斗拱结构';

    generateStructureInfo(chapterName).then(result => {
      structureCache[chapters[0].id] = result;
      setStructureInfo(result);
      setIsFirstLoadComplete(true);
      hasCalledCallback.current = true;
      onFirstLoadComplete?.();
    }).catch(() => {
      // 即使失败也继续，使用默认数据
      setIsFirstLoadComplete(true);
      hasCalledCallback.current = true;
      onFirstLoadComplete?.();
    });
  }, [onFirstLoadComplete]);

  // 切换章节时生成结构信息（仅在首次加载完成后执行）
  useEffect(() => {
    // 跳过首次加载（由上面的 useEffect 处理）
    if (!isFirstLoadComplete) return;

    const chapterName = getChapterName(activeChapter);

    // 检查缓存
    if (structureCache[activeChapter]) {
      setStructureInfo(structureCache[activeChapter]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    generateStructureInfo(chapterName).then(result => {
      structureCache[activeChapter] = result;
      setStructureInfo(result);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [activeChapter, getChapterName, isFirstLoadComplete]);

  // 刷新当前数据
  const refresh = useCallback(() => {
    const chapterName = getChapterName(activeChapter);
    setIsLoading(true);

    generateStructureInfo(chapterName).then(result => {
      structureCache[activeChapter] = result;
      setStructureInfo(result);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [activeChapter, getChapterName]);

  return {
    structureInfo,
    isLoading,
    isFirstLoadComplete,
    refresh,
    setStructureInfo,
  };
}

/**
 * 预加载相邻章节结构信息
 *
 * @param activeChapter 当前章节 ID
 */
export function usePreloadAdjacent(activeChapter: string) {
  useEffect(() => {
    preloadAdjacentStructures(activeChapter, chapters);
  }, [activeChapter]);
}