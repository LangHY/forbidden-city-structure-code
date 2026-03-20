/**
 * ===========================================
 * 视频帧播放系统类型定义
 * ===========================================
 *
 * 从 opening.html FrameLoader/FrameLRUCache 提取的类型
 */

/**
 * 帧数据类型
 * - bitmap: ImageBitmap (性能最优)
 * - canvas: 传统Canvas
 * - offscreen: OffscreenCanvas
 */
export type FrameDataType = 'bitmap' | 'canvas' | 'offscreen';

/**
 * 帧数据结构
 */
export interface FrameData {
  type: FrameDataType;
  data: ImageBitmap | HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
}

/**
 * FrameLoader 状态
 */
export type FrameLoaderState = 'idle' | 'loading' | 'ready' | 'error';

/**
 * 加载进度信息
 */
export interface LoadProgressInfo {
  phase: 'metadata' | 'keyframes' | 'idle';
  current?: number;
  total?: number;
  totalFrames?: number;
}

/**
 * LRU缓存统计
 */
export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: string;
  protectedRange: string;
}

/**
 * 加载进度详情
 */
export interface LoadingProgress {
  loaded: number;
  total: number;
  percentage: number;
  keyFramesLoaded: boolean;
  allFramesLoaded: boolean;
  cacheStats: CacheStats;
}

/**
 * FrameLoader 配置选项
 */
export interface FrameLoaderOptions {
  targetFps?: number;
  keyFrameInterval?: number;
  maxCacheSize?: number;
  onProgress?: (info: LoadProgressInfo) => void;
  onFrameReady?: (idx: number, frame: FrameData) => void;
  onError?: (error: Error) => void;
  onKeyFramesReady?: () => void;
  onAllFramesReady?: () => void;
}

/**
 * ===========================================
 * 卡片动画状态类型
 * ===========================================
 */

export type CardPhase = 1 | 2 | 3 | 4;

export interface CardTransform {
  x: number;
  y: number;
  rotateZ: number;
  rotateY: number;
  scale: number;
  isFlipped: boolean;
}

export interface CardAnimationState {
  phase: CardPhase;
  localProgress: number;
  transform: CardTransform;
  isSplitting: boolean;
  isLanded: boolean;
}

/**
 * ===========================================
 * 滚动状态类型
 * ===========================================
 */

export interface ScrollState {
  scrollY: number;
  progress: number;
  direction: 'up' | 'down' | null;
  velocity: number;
}

/**
 * ===========================================
 * 开场动画状态类型
 * ===========================================
 */

export interface OpeningAnimationState {
  isLoading: boolean;
  progress: number;
  isVideoReady: boolean;
  isDegraded: boolean;
  currentQuote: string;
  phase: 'loading' | 'burst' | 'fadein' | 'complete';
}

/**
 * ===========================================
 * API响应类型
 * ===========================================
 */

export interface MuseResponse {
  quote: string;
}

export interface APIError {
  code: number;
  message: string;
}
