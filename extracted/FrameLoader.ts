/**
 * ===========================================
 * 渐进式帧加载器 (Frame Loader)
 * ===========================================
 *
 * 从 opening.html 提取的 FrameLoader 类
 *
 * 核心思想：
 * 1. 关键帧优先 - 先加载每秒1帧，确保视频可立即播放
 * 2. 按需加载 - 用户滚动时优先加载当前播放位置附近的帧
 * 3. 空闲后台提取 - 使用 requestIdleCallback 在浏览器空闲时提取剩余帧
 * 4. 保持原始分辨率 - 不做任何画质损失
 * 5. LRU 缓存管理 - 自动释放不活跃的帧，控制内存使用
 *
 * 反向播放逻辑：
 * idx=0 对应视频最后一帧（时间 t=duration）
 * idx=max 对应视频第一帧（时间 t=0）
 */

import { FrameLRUCache } from './FrameLRUCache';
import type { FrameData, FrameLoaderState, LoadProgressInfo, LoadingProgress, FrameLoaderOptions } from './types';

// 检测浏览器特性支持
const supportsOffscreenCanvas = typeof OffscreenCanvas !== 'undefined';
const supportsImageBitmap = typeof createImageBitmap === 'function';

export class FrameLoader {
  static STATE = {
    IDLE: 'idle' as FrameLoaderState,
    LOADING: 'loading' as FrameLoaderState,
    READY: 'ready' as FrameLoaderState,
    ERROR: 'error' as FrameLoaderState,
  };

  private video: HTMLVideoElement;
  private targetFps: number;
  private keyFrameInterval: number;
  private maxCacheSize: number;

  state: FrameLoaderState = FrameLoader.STATE.IDLE;
  frameCache: FrameLRUCache;
  totalFrames: number = 0;
  duration: number = 0;
  videoWidth: number = 0;
  videoHeight: number = 0;

  private keyFramesLoaded: boolean = false;
  private allFramesLoaded: boolean = false;
  private pendingFrameRequests: Map<number, Promise<FrameData>> = new Map();
  private idleCallbackId: number | null = null;
  private isExtractingIdle: boolean = false;
  private lastRequestedIdx: number = -1;
  private loadedFrameIndices: Set<number> = new Set();

  private onProgress: (info: LoadProgressInfo) => void;
  private onFrameReady: (idx: number, frame: FrameData) => void;
  private onError: (error: Error) => void;
  private onKeyFramesReady: () => void;
  private onAllFramesReady: () => void;

  constructor(videoElement: HTMLVideoElement, options: FrameLoaderOptions = {}) {
    this.video = videoElement;
    this.targetFps = options.targetFps || 20;
    this.keyFrameInterval = options.keyFrameInterval || 1;
    this.maxCacheSize = options.maxCacheSize || 60;

    this.frameCache = new FrameLRUCache(this.maxCacheSize);

    this.onProgress = options.onProgress || (() => {});
    this.onFrameReady = options.onFrameReady || (() => {});
    this.onError = options.onError || (() => {});
    this.onKeyFramesReady = options.onKeyFramesReady || (() => {});
    this.onAllFramesReady = options.onAllFramesReady || (() => {});
  }

  /**
   * 初始化加载器
   */
  async init(): Promise<void> {
    this.state = FrameLoader.STATE.LOADING;

    return new Promise((resolve, reject) => {
      const onMetadata = () => {
        this.duration = this.video.duration;
        this.totalFrames = Math.floor(this.duration * this.targetFps);
        this.videoWidth = this.video.videoWidth;
        this.videoHeight = this.video.videoHeight;

        this.onProgress({ phase: 'metadata', totalFrames: this.totalFrames });
        resolve();
      };

      const onError = (e: Event) => {
        this.state = FrameLoader.STATE.ERROR;
        this.onError(new Error('Video metadata load failed'));
        reject(e);
      };

      this.video.addEventListener('loadedmetadata', onMetadata, { once: true });
      this.video.addEventListener('error', onError, { once: true });
    });
  }

