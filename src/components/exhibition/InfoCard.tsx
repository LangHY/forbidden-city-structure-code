/**
 * InfoCard - 右侧信息卡片
 *
 * 所有内容由 LLM 动态生成
 * 注重数据展示
 */

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import type { ThemeMode } from './types';
import type { StructureInfo } from './services/llmService';

interface InfoCardProps {
  structureInfo: StructureInfo | null;
  theme?: ThemeMode;
  isLoading?: boolean;
  isBlurred?: boolean;
}

// 逐字浮现组件
function AnimatedText({
  text,
  className,
  animationKey
}: {
  text: string;
  className?: string;
  animationKey: number;
}) {
  return (
    <span className={className} key={animationKey}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="animate-char-float"
          style={{
            animationDelay: `${index * 0.02}s`,
            opacity: 0,
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// 数据标签组件
function DataLabel({
  label,
  value,
  theme,
  animationKey,
}: {
  label: string;
  value: string;
  theme: 'light' | 'dark';
  animationKey: number;
}) {
  const labelColor = theme === 'dark' ? 'text-emerald-400/60' : 'text-[#4a7c59]/60';
  const valueColor = theme === 'dark' ? 'text-stone-200' : 'text-[#2e3230]';

  return (
    <div className="flex flex-col gap-1">
      <span className={`text-[10px] ${labelColor} uppercase tracking-widest`}>
        <AnimatedText text={label} animationKey={animationKey} />
      </span>
      <span className={`text-sm font-serif ${valueColor}`}>
        <AnimatedText text={value} animationKey={animationKey} />
      </span>
    </div>
  );
}

// 构件卡片组件 - 科技感风格（紧凑版）
function ComponentCard({
  name,
  nameEn,
  material,
  function: func,
  theme,
  animationKey,
  index = 0,
}: {
  name: string;
  nameEn: string;
  material: string;
  function: string;
  theme: 'light' | 'dark';
  animationKey: number;
  index?: number;
}) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`group relative p-3 rounded-lg backdrop-blur-sm transition-all duration-300 ${
        isDark
          ? 'bg-white/[0.03] hover:bg-white/[0.06]'
          : 'bg-white/60 hover:bg-white/80'
      }`}
      style={{
        border: isDark
          ? '1px solid rgba(255,255,255,0.08)'
          : '1px solid rgba(74,124,89,0.12)',
        boxShadow: isDark
          ? 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
          : 'inset 0 1px 0 0 rgba(255,255,255,0.5)',
      }}
    >
      {/* 顶部发光线条 */}
      <div
        className={`absolute top-0 left-3 right-3 h-px ${
          isDark
            ? 'bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent'
            : 'bg-gradient-to-r from-transparent via-[#4a7c59]/30 to-transparent'
        }`}
      />

      {/* 构件名称区 - 单行 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {/* 序号指示器 */}
          <div
            className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono ${
              isDark
                ? 'bg-emerald-400/10 text-emerald-400'
                : 'bg-[#4a7c59]/10 text-[#4a7c59]'
            }`}
          >
            {index + 1}
          </div>
          <h4 className={`text-sm font-medium ${
            isDark ? 'text-white' : 'text-[#2e3230]'
          }`}>
            <AnimatedText text={name} animationKey={animationKey} />
          </h4>
        </div>
        <span className={`text-[10px] font-mono ${
          isDark ? 'text-emerald-400/50' : 'text-[#4a7c59]/50'
        }`}>
          <AnimatedText text={nameEn} animationKey={animationKey} />
        </span>
      </div>

      {/* 数据条 - 单行 */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className={`material-symbols-outlined text-xs ${
            isDark ? 'text-emerald-400/50' : 'text-[#4a7c59]/50'
          }`} style={{ fontSize: '12px' }}>layers</span>
          <span className={isDark ? 'text-white/60' : 'text-black/60'}>
            <AnimatedText text={material} animationKey={animationKey} />
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`material-symbols-outlined text-xs ${
            isDark ? 'text-emerald-400/50' : 'text-[#4a7c59]/50'
          }`} style={{ fontSize: '12px' }}>settings</span>
          <span className={isDark ? 'text-white/60' : 'text-black/60'}>
            <AnimatedText text={func} animationKey={animationKey} />
          </span>
        </div>
      </div>
    </div>
  );
}

const CARD_WIDTH = 420;
const PEEK_WIDTH = 96;
const HIDDEN_TRANSLATE_X = CARD_WIDTH - PEEK_WIDTH;
const HIDDEN_ROTATE_Y = -35;
const PUSH_THRESHOLD = 200;
const PULL_THRESHOLD = 80;
const NAV_HEIGHT = 64; // 导航栏高度

function InfoCard({
  structureInfo,
  theme = 'light',
  isLoading = false,
  isBlurred = false,
}: InfoCardProps) {
  const [isHidden, setIsHidden] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animType, setAnimType] = useState<'in' | 'out' | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const dragStartXRef = useRef(0);
  const isDark = theme === 'dark';

  // 数据更新时触发动画
  const prevDataRef = useRef(structureInfo);
  useEffect(() => {
    if (structureInfo && prevDataRef.current !== structureInfo) {
      setAnimationKey(prev => prev + 1);
    }
    prevDataRef.current = structureInfo;
  }, [structureInfo]);

  // 拖拽逻辑
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isAnimating) return;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
  }, [isAnimating]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragStartXRef.current;
      if (isHidden) {
        const pullX = Math.min(0, Math.max(-PEEK_WIDTH, deltaX));
        setDragOffset(pullX);
        if (deltaX < -PULL_THRESHOLD) {
          setIsDragging(false);
          setDragOffset(0);
          setAnimType('in');
          setIsAnimating(true);
        }
      } else {
        const pushX = Math.max(0, deltaX);
        setDragOffset(pushX);
        if (deltaX > PUSH_THRESHOLD) {
          setIsDragging(false);
          setDragOffset(0);
          setAnimType('out');
          setIsAnimating(true);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragOffset(0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isHidden]);

  const handleTransitionEnd = useCallback(() => {
    if (isAnimating) {
      if (animType === 'out') setIsHidden(true);
      else if (animType === 'in') setIsHidden(false);
      setIsAnimating(false);
      setAnimType(null);
    }
  }, [isAnimating, animType]);

  const handleFlyIn = useCallback(() => {
    if (isHidden && !isAnimating) {
      setAnimType('in');
      setIsAnimating(true);
    }
  }, [isHidden, isAnimating]);

  const handleFlyOut = useCallback(() => {
    if (!isHidden && !isAnimating) {
      setAnimType('out');
      setIsAnimating(true);
    }
  }, [isHidden, isAnimating]);

  // 样式
  const glassClass = isDark ? 'glass-panel-enhanced-dark' : 'glass-panel-enhanced';
  const titleColor = isDark ? 'text-stone-100' : 'text-[#2e3230]';
  const subtitleColor = isDark ? 'text-emerald-400/70' : 'text-[#4a7c59]/70';
  const descColor = isDark ? 'text-stone-300' : 'text-[#4a4e4a]';
  const dividerColor = isDark ? 'bg-emerald-400/30' : 'bg-[#4a7c59]/30';
  const tabBg = isDark ? 'bg-white/15 hover:bg-white/25' : 'bg-[#4a7c59]/20 hover:bg-[#4a7c59]/35';

  const getTranslateX = () => {
    if (isAnimating) return animType === 'out' ? HIDDEN_TRANSLATE_X : 0;
    if (isDragging) return (isHidden ? HIDDEN_TRANSLATE_X : 0) + dragOffset;
    return isHidden ? HIDDEN_TRANSLATE_X : 0;
  };

  const getRotateY = () => {
    if (isAnimating) return animType === 'out' ? HIDDEN_ROTATE_Y : 0;
    if (isDragging) {
      if (isHidden) return HIDDEN_ROTATE_Y + (Math.abs(dragOffset) / PEEK_WIDTH) * Math.abs(HIDDEN_ROTATE_Y);
      return -dragOffset * 0.1;
    }
    return isHidden ? HIDDEN_ROTATE_Y : 0;
  };

  return (
    <section
      className={`fixed z-30 w-[420px] ${isDark ? '' : ''}`}
      style={{
        right: '48px',
        top: `${NAV_HEIGHT + 16}px`, // 导航栏下方 16px
        bottom: '80px', // 底部留空间
        maxHeight: 'calc(100vh - 160px)', // 最大高度限制
        filter: isBlurred ? 'blur(12px)' : undefined,
        opacity: isBlurred ? 0.5 : 1,
        transition: 'filter 0.4s ease-out, opacity 0.4s ease-out',
      }}
    >
      <div
        style={{
          transform: `perspective(1000px) translateX(${getTranslateX()}px) rotateY(${getRotateY()}deg)`,
          transformOrigin: 'right center',
          transition: isDragging ? 'none' : 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* 小竖条 */}
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 ${tabBg} w-1.5 h-16 rounded-l-md cursor-pointer transition-all duration-200 hover:w-2 hover:h-20`}
          onClick={(e) => {
            e.stopPropagation();
            isHidden ? handleFlyIn() : handleFlyOut();
          }}
        />

        {/* 卡片内容 */}
        <div className={`${glassClass} p-5 rounded-2xl select-none overflow-y-auto ${isDark ? 'border-l border-t border-white/10 shadow-2xl' : 'border-white/40 shadow-xl'}`} style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <div className="w-8 h-8 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              <span className={`text-lg font-serif ${titleColor}`}>Thinking...</span>
            </div>
          ) : structureInfo ? (
            <div className="flex flex-col gap-3">
              {/* 标题区域 */}
              <div className="space-y-1">
                <h1 className={`text-xl font-serif ${titleColor} tracking-widest leading-tight`}>
                  <AnimatedText text={structureInfo.title} animationKey={animationKey} />
                </h1>
                <p className={`text-xs font-serif ${subtitleColor}`}>
                  <AnimatedText text={structureInfo.subtitle} animationKey={animationKey} />
                </p>
              </div>

              <div className={`w-full h-px ${dividerColor}`} />

              {/* 描述 */}
              <p className={`text-xs leading-relaxed ${descColor}`}>
                <AnimatedText text={structureInfo.description} animationKey={animationKey} />
              </p>

              {/* 技术参数 - 数据网格 */}
              <div className="grid grid-cols-2 gap-2">
                <DataLabel label="年代" value={structureInfo.technicalParams.era} theme={theme} animationKey={animationKey} />
                <DataLabel label="风格" value={structureInfo.technicalParams.style} theme={theme} animationKey={animationKey} />
                <DataLabel label="承重" value={structureInfo.technicalParams.loadBearing} theme={theme} animationKey={animationKey} />
                <DataLabel label="复杂度" value={structureInfo.technicalParams.complexity} theme={theme} animationKey={animationKey} />
              </div>

              <div className={`w-full h-px ${dividerColor}`} />

              {/* 构件列表 */}
              <div className="space-y-2">
                <span className={`text-[10px] ${isDark ? 'text-emerald-400/60' : 'text-[#4a7c59]/60'} uppercase tracking-widest`}>
                  <AnimatedText text="核心构件" animationKey={animationKey} />
                </span>
                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1">
                  {structureInfo.components.map((comp, idx) => (
                    <ComponentCard
                      key={idx}
                      {...comp}
                      theme={theme}
                      animationKey={animationKey}
                      index={idx}
                    />
                  ))}
                </div>
              </div>

              {/* 历史背景 */}
              <div className={`p-3 rounded-lg ${isDark ? 'bg-white/5' : 'bg-black/3'}`}>
                <span className={`text-[10px] ${isDark ? 'text-emerald-400/60' : 'text-[#4a7c59]/60'} uppercase tracking-widest block mb-1`}>
                  <AnimatedText text="历史背景" animationKey={animationKey} />
                </span>
                <p className={`text-xs ${descColor} leading-relaxed`}>
                  <AnimatedText text={structureInfo.historicalContext} animationKey={animationKey} />
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default memo(InfoCard);
