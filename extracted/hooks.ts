/**
 * ===========================================
 * React Hooks 接口设计
 * ===========================================
 *
 * 为后续React组件迁移准备的Hooks接口定义
 * 包含状态管理和副作用逻辑
 */

import type {
  FrameData,
  FrameLoaderState,
  LoadingProgress,
  CardAnimationState,
  ScrollState,
  OpeningAnimationState,
} from './types';

/**
 * ===========================================
 * useFrameLoader Hook接口
 * ===========================================
 */
export interface UseFrameLoaderOptions {
  videoSrc: string;
  targetFps?: number;
  maxCacheSize?: number;
  onProgress?: (info: LoadingProgress) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
}

export interface UseFrameLoaderReturn {
  // 状态
  state: FrameLoaderState;
  totalFrames: number;
  currentFrame: number;
  isLoading: boolean;
  isReady: boolean;

  // 方法
  requestFrame: (idx: number, progress?: number) => Promise<FrameData | null>;
  requestNearbyFrames: (centerIdx: number, range?: number) => Promise<void>;
  hasFrame: (idx: number) => boolean;
  getLoadingProgress: () => LoadingProgress;
}

/**
 * ===========================================
 * useVideoScroll Hook接口
 * ===========================================
 */
export interface UseVideoScrollOptions {
  totalFrames: number;
  enabled?: boolean;
  onFrameChange?: (frameIndex: number, progress: number) => void;
}

export interface UseVideoScrollReturn {
  scrollProgress: number;
  currentFrameIndex: number;
  scrollDirection: 'up' | 'down' | null;
}

/**
 * ===========================================
 * useCardAnimation Hook接口
 * ===========================================
 */
export interface UseCardAnimationOptions {
  enabled?: boolean;
  viewportHeight?: number;
}

export interface UseCardAnimationReturn {
  // 三张卡片的状态
  cards: [CardAnimationState, CardAnimationState, CardAnimationState];

  // Wrapper状态
  wrapperState: {
    isSplitting: boolean;
    isLanded: boolean;
    y: number;
  };

  // Destination状态
  destinationState: {
    isVisible: boolean;
    opacity: number;
  };
}

/**
 * ===========================================
 * useOpeningAnimation Hook接口
 * ===========================================
 */
export interface UseOpeningAnimationOptions {
  autoStart?: boolean;
  duration?: number;
  onComplete?: () => void;
}

export interface UseOpeningAnimationReturn {
  state: OpeningAnimationState;

  // 控制方法
  start: () => void;
  pause: () => void;
  resume: () => void;

  // 元素引用
  refs: {
    progressNum: React.RefObject<HTMLElement>;
    loaderBar: React.RefObject<HTMLElement>;
    loader: React.RefObject<HTMLElement>;
    reel: React.RefObject<HTMLElement>;
    flash: React.RefObject<HTMLElement>;
    frameCanvas: React.RefObject<HTMLCanvasElement>;
  };
}

/**
 * ===========================================
 * useMuse Hook接口
 * ===========================================
 */
export interface UseMuseOptions {
  apiKey?: string;
  autoLoad?: boolean;
}

export interface UseMuseReturn {
  quote: string;
  isLoading: boolean;
  error: Error | null;

  // 方法
  regenerate: () => Promise<void>;
}

/**
 * ===========================================
 * useMouseParallax Hook接口
 * ===========================================
 */
export interface UseMouseParallaxOptions {
  intensity?: number;
  duration?: number;
  enabled?: boolean;
}

export interface UseMouseParallaxReturn {
  mousePosition: { x: number; y: number };
  offset: { x: number; y: number };
}

/**
 * ===========================================
 * useScrollHint Hook接口
 * ===========================================
 */
export interface UseScrollHintOptions {
  hideAfterScroll?: number; // 滚动多少px后隐藏
}

export interface UseScrollHintReturn {
  isVisible: boolean;
  hide: () => void;
}

/**
 * ===========================================
 * useCanvasRenderer Hook接口
 * ===========================================
 */
export interface UseCanvasRendererOptions {
  frameLoader: UseFrameLoaderReturn;
  scrollProgress: number;
  totalFrames: number;
}

export interface UseCanvasRendererReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentFrameIndex: number;
  isBuffering: boolean;
}

/**
 * ===========================================
 * useVideoFallback Hook接口
 * ===========================================
 */
export interface UseVideoFallbackOptions {
  timeout?: number;
  onError?: (reason: string) => void;
}

export interface UseVideoFallbackReturn {
  isDegraded: boolean;
  fallbackReason: string | null;
  triggerFallback: (reason: string) => void;
}

/**
 * ===========================================
 * 复合状态接口 (Combined State)
 * ===========================================
 */
export interface AppState {
  // 开场动画状态
  opening: OpeningAnimationState;

  // 视频帧加载状态
  video: {
    isReady: boolean;
    isDegraded: boolean;
    totalFrames: number;
    currentFrame: number;
    loadProgress: LoadingProgress | null;
  };

  // 滚动状态
  scroll: ScrollState;

  // 卡片动画状态
  cards: CardAnimationState[];

  // UI状态
  ui: {
    isNavbarVisible: boolean;
    isScrollHintVisible: boolean;
    quote: string;
  };
}

/**
 * ===========================================
 * Context接口
 * ===========================================
 */
export interface AppContextValue {
  state: AppState;

  // Actions
  actions: {
    startOpeningAnimation: () => void;
    enableScrollMode: () => void;
    regenerateQuote: () => Promise<void>;
    triggerVideoFallback: (reason: string) => void;
  };
}
