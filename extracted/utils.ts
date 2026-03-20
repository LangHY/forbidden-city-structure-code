/**
 * ===========================================
 * 缓动函数 (Easing Functions)
 * ===========================================
 *
 * 从 opening.html 提取的缓动函数
 * 用于动画插值计算
 */

/**
 * 三次缓入缓出
 * - 开始慢，中间快，结束慢
 * - 适合大多数动画场景
 */
export const easeInOutCubic = (x: number): number => {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/**
 * 三次缓出
 * - 开始快，结束慢
 * - 适合元素进入场景
 */
export const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

/**
 * 三次缓入
 * - 开始慢，结束快
 * - 适合元素离开场景
 */
export const easeInCubic = (x: number): number => {
  return x * x * x;
};

/**
 * 二次缓入缓出 (用于wrapper移动)
 */
export const easeInOutQuad = (x: number): number => {
  return x < 0.5
    ? 2 * x * x
    : 1 - Math.pow(-2 * x + 2, 2) / 2;
};

/**
 * ===========================================
 * 打字机效果 (Typewriter Effect)
 * ===========================================
 */

/**
 * 逐字打印文本
 * @param text 要打印的文本
 * @param element 目标DOM元素
 * @param speed 每字间隔(毫秒)
 * @returns Promise，完成时resolve
 */
export const typeWriter = async (
  text: string,
  element: HTMLElement,
  speed: number = 100
): Promise<void> => {
  element.innerText = '';

  const chars = text.split('');
  for (let i = 0; i < chars.length; i++) {
    element.innerText += chars[i];
    // 随机化速度，增加真实感
    await new Promise(r => setTimeout(r, speed + Math.random() * 50));
  }
};

/**
 * ===========================================
 * 尺寸计算工具 (Size Calculation Utils)
 * ===========================================
 */

/**
 * 计算Cover-fit尺寸
 * 保持宽高比，填充整个容器，居中裁剪
 *
 * @param containerWidth 容器宽度
 * @param containerHeight 容器高度
 * @param contentWidth 内容宽度
 * @param contentHeight 内容高度
 * @returns 绘制参数 { dx, dy, dw, dh }
 */
export const calculateCoverFit = (
  containerWidth: number,
  containerHeight: number,
  contentWidth: number,
  contentHeight: number
): { dx: number; dy: number; dw: number; dh: number } => {
  const srcRatio = contentWidth / contentHeight;
  const containerRatio = containerWidth / containerHeight;

  let dw: number, dh: number, dx: number, dy: number;

  if (containerRatio > srcRatio) {
    // 容器更宽，以宽度为准
    dw = containerWidth;
    dh = containerWidth / srcRatio;
    dx = 0;
    dy = (containerHeight - dh) / 2;
  } else {
    // 容器更高，以高度为准
    dh = containerHeight;
    dw = containerHeight * srcRatio;
    dy = 0;
    dx = (containerWidth - dw) / 2;
  }

  return { dx, dy, dw, dh };
};

/**
 * ===========================================
 * 动画阶段计算 (Animation Phase Calculation)
 * ===========================================
 */

/**
 * 计算卡片分离动画各阶段的值
 *
 * 阶段划分：
 * - Phase 1 (0-0.2): 温和分离
 * - Phase 2 (0.2-0.45): 动态聚合 + 3D倾斜
 * - Phase 3 (0.45-0.7): 180度翻转
 * - Phase 4 (0.7-1.0): 优雅展开着陆
 */
export const calculateCardAnimationPhase = (progress: number): {
  phase: 1 | 2 | 3 | 4;
  localProgress: number;
} => {
  if (progress < 0.2) {
    return { phase: 1, localProgress: progress / 0.2 };
  } else if (progress < 0.45) {
    return { phase: 2, localProgress: (progress - 0.2) / 0.25 };
  } else if (progress < 0.7) {
    return { phase: 3, localProgress: (progress - 0.45) / 0.25 };
  } else {
    return { phase: 4, localProgress: (progress - 0.7) / 0.3 };
  }
};

/**
 * 计算卡片在特定进度下的变换参数
 */
export const calculateCardTransform = (
  progress: number,
  cardIndex: number, // 0, 1, 2
  viewportHeight: number
): {
  x: number;
  y: number;
  rotateZ: number;
  rotateY: number;
  scale: number;
  isFlipped: boolean;
} => {
  const { phase, localProgress } = calculateCardAnimationPhase(progress);
  const dir = cardIndex - 1; // -1 (左), 0 (中), 1 (右)

  let splitX = 0;
  let descendY = 0;
  let rotateZ = 0;
  let rotateY = 0;
  let scale = 1;
  let isFlipped = false;

  switch (phase) {
    case 1:
      splitX = 140 * easeOutCubic(localProgress);
      scale = 1 - (easeOutCubic(localProgress) * 0.05);
      break;

    case 2:
      splitX = 140 * (1 - easeInOutCubic(localProgress));
      descendY = easeInOutCubic(localProgress) * viewportHeight * 0.08;
      rotateZ = Math.sin(localProgress * Math.PI) * 12;
      rotateY = Math.sin(localProgress * Math.PI) * 15;
      scale = 0.95 - Math.sin(localProgress * Math.PI) * 0.05;
      break;

    case 3:
      splitX = 0;
      descendY = viewportHeight * 0.08 + (easeInOutCubic(localProgress) * viewportHeight * 0.05);
      rotateY = 180 * easeInOutCubic(localProgress);
      scale = 0.9 - Math.sin(localProgress * Math.PI) * 0.1;
      isFlipped = localProgress > 0.5;
      // 添加位置差异
      rotateY += dir * Math.sin(localProgress * Math.PI) * 15;
      break;

    case 4:
      const fanEase = easeOutCubic(localProgress);
      // 展开效果
      splitX = dir * (70 * fanEase);
      rotateZ = dir * (12 * fanEase);
      descendY = (viewportHeight * 0.13) * (1 - easeInOutCubic(localProgress));
      rotateY = 180;
      scale = 0.9 + (easeInOutCubic(localProgress) * 0.1);
      isFlipped = true;
      // Y偏移让卡片底部重叠，顶部展开
      descendY += Math.abs(dir) * 15 * fanEase;
      break;
  }

  return {
    x: dir * splitX,
    y: descendY,
    rotateZ,
    rotateY: rotateY + (progress < 0.45 ? dir * Math.sin(progress * Math.PI * 4) * 8 : 0),
    scale,
    isFlipped,
  };
};

/**
 * ===========================================
 * 滚动进度计算 (Scroll Progress Utils)
 * ===========================================
 */

/**
 * 计算视频帧索引
 * @param progress 滚动进度 (0-1)
 * @param totalFrames 总帧数
 * @returns 帧索引
 */
export const calculateFrameIndex = (
  progress: number,
  totalFrames: number
): number => {
  return Math.min(totalFrames - 1, Math.floor(progress * totalFrames));
};

/**
 * 计算UI淡出进度
 * 在前25%的滚动中淡出开场UI
 */
export const calculateUIFadeProgress = (scrollProgress: number): number => {
  if (scrollProgress < 0.25) {
    return scrollProgress / 0.25;
  }
  return 1; // 完全淡出
};
