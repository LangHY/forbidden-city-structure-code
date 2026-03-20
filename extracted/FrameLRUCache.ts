/**
 * ===========================================
 * 视频帧缓存管理器 (Frame LRU Cache)
 * ===========================================
 *
 * 从 opening.html 提取的 FrameLRUCache 类
 *
 * 核心思想：
 * 1. LRU (Least Recently Used) 算法 - 自动淘汰最久未使用的帧
 * 2. 保护机制 - 当前播放位置 ±20% 范围内的帧不会被释放
 * 3. 内存控制 - 限制缓存帧数上限，防止内存溢出
 * 4. 统计功能 - 记录缓存命中率，便于性能分析
 */

import type { FrameData, CacheStats } from './types';

export class FrameLRUCache {
  private maxSize: number;
  private cache: Map<number, FrameData>;
  private accessOrder: number[];

  private hits: number = 0;
  private misses: number = 0;
  private currentPlayPosition: number = 0;
  private protectRange: number = 0.2;
  private _totalFrames: number = 0;

  constructor(maxSize: number = 60) {
    this.maxSize = maxSize;
    this.cache = new Map();
    this.accessOrder = [];
  }

  /**
   * 获取缓存的帧
   */
  get(frameIndex: number): FrameData | null {
    if (this.cache.has(frameIndex)) {
      this.hits++;
      this.updateAccessOrder(frameIndex);
      return this.cache.get(frameIndex)!;
    }
    this.misses++;
    return null;
  }

  /**
   * 设置缓存帧
   */
  set(frameIndex: number, frameData: FrameData): void {
    if (this.cache.has(frameIndex)) {
      this.cache.set(frameIndex, frameData);
      this.updateAccessOrder(frameIndex);
      return;
    }

    if (this.cache.size >= this.maxSize) {
      this.evict();
    }

    this.cache.set(frameIndex, frameData);
    this.accessOrder.push(frameIndex);
  }

  /**
   * 释放指定帧
   */
  release(frameIndex: number): boolean {
    if (!this.cache.has(frameIndex)) return false;

    const frameData = this.cache.get(frameIndex)!;
    this.disposeCanvas(frameData);

    this.cache.delete(frameIndex);
    const orderIdx = this.accessOrder.indexOf(frameIndex);
    if (orderIdx > -1) {
      this.accessOrder.splice(orderIdx, 1);
    }

    return true;
  }

  /**
   * 检查帧是否存在
   */
  has(frameIndex: number): boolean {
    return this.cache.has(frameIndex);
  }

  /**
   * 更新访问顺序
   */
  private updateAccessOrder(frameIndex: number): void {
    const idx = this.accessOrder.indexOf(frameIndex);
    if (idx > -1) {
      this.accessOrder.splice(idx, 1);
      this.accessOrder.push(frameIndex);
    }
  }

  /**
   * 释放Canvas/ImageBitmap资源
   */
  private disposeCanvas(frameData: FrameData): void {
    if (!frameData) return;

    if (frameData.type === 'bitmap' && frameData.data) {
      const bitmap = frameData.data as ImageBitmap;
      if (typeof bitmap.close === 'function') {
        bitmap.close();
      }
    } else if (frameData.type === 'canvas' && frameData.data) {
      const canvas = frameData.data as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.width = 0;
      canvas.height = 0;
    } else if (frameData.type === 'offscreen' && frameData.data) {
      const offscreen = frameData.data as OffscreenCanvas;
      offscreen.width = 0;
      offscreen.height = 0;
    }
  }

  /**
   * 检查是否在保护范围内
   */
  private isInProtectRange(frameIndex: number, totalFrames: number): boolean {
    if (totalFrames <= 0) return false;

    const protectStart = Math.floor(this.currentPlayPosition * totalFrames * (1 - this.protectRange));
    const protectEnd = Math.ceil(this.currentPlayPosition * totalFrames * (1 + this.protectRange));

    return frameIndex >= protectStart && frameIndex <= protectEnd;
  }

  /**
   * 淘汰最久未使用的帧
   */
  private evict(): boolean {
    const totalFrames = this.accessOrder.length > 0
      ? Math.max(...this.accessOrder) + 1
      : 0;

    // 优先淘汰保护范围外的帧
    for (let i = 0; i < this.accessOrder.length; i++) {
      const oldestIdx = this.accessOrder[i];

      if (!this.isInProtectRange(oldestIdx, totalFrames)) {
        this.release(oldestIdx);
        return true;
      }
    }

    // 如果都在保护范围内，强制淘汰最旧的
    if (this.accessOrder.length > 0) {
      const oldestIdx = this.accessOrder[0];
      this.release(oldestIdx);
      return true;
    }

    return false;
  }

  /**
   * 设置当前播放位置（用于保护范围计算）
   */
  setCurrentPosition(progress: number, totalFrames: number): void {
    this.currentPlayPosition = progress;
    this._totalFrames = totalFrames;
  }

  /**
   * 获取缓存统计信息
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total * 100).toFixed(2) + '%' : '0%',
      protectedRange: `${Math.round(this.protectRange * 200)}%`,
    };
  }

  /**
   * 清空缓存
   */
  clear(): void {
    for (const [_, frameData] of this.cache) {
      this.disposeCanvas(frameData);
    }
    this.cache.clear();
    this.accessOrder = [];
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * 获取缓存大小
   */
  get size(): number {
    return this.cache.size;
  }
}
