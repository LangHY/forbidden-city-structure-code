/**
 * NarrativeAnchor - 叙事锚点
 *
 * 左下角的标题和描述文字（LLM 生成）
 * 标题使用高斯模糊效果，描述使用流式输出
 * 支持亮/暗主题
 *
 * dark: 暗色主题（白色标题）
 * light: 亮色主题（黑色标题）
 */

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import type { OpeningTheme } from './types';
import { generateDescription } from './services/llmService';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface NarrativeAnchorProps {
  theme?: OpeningTheme;
}

function NarrativeAnchor({ theme = 'dark' }: NarrativeAnchorProps) {
  // dark = 暗色主题，light = 亮色主题
  const isDark = theme === 'dark';

  const titleColor = isDark ? 'text-primary' : 'text-stone-900';
  const descColor = isDark ? 'text-secondary-fixed-dim/80' : 'text-stone-600';

  // 滚动进度
  const { progress } = useScrollProgressContext();

  // 状态
  const [title, setTitle] = useState<string>('');
  const [titleLoaded, setTitleLoaded] = useState(false);
  const [displayedDesc, setDisplayedDesc] = useState<string>('');
  const streamingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 流式输出描述文字
  const streamDescription = useCallback((text: string) => {
    // 清除之前的定时器
    if (streamingRef.current) {
      clearInterval(streamingRef.current);
    }

    setDisplayedDesc('');
    let index = 0;

    streamingRef.current = setInterval(() => {
      if (index < text.length) {
        setDisplayedDesc(text.slice(0, index + 1));
        index++;
      } else {
        if (streamingRef.current) {
          clearInterval(streamingRef.current);
        }
      }
    }, 50); // 每 50ms 输出一个字符
  }, []);

  // 加载描述
  const loadDescription = useCallback(async () => {
    // 标题模糊消失
    setTitleLoaded(false);
    setDisplayedDesc('');

    // 等待模糊动画
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 生成新描述（强制不使用缓存）
    const data = await generateDescription(true);
    setTitle(data.title);

    // 触发标题清晰动画
    setTimeout(() => setTitleLoaded(true), 100);

    // 流式输出描述
    setTimeout(() => streamDescription(data.description), 500);
  }, [streamDescription]);

  // 初始化和定时更新
  useEffect(() => {
    // 首次加载
    loadDescription();

    // 每 10 秒更新一次
    const interval = setInterval(loadDescription, 10000);

    return () => {
      if (streamingRef.current) {
        clearInterval(streamingRef.current);
      }
      clearInterval(interval);
    };
  }, [loadDescription]);

  // 淡出动画 (progress > 0.5 时开始)
  const fadeProgress = Math.max(0, (progress - 0.5) * 2);
  const opacity = 1 - fadeProgress;

  return (
    <div
      className="absolute bottom-32 left-12 max-w-sm"
      style={{
        opacity,
        transform: `translateY(${-progress * 150}px)`,
        willChange: 'opacity, transform',
      }}
    >
      {/* 标题 - 高斯模糊效果 */}
      <h2 className={`font-serif text-3xl mb-4 tracking-widest ${titleColor} ${titleLoaded ? 'desc-title-loaded' : 'desc-title-loading'}`}>
        {title}
      </h2>
      {/* 描述 - 流式输出 */}
      <p className={`font-serif text-sm leading-relaxed tracking-wide ${descColor}`}>
        {displayedDesc}
      </p>
    </div>
  );
}

export default memo(NarrativeAnchor);