  /**
   * 加载关键帧
   */
  async loadKeyFrames(): Promise<void> {
    const keyFrameCount = Math.ceil(this.duration / this.keyFrameInterval);
    const keyFrameIndices: number[] = [];

    for (let i = 0; i < keyFrameCount; i++) {
      const t = i * this.keyFrameInterval;
      const idx = this.timeToFrameIndex(t);
      if (idx >= 0 && idx < this.totalFrames) {
        keyFrameIndices.push(idx);
      }
    }

    this.onProgress({ phase: 'keyframes', current: 0, total: keyFrameIndices.length });

    for (let i = 0; i < keyFrameIndices.length; i++) {
      const idx = keyFrameIndices[i];
      await this.extractFrame(idx);
      this.onProgress({
        phase: 'keyframes',
        current: i + 1,
        total: keyFrameIndices.length
      });
    }

    this.keyFramesLoaded = true;
    this.onKeyFramesReady();
  }

  /**
   * 时间转帧索引（反向）
   */
  timeToFrameIndex(time: number): number {
    const normalIdx = Math.floor(time * this.targetFps);
    return this.totalFrames - 1 - normalIdx;
  }

  /**
   * 帧索引转时间（反向）
   */
  frameIndexToTime(idx: number): number {
    const normalIdx = this.totalFrames - 1 - idx;
    return normalIdx / this.targetFps;
  }

  /**
   * 提取单帧
   */
  async extractFrame(idx: number): Promise<FrameData> {
    const cachedFrame = this.frameCache.get(idx);
    if (cachedFrame) {
      return cachedFrame;
    }

    if (this.pendingFrameRequests.has(idx)) {
      return this.pendingFrameRequests.get(idx)!;
    }

    const promise = new Promise<FrameData>(async (resolve) => {
      const time = this.frameIndexToTime(idx);
      const clampedTime = Math.max(0, Math.min(time, this.duration - 0.01));

      const onSeeked = async () => {
        let frameData: FrameData;

        if (supportsOffscreenCanvas) {
          const offscreen = new OffscreenCanvas(this.videoWidth, this.videoHeight);
          const ctx = offscreen.getContext('2d')!;
          ctx.drawImage(this.video, 0, 0);

          if (supportsImageBitmap) {
            try {
              const bitmap = await offscreen.transferToImageBitmap();
              frameData = { type: 'bitmap', data: bitmap, width: this.videoWidth, height: this.videoHeight };
            } catch (e) {
              frameData = { type: 'offscreen', data: offscreen, width: this.videoWidth, height: this.videoHeight };
            }
          } else {
            frameData = { type: 'offscreen', data: offscreen, width: this.videoWidth, height: this.videoHeight };
          }
        } else {
          const canvas = document.createElement('canvas');
          canvas.width = this.videoWidth;
          canvas.height = this.videoHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(this.video, 0, 0);
          frameData = { type: 'canvas', data: canvas, width: this.videoWidth, height: this.videoHeight };
        }

        this.frameCache.set(idx, frameData);
        this.loadedFrameIndices.add(idx);
        this.pendingFrameRequests.delete(idx);
        this.onFrameReady(idx, frameData);
        resolve(frameData);
      };

      this.video.addEventListener('seeked', onSeeked, { once: true });
      this.video.currentTime = clampedTime;
    });

    this.pendingFrameRequests.set(idx, promise);
    return promise;
  }

  /**
   * 获取缓存的帧
   */
  getFrame(idx: number): FrameData | null {
    if (idx < 0 || idx >= this.totalFrames) return null;
    return this.frameCache.get(idx);
  }

  /**
   * 检查帧是否存在
   */
  hasFrame(idx: number): boolean {
    return idx >= 0 && idx < this.totalFrames && this.frameCache.has(idx);
  }

