/**
 * ===========================================
 * 开场动画序列 (Opening Animation Sequence)
 * ===========================================
 *
 * 从 opening.html window.load 事件提取的动画逻辑
 * 使用 GSAP Timeline 编排
 */

import { gsap } from 'gsap';

/**
 * 开场动画配置
 */
export const openingAnimationConfig = {
  duration: 4,           // 总时长
  burstTime: 3.8,        // 闪光时间点
  fadeInDuration: 1.8,   // Canvas淡入时长
  whiteMaskDelay: 0.5,   // 白色遮罩延迟
  quoteDelay: 1.5,       // 诗句显示延迟
  aiPanelDelay: 2,       // AI按钮延迟
};

/**
 * 创建开场动画时间线
 *
 * @param elements - 所需DOM元素引用
 * @param options - 可选配置
 * @returns GSAP Timeline
 */
export const createOpeningTimeline = (
  elements: {
    progressNum: HTMLElement;
    loaderBar: HTMLElement;
    loader: HTMLElement;
    reel: HTMLElement;
    flash: HTMLElement;
    frameCanvas: HTMLElement;
    whiteMask: HTMLElement;
    waterfallWindow: HTMLElement;
    quoteContainer: HTMLElement;
    aiPanel: HTMLElement;
  },
  options: {
    imgH: number;
    gap: number;
    onBurst?: () => void;
  }
) => {
  const tl = gsap.timeline();
  const { burstTime } = openingAnimationConfig;
  const { imgH, gap } = options;

  // 计算瀑布流移动距离
  const totalMoveY = -(imgH + gap) * 4;

  // 1. 初始激活 - 数字淡入
  tl.to(elements.progressNum, {
    opacity: 0.8,
    duration: 1,
    ease: 'power2.out',
  });

  // 2. 进度条动画 (与计数器同步)
  tl.to(elements.loaderBar, {
    scaleX: 1,
    duration: 4,
    ease: 'power3.inOut',
  }, 0);

  // 3. 计数器动画 (0 -> 100)
  const counter = { val: 0 };
  tl.to(counter, {
    val: 100,
    duration: 4,
    ease: 'expo.inOut',
    onUpdate: () => {
      const n = Math.floor(counter.val);
      elements.progressNum.innerText = n.toString().padStart(2, '0');

      // Loader位移和变形
      const moveFactor = counter.val / 100;
      const totalY = window.innerHeight * 0.7;

      gsap.set(elements.loader, {
        y: totalY * moveFactor,
        scaleY: 1 + (Math.sin(moveFactor * Math.PI) * 0.2),
      });

      // 数字倾斜和模糊效果
      gsap.set(elements.progressNum, {
        skewX: -20 * Math.sin(moveFactor * Math.PI),
        filter: `blur(${Math.sin(moveFactor * Math.PI) * 3}px)`,
        opacity: 0.2 + (moveFactor * 0.6),
      });
    },
  }, 0);

  // 4. 瀑布流滚动
  tl.to(elements.reel, {
    y: totalMoveY,
    duration: 4,
    ease: 'expo.inOut',
  }, 0);

  // 5. 移除黑色占位块 (闪光前)
  tl.call(() => {
    const blackBlock = elements.reel.lastElementChild as HTMLElement;
    if (blackBlock) {
      blackBlock.style.display = 'none';
    }
  }, null, burstTime - 0.1);

  // 6. 闪光效果
  tl.to(elements.flash, {
    opacity: 1,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
  }, burstTime);

  // 7. Canvas淡入
  tl.to(elements.frameCanvas, {
    opacity: 1,
    duration: 1.8,
    ease: 'power4.out',
    onStart: () => {
      options.onBurst?.();
    },
  }, burstTime);

  // 8. 白色遮罩淡入
  tl.to(elements.whiteMask, {
    opacity: 1,
    duration: 2.5,
    ease: 'power2.out',
  }, burstTime + 0.5);

  // 9. 瀑布流窗口淡出
  tl.to(elements.waterfallWindow, {
    opacity: 0,
    duration: 1,
    ease: 'power2.in',
  }, burstTime);

  // 10. 加载器消失
  tl.to(elements.loader, {
    opacity: 0,
    scale: 0.8,
    filter: 'blur(20px)',
    duration: 0.8,
  }, burstTime);

  // 11. 诗句容器淡入
  tl.to(elements.quoteContainer, {
    opacity: 1,
    y: 0,
    duration: 2.5,
  }, burstTime + 1.5);

  // 12. AI按钮淡入
  tl.to(elements.aiPanel, {
    opacity: 1,
    duration: 2,
  }, burstTime + 2);

  return tl;
};

