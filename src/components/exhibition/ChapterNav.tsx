/**
 * ChapterNav - 左侧章节导航
 *
 * 老虎机滚动动画：
 * - 切换时平滑滚动
 * - 选中项居中且最大
 * - 其他项根据距离缩小
 *
 * 英雄镜头模式：
 * - 点击菜单时放大并移动到页面左侧三分之一
 * - 索引项沿弧形曲线排列
 * - 滚动切换时有流畅的弧形滑动动画
 */

import { memo, useMemo } from 'react';
import type { ChapterNavProps, ThemeMode } from './types';

interface ExtendedChapterNavProps extends ChapterNavProps {
  theme?: ThemeMode;
  isHighlighted?: boolean;
}

// 每个项目的高度
const NORMAL_ITEM_HEIGHT = 48;
const HERO_ITEM_HEIGHT = 60;

function ChapterNav({
  chapters,
  activeId,
  onChange,
  theme = 'light',
  isHighlighted = false,
  className = '',
}: ExtendedChapterNavProps) {
  const isDark = theme === 'dark';

  // 找到当前激活项的索引
  const activeIndex = chapters.findIndex(c => c.id === activeId);

  // 高亮模式下使用更大的项高
  const itemHeight = isHighlighted ? HERO_ITEM_HEIGHT : NORMAL_ITEM_HEIGHT;

  // 颜色 - 暗色模式使用更高对比度
  const activeDot = isDark ? 'bg-emerald-400' : 'bg-[#4a7c59]';
  const activeText = isDark ? 'text-emerald-300' : 'text-[#4a7c59]';
  const inactiveDot = isDark ? 'bg-stone-500/50' : 'bg-[#74796e]/30';
  const inactiveText = isDark ? 'text-stone-300/80' : 'text-[#4a4e4a]/60';

  // 计算每个项的样式 - 使用 useMemo 优化
  const getItemStyle = useMemo(() => {
    return (index: number) => {
      const distance = index - activeIndex;
      const absDistance = Math.abs(distance);

      // 缩放 - 英雄模式下中心更大
      const scale = isHighlighted
        ? Math.max(0.55, 1.15 - absDistance * 0.1)
        : Math.max(0.5, 1 - absDistance * 0.12);

      // 透明度 - 更平滑的渐变
      const opacity = isHighlighted
        ? Math.max(0.3, 1 - absDistance * 0.15)
        : Math.max(0.2, 1 - absDistance * 0.2);

      // 弧形效果：根据距离计算水平偏移和旋转
      let translateX = 0;
      let rotateZ = 0;
      let translateY = 0;
      let blur = 'none';
      let rotateX = 0;

      if (isHighlighted) {
        // 弧形半径和角度计算
        const arcRadius = 600; // 弧形半径（像素）
        const anglePerItem = 5; // 每项间隔角度（度）

        const angle = distance * anglePerItem * (Math.PI / 180);

        // 计算弧形上的位置
        translateX = arcRadius * (1 - Math.cos(angle));
        rotateZ = -distance * anglePerItem * 0.8;

        // 轻微的 Y 轴位移，增加滚动感
        translateY = distance * 3;

        // 3D 透视旋转 - 距离中心越远，倾斜越大
        rotateX = distance * 2;

        // 模糊效果 - 距离中心较远的项模糊
        if (absDistance > 3) {
          blur = `blur(${(absDistance - 3) * 1.5}px)`;
        }
      }

      return {
        scale,
        opacity,
        translateX,
        translateY,
        rotateZ,
        rotateX,
        blur,
      };
    };
  }, [activeIndex, isHighlighted]);

  // 容器偏移量：使选中项居中于视口中心
  const containerOffset = `calc(50vh - ${itemHeight / 2}px - ${activeIndex * itemHeight}px)`;

  // 英雄模式下的水平位移：移动到页面左侧三分之一
  const heroTranslateX = isHighlighted ? 'calc(33.33vw - 120px)' : '0';

  // 英雄模式下的整体缩放
  const containerScale = isHighlighted ? 1.15 : 1;

  return (
    <aside
      className={`fixed left-0 top-0 h-full pointer-events-none ${
        isHighlighted ? 'z-50 overflow-visible' : 'z-40 overflow-hidden'
      } ${className}`}
      style={{
        perspective: isHighlighted ? '1200px' : 'none',
      }}
    >
      <div
        className="flex flex-col pointer-events-auto group"
        style={{
          transform: `translateY(${containerOffset}) translateX(${heroTranslateX}) scale(${containerScale})`,
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
          paddingLeft: isHighlighted ? '0' : '48px',
          transformStyle: isHighlighted ? 'preserve-3d' : 'flat',
        }}
      >
        {chapters.map((chapter, index) => {
          const isActive = chapter.id === activeId;
          const { scale, opacity, translateX, translateY, rotateZ, rotateX, blur } = getItemStyle(index);

          return (
            <div
              key={chapter.id}
              className="flex items-center gap-4 cursor-pointer origin-center"
              style={{
                transform: `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateX(${rotateX}deg) scale(${scale})`,
                opacity,
                height: `${itemHeight}px`,
                filter: blur,
                transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease, filter 0.35s ease',
              }}
              onClick={() => onChange?.(chapter.id)}
            >
              {/* 指示点 */}
              <div
                className={`rounded-full transition-all duration-350 ${
                  isActive ? activeDot : inactiveDot
                }`}
                style={{
                  width: isActive ? '8px' : '4px',
                  height: isActive ? '8px' : '4px',
                  boxShadow: isActive && isHighlighted
                    ? (isDark ? '0 0 12px rgba(52, 211, 153, 0.5)' : '0 0 12px rgba(74, 124, 89, 0.5)')
                    : 'none',
                }}
              />

              {/* 章节名称 */}
              <span
                className={`font-serif tracking-[0.2em] whitespace-nowrap transition-all duration-350
                  ${isActive ? 'font-semibold' : 'font-normal'}
                  ${isActive ? activeText : inactiveText}
                  ${isActive || isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}
                style={{
                  fontSize: isHighlighted
                    ? (isActive ? '1.6rem' : '1.1rem')
                    : (isActive ? '1.125rem' : '1rem'),
                  textShadow: isActive && isHighlighted
                    ? (isDark ? '0 0 20px rgba(52, 211, 153, 0.3)' : '0 0 20px rgba(74, 124, 89, 0.3)')
                    : 'none',
                }}
              >
                {chapter.label}
              </span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default memo(ChapterNav);
