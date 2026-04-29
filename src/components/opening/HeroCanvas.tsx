/**
 * HeroCanvas - 主画布区域
 *
 * 包含：
 * - 背景英雄文字（LLM 生成的诗句）
 * - 3D 内容容器（十字准星 + 图片）
 * - 叙事锚点
 * 支持亮/暗主题
 * 支持滚动淡出动画
 *
 * dark: 暗色主题（白色轮廓文字）
 * light: 亮色主题（黑色轮廓文字）
 */

import { memo, useState, useEffect } from 'react';
import Crosshair from './Crosshair';
import NarrativeAnchor from './NarrativeAnchor';
import type { OpeningTheme } from './types';
import { generatePoem, preloadOpeningContent, type PoemData } from './services/llmService';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface HeroCanvasProps {
  theme?: OpeningTheme;
}

function HeroCanvas({ theme = 'dark' }: HeroCanvasProps) {
  // dark = 暗色主题，light = 亮色主题
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-stone-800';

  // 诗句状态
  const [poem, setPoem] = useState<PoemData | null>(null);
  const [loaded, setLoaded] = useState(false);

  // 滚动进度
  const { progress } = useScrollProgressContext();

  // 淡出动画 (progress > 0.5 时开始)
  const fadeProgress = Math.max(0, (progress - 0.5) * 2);
  const contentOpacity = 1 - fadeProgress;

  // 初始化时生成诗句，并定时更新
  useEffect(() => {
    preloadOpeningContent();

    const loadPoem = async () => {
      // 先设置为加载状态（模糊消失）
      setLoaded(false);
      // 等待模糊消失动画完成（1s）
      await new Promise(resolve => setTimeout(resolve, 1000));
      // 生成新诗句（强制不使用缓存），在返回之前保持模糊状态
      const data = await generatePoem(true);
      setPoem(data);
      // 触发清晰动画
      setTimeout(() => setLoaded(true), 100);
    };

    // 首次加载 - 初始就保持模糊状态
    setLoaded(false);
    generatePoem(true).then((data) => {
      setPoem(data);
      setTimeout(() => setLoaded(true), 100);
    });

    // 每 10 秒更新一次
    const interval = setInterval(loadPoem, 10000);

    return () => clearInterval(interval);
  }, []);

  // 根据主题选择动画类
  const poemAnimClass = loaded
    ? (isDark ? 'poem-loaded' : 'poem-loaded-light')
    : 'poem-loading';

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center z-10">
      {/* Central Hero Text (Background Layer) - 分两侧显示 */}
      <div
        className="absolute inset-0 flex items-center justify-between pointer-events-none px-4 md:px-24"
        style={{
          opacity: contentOpacity,
          transform: `translateY(${-progress * 150}px)`,
          willChange: 'opacity, transform',
        }}
      >
        {/* 左侧文字 - 稍微上移 */}
        <h1 className={`font-quanHeng text-5xl md:text-7xl leading-relaxed tracking-[0.3em] select-none ${textColor} -translate-y-20 ${poemAnimClass}`}>
          {poem?.left || ''}
        </h1>
        {/* 右侧文字 - 稍微下移 */}
        <h1 className={`font-quanHeng text-5xl md:text-7xl leading-relaxed tracking-[0.3em] select-none ${textColor} translate-y-20 ${poemAnimClass}`}>
          {poem?.right || ''}
        </h1>
      </div>

      {/* 3D Content Placeholder (Central Focus) */}
      <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center z-10">
        {/* Crosshairs */}
        <Crosshair theme={theme} />
      </div>

      {/* Narrative Anchor (Asymmetric) */}
      <NarrativeAnchor theme={theme} />
    </main>
  );
}

export default memo(HeroCanvas);