/**
 * 创建鼠标视差效果
 */
export const createMouseParallax = (
  elements: { uiLayer: HTMLElement },
  options: { intensity?: number; duration?: number } = {}
) => {
  const { intensity = 80, duration = 2.5 } = options;

  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5);
    const y = (e.clientY / window.innerHeight - 0.5);

    gsap.to(elements.uiLayer, {
      x: x * intensity,
      y: y * intensity,
      duration,
    });
  };

  window.addEventListener('mousemove', handleMouseMove);

  return () => window.removeEventListener('mousemove', handleMouseMove);
};

/**
 * ===========================================
 * 滚动驱动动画 (Scroll-Driven Animations)
 * ===========================================
 */

import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

/**
 * 创建视频帧滚动控制器
 */
export const createVideoScrollTrigger = (
  elements: {
    scrollDriver: HTMLElement;
    frameCanvas: HTMLElement;
    uiLayer: HTMLElement;
    aiPanel: HTMLElement;
    grain: HTMLElement;
  },
  options: {
    totalFrames: number;
    isVideoReady: boolean;
    isDegraded: boolean;
    onFrameChange?: (frameIndex: number) => void;
  }
) => {
  const { totalFrames, isVideoReady, isDegraded, onFrameChange } = options;

  return ScrollTrigger.create({
    trigger: elements.scrollDriver,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.15,
    onUpdate: (self) => {
      if (!isVideoReady && !isDegraded) return;

      const p = self.progress;

      // 帧索引计算
      const idx = Math.min(totalFrames - 1, Math.floor(p * totalFrames));
      onFrameChange?.(idx);

      // UI淡出 (前25%)
      if (p < 0.25) {
        const fadeP = p / 0.25;
        gsap.set(elements.uiLayer, { opacity: 1 - fadeP });
        gsap.set(elements.aiPanel, { opacity: 1 - fadeP });
        gsap.set(elements.grain, { opacity: 0.04 * (1 - fadeP) });
      } else {
        gsap.set(elements.uiLayer, { opacity: 0 });
        gsap.set(elements.aiPanel, { opacity: 0 });
        gsap.set(elements.grain, { opacity: 0 });
      }
    },
  });
};

/**
 * 创建白色遮罩淡出动画
 */
export const createWhiteMaskFade = (
  whiteMask: HTMLElement,
  scrollDriver: HTMLElement
) => {
  return gsap.to(whiteMask, {
    opacity: 0,
    ease: 'power2.inOut',
    scrollTrigger: {
      trigger: scrollDriver,
      start: 'top top',
      end: '25% top',
      scrub: 1.5,
    },
  });
};

/**
 * 创建Dashboard出现动画
 */
export const createDashboardAppearTrigger = (
  elements: {
    scrollDriver: HTMLElement;
    dashSection: HTMLElement;
    pokerCardsWrapper: HTMLElement;
    frameCanvas: HTMLElement;
  },
  options: {
    isDegraded: boolean;
    staticBg?: HTMLElement | null;
  }
) => {
  return ScrollTrigger.create({
    trigger: elements.scrollDriver,
    start: 'bottom 150%',
    end: 'bottom 100%',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;

      // Dashboard透明度
      elements.dashSection.style.opacity = String(p);

      // 背景模糊
      if (options.isDegraded && options.staticBg) {
        gsap.set(options.staticBg, { filter: `blur(${p * 8}px)`, force3D: true });
      } else {
        gsap.set(elements.frameCanvas, { filter: `blur(${p * 8}px)`, force3D: true });
      }

      // 激活状态
      if (p > 0.1) {
        elements.dashSection.classList.add('active');
      } else {
        elements.dashSection.classList.remove('active');
      }

      // 卡片动画
      gsap.set(elements.pokerCardsWrapper, {
        opacity: p,
        y: 100 * (1 - p),
        scale: 0.9 + p * 0.1,
        force3D: true,
      });
    },
  });
};

/**
 * 创建卡片分离动画
 */
