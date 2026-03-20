/**
 * ===========================================
 * API服务 (API Service)
 * ===========================================
 *
 * 从 opening.html 提取的 API 调用逻辑
 * 用于获取AI生成的诗句
 */

import type { MuseResponse } from './types';

/**
 * API配置
 */
export const apiConfig = {
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
  model: 'glm-4',
  timeout: 10000,
  systemPrompt: '生成一句关于故宫或中国古建筑的唯美诗句，中文，20字以内。不要解析，直接返回JSON: {quote:\'诗句内容\'}',
};

/**
 * 获取诗句
 *
 * @param apiKey - API密钥（可选，为空则返回默认诗句）
 * @returns MuseResponse
 */
export const getMuse = async (apiKey: string = ''): Promise<MuseResponse> => {
  // 无API密钥时返回默认诗句
  if (!apiKey) {
    return { quote: '红墙宫里万重门，太和殿上紫云深。' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

    const response = await fetch(apiConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: [
          { role: 'system', content: apiConfig.systemPrompt }
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response content');
    }

    // 解析JSON响应
    const cleanedContent = content.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanedContent);

    return { quote: parsed.quote || '琉璃瓦上凝宿雨，金水河畔映残阳。' };

  } catch (error) {
    console.warn('[API] Failed to get muse:', error);
    // 降级返回默认诗句
    return { quote: '雕梁画栋千秋意，玉砌雕栏万古情。' };
  }
};

/**
 * ===========================================
 * 降级处理 (Fallback Handler)
 * ===========================================
 */

/**
 * 视频降级到静态图片
 */
export const fallbackToStaticImage = (
  elements: {
    frameCanvas: HTMLCanvasElement;
    staticBg: HTMLImageElement | null;
  },
  reason: string
): void => {
  console.warn(`[Video Fallback] ${reason}. Switching to static image.`);

  const { frameCanvas, staticBg } = elements;

  frameCanvas.style.display = 'none';

  if (staticBg) {
    staticBg.style.display = 'block';
    staticBg.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100vw;
      height: 100vh;
      object-fit: cover;
      z-index: 2;
      opacity: 0;
    `;
  }
};

/**
 * 检测视频加载错误类型
 */
export const getVideoErrorType = (error: MediaError | null): string => {
  if (!error) return 'Unknown error';

  const errorTypes: Record<number, string> = {
    1: 'MEDIA_ERR_ABORTED - 用户终止加载',
    2: 'MEDIA_ERR_NETWORK - 网络错误',
    3: 'MEDIA_ERR_DECODE - 解码错误',
    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持的格式',
  };

  return errorTypes[error.code] || `未知错误 (${error.code})`;
};

/**
 * 创建视频加载超时检测
 */
export const createVideoTimeout = (
  isReady: () => boolean,
  isDegraded: () => boolean,
  onTimeout: () => void,
  timeout: number = 10000
): { clear: () => void } => {
  const timeoutId = setTimeout(() => {
    if (!isReady() && !isDegraded()) {
      onTimeout();
    }
  }, timeout);

  return {
    clear: () => clearTimeout(timeoutId),
  };
};

/**
 * ===========================================
 * Canvas绘制工具 (Canvas Drawing Utils)
 * ===========================================
 */

import { calculateCoverFit } from './utils';
import type { FrameData } from './types';

/**
 * 绘制缓存帧到Canvas
 */
export const drawCachedFrame = (
  canvas: HTMLCanvasElement,
  frameData: FrameData
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const { dx, dy, dw, dh } = calculateCoverFit(
    canvas.width,
    canvas.height,
    frameData.width,
    frameData.height
  );

  if (frameData.type === 'bitmap') {
    const bitmap = frameData.data as ImageBitmap;

    // 检查是否支持 transferFromImageBitmap
    if ('transferFromImageBitmap' in ctx) {
      // 需要临时canvas转换
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = frameData.width;
      tempCanvas.height = frameData.height;
      const tempCtx = tempCanvas.getContext('bitmaprenderer') as ImageBitmapRenderingContext;
      tempCtx.transferFromImageBitmap(bitmap);
      ctx.drawImage(tempCanvas, dx, dy, dw, dh);
    } else {
      ctx.drawImage(bitmap, dx, dy, dw, dh);
    }
  } else {
    const src = frameData.data as CanvasImageSource;
    ctx.drawImage(src, dx, dy, dw, dh);
  }
};

/**
 * 调整Canvas尺寸
 */
export const resizeCanvas = (
  canvas: HTMLCanvasElement,
  frameLoader: { hasFrame: (idx: number) => boolean; getFrame: (idx: number) => FrameData | null },
  currentFrameIdx: number
): void => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 重绘当前帧
  if (frameLoader.hasFrame(currentFrameIdx)) {
    const frame = frameLoader.getFrame(currentFrameIdx);
    if (frame) {
      drawCachedFrame(canvas, frame);
    }
  }
};