  /**
   * 请求帧（按需加载）
   */
  async requestFrame(idx: number, progress: number = 0): Promise<FrameData | null> {
    this.lastRequestedIdx = idx;

    if (progress > 0) {
      this.frameCache.setCurrentPosition(progress, this.totalFrames);
    }

    if (this.hasFrame(idx)) {
      return this.frameCache.get(idx);
    }

    return this.extractFrame(idx);
  }

  /**
   * 请求附近的帧（预加载）
   */
  async requestNearbyFrames(centerIdx: number, range: number = 5): Promise<void> {
    const start = Math.max(0, centerIdx - range);
    const end = Math.min(this.totalFrames - 1, centerIdx + range);

    const promises: Promise<FrameData>[] = [];
    for (let i = start; i <= end; i++) {
      if (!this.hasFrame(i)) {
        promises.push(this.extractFrame(i));
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  /**
   * 启动空闲时提取
   */
  startIdleExtraction(): void {
    if (this.isExtractingIdle) return;
    this.isExtractingIdle = true;
    this.scheduleIdleExtraction();
  }

  /**
   * 调度空闲提取
   */
  private scheduleIdleExtraction(): void {
    if (!this.isExtractingIdle || this.allFramesLoaded) return;

    if (typeof requestIdleCallback !== 'undefined') {
      this.idleCallbackId = requestIdleCallback(async (deadline) => {
        await this.processIdleTime(deadline);
      }, { timeout: 100 });
    } else {
      setTimeout(async () => {
        await this.extractNextMissingFrame();
        this.scheduleIdleExtraction();
      }, 16);
    }
  }

  /**
   * 处理空闲时间
   */
  private async processIdleTime(deadline: IdleDeadline): Promise<void> {
    while (deadline.timeRemaining() > 4 && !this.allFramesLoaded) {
      const hasMore = await this.extractNextMissingFrame();
      if (!hasMore) break;
    }

    if (!this.allFramesLoaded) {
      this.scheduleIdleExtraction();
    }
  }

  /**
   * 提取下一个缺失帧
   */
  private async extractNextMissingFrame(): Promise<boolean> {
    const missingIdx = this.findNextMissingFrame();
    if (missingIdx === -1) {
      this.allFramesLoaded = true;
      this.state = FrameLoader.STATE.READY;
      this.onAllFramesReady();
      return false;
    }

    await this.extractFrame(missingIdx);
    this.onProgress({
      phase: 'idle',
      current: this.loadedFrameIndices.size,
      total: this.totalFrames
    });
    return true;
  }

  /**
   * 查找下一个缺失帧
   */
  private findNextMissingFrame(): number {
    // 优先加载当前位置附近的帧
    if (this.lastRequestedIdx >= 0) {
      for (let offset = 1; offset < this.totalFrames; offset++) {
        const before = this.lastRequestedIdx - offset;
        const after = this.lastRequestedIdx + offset;

        if (before >= 0 && !this.frameCache.has(before)) return before;
        if (after < this.totalFrames && !this.frameCache.has(after)) return after;
      }
    }

    // 最后按顺序查找
    for (let i = 0; i < this.totalFrames; i++) {
      if (!this.frameCache.has(i)) return i;
    }
    return -1;
  }

  /**
   * 停止空闲提取
   */
  stopIdleExtraction(): void {
    this.isExtractingIdle = false;
    if (this.idleCallbackId !== null && typeof cancelIdleCallback !== 'undefined') {
      cancelIdleCallback(this.idleCallbackId);
      this.idleCallbackId = null;
    }
  }

  /**
   * 获取加载进度
   */
  getLoadingProgress(): LoadingProgress {
    const loaded = this.loadedFrameIndices.size;
    return {
      loaded,
      total: this.totalFrames,
      percentage: (loaded / this.totalFrames) * 100,
      keyFramesLoaded: this.keyFramesLoaded,
      allFramesLoaded: this.allFramesLoaded,
      cacheStats: this.frameCache.getStats(),
    };
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return this.frameCache.getStats();
  }
}