export const createCardSplitTrigger = (
  elements: {
    destinationPage: HTMLElement;
    pokerCardsWrapper: HTMLElement;
    pokerCards: NodeListOf<HTMLElement>;
    destinationContainer: HTMLElement;
  },
  options: {
    onPhaseChange?: (phase: number) => void;
  }
) => {
  const { pokerCardsWrapper, pokerCards, destinationPage, destinationContainer } = elements;

  return ScrollTrigger.create({
    trigger: destinationPage,
    start: 'top bottom',
    end: 'center center',
    scrub: 1,
    onUpdate: (self) => {
      const p = self.progress;
      const wH = window.innerHeight;

      // 动画参数计算
      let splitX = 0, descendY = 0, cardRotateZ = 0, cardRotateY = 0, cardScale = 1;

      // 缓动函数
      const easeInOutCubic = (x: number) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
      const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);

      if (p < 0.2) {
        // Phase 1: 分离
        const localP = p / 0.2;
        const easeP = easeOutCubic(localP);
        splitX = 140 * easeP;
        cardScale = 1 - (easeP * 0.05);
        pokerCardsWrapper.classList.add('splitting');

      } else if (p < 0.45) {
        // Phase 2: 聚合 + 3D倾斜
        const localP = (p - 0.2) / 0.25;
        const easeP = easeInOutCubic(localP);
        splitX = 140 * (1 - easeP);
        descendY = easeP * wH * 0.08;
        cardRotateZ = Math.sin(localP * Math.PI) * 12;
        cardRotateY = Math.sin(localP * Math.PI) * 15;
        cardScale = 0.95 - Math.sin(localP * Math.PI) * 0.05;

      } else if (p < 0.7) {
        // Phase 3: 180度翻转
        const localP = (p - 0.45) / 0.25;
        const easeP = easeInOutCubic(localP);
        splitX = 0;
        descendY = wH * 0.08 + (easeP * wH * 0.05);
        cardRotateY = 180 * easeP;
        cardScale = 0.9 - Math.sin(localP * Math.PI) * 0.1;

        if (localP > 0.5) {
          pokerCards.forEach(card => card.classList.add('flipped'));
        } else {
          pokerCards.forEach(card => card.classList.remove('flipped'));
        }

      } else {
        // Phase 4: 展开着陆
        const localP = (p - 0.7) / 0.3;
        const easeP = easeInOutCubic(localP);
        const fanEase = easeOutCubic(localP);

        splitX = 0;
        descendY = (wH * 0.13) * (1 - easeP);
        cardRotateY = 180;
        cardScale = 0.9 + (easeP * 0.1);
      }

      // 应用到每张卡片
      pokerCards.forEach((card, i) => {
        const dir = i - 1;
        let finalX = dir * splitX;
        let finalY = descendY;
        let finalRotateZ = cardRotateZ;
        let finalRotateY = cardRotateY;

        // Phase 4: 展开效果
        if (p >= 0.7) {
          const fanP = (p - 0.7) / 0.3;
          const fanEase = easeOutCubic(fanP);
          finalX = dir * (70 * fanEase);
          finalRotateZ = dir * (12 * fanEase);
          finalY = descendY + Math.abs(dir) * 15 * fanEase;
          gsap.set(card, { transformOrigin: 'bottom center' });
        } else {
          gsap.set(card, { transformOrigin: 'center center' });
        }

        // Phase 3: 翻转时添加位置差异
        if (p >= 0.45 && p < 0.7) {
          const flipP = (p - 0.45) / 0.25;
          finalRotateY += dir * Math.sin(flipP * Math.PI) * 15;
        }

        gsap.set(card, {
          x: finalX,
          y: finalY,
          rotationZ: finalRotateZ,
          rotationY: finalRotateY + dir * (p < 0.45 ? Math.sin(p * Math.PI * 4) * 8 : 0),
          scale: cardScale,
          zIndex: i === 1 ? 10 : i + 5,
          force3D: true,
        });
      });

      // Wrapper移动
      const wrapperEase = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      gsap.set(pokerCardsWrapper, { y: wrapperEase * wH, force3D: true });

      // Splitting类切换
      if (p > 0.1 && p < 0.7) {
        pokerCardsWrapper.classList.add('splitting');
      } else {
        pokerCardsWrapper.classList.remove('splitting');
      }

      // Destination显示
      if (p > 0.5) {
        destinationPage.classList.add('visible');
      } else {
        destinationPage.classList.remove('visible');
      }
      gsap.set(destinationContainer, {
        opacity: Math.max(0, (p - 0.4) / 0.6),
        y: 20 * (1 - p),
        force3D: true,
      });

      options.onPhaseChange?.(p);
    },
    onEnter: () => pokerCardsWrapper.classList.add('landed'),
    onLeaveBack: () => {
      pokerCardsWrapper.classList.remove('landed');
      pokerCards.forEach(card => card.classList.remove('flipped'));
    },
  });
};
