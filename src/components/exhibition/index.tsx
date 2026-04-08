/**
 * Exhibition - 展览页面主组件
 *
 * 组合所有子组件，实现斗拱结构展示页面
 * 集成 LLM 生成结构描述
 * 支持滚轮切换章节
 * MacBook 风格开机加载动画
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { memo } from 'react';
import ExhibitionCanvas, { useCameraControl, preloadAdjacentModels } from './ExhibitionCanvas';
import ExhibitionNav from './ExhibitionNav';
import ChapterNav from './ChapterNav';
import InfoCard from './InfoCard';
import BottomControls from './BottomControls';
import DecorativeChar from './DecorativeChar';
import BootLoader from './BootLoader';
import {
  chapters,
  artifactInfo,
  decorativeChars,
  decorativeChar,
} from './config';
import { generateStructureInfo, type StructureInfo, preloadAdjacentStructures, structureCache } from './services/llmService';
import type { ThemeMode } from './types';

// 动画时长（毫秒）
const ANIMATION_DURATION = 500;
// 加载进度增量速度
const LOADING_SPEED = 2; // 每 50ms 增加的进度

function Exhibition() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [structureInfo, setStructureInfo] = useState<StructureInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'up' | 'down' | null>(null);

  // MacBook 风格加载状态
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [isFirstLoadComplete, setIsFirstLoadComplete] = useState(false);
  const [showNavLogo, setShowNavLogo] = useState(false); // 导航栏 Logo 是否显示

  // 滚动控制 - 使用简单的节流
  const isAnimating = useRef(false);

  // 相机控制
  const cameraActions = useCameraControl();

  // ========================================
  // MacBook 风格加载动画逻辑
  // ========================================

  // 加载进度模拟 - 在实际内容加载时逐渐增加
  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootProgress(prev => {
        // 最高只到 90%，剩余 10% 等待真实内容加载完成
        if (prev >= 90) return prev;
        // 随机增量，模拟真实加载
        const increment = Math.random() * LOADING_SPEED + 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isBooting]);

  // 首次加载 - 等待 LLM 生成完成
  useEffect(() => {
    const chapterName = chapters[0]?.label || '斗拱结构';

    generateStructureInfo(chapterName).then(result => {
      structureCache[chapters[0].id] = result;
      setStructureInfo(result);

      // 加载完成，进度条冲刺到 100%
      setBootProgress(100);
      setIsFirstLoadComplete(true);
    }).catch(() => {
      // 即使失败也显示默认内容
      setBootProgress(100);
      setIsFirstLoadComplete(true);
    });
  }, []);

  // 加载动画完成回调
  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setShowNavLogo(true); // 显示导航栏 Logo
    // 预加载相邻模型和数据
    preloadAdjacentModels(activeChapter);
    preloadAdjacentStructures(activeChapter, chapters);
  }, [activeChapter]);

  // Logo 开始飞行的回调（不再需要，但保留接口）
  const handleLogoFlyStart = useCallback(() => {
    // Logo 开始飞行
  }, []);

  // 切换章节（带动画方向）
  const switchChapter = useCallback((direction: 'up' | 'down') => {
    if (isAnimating.current) return false;

    const currentIndex = chapters.findIndex(c => c.id === activeChapter);
    let newIndex: number;

    if (direction === 'down' && currentIndex < chapters.length - 1) {
      newIndex = currentIndex + 1;
    } else if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else {
      return false; // 边界，不切换
    }

    // 开始动画
    isAnimating.current = true;
    setSlideDirection(direction);
    setActiveChapter(chapters[newIndex].id);

    // 预加载下一批相邻模型和 LLM 数据
    preloadAdjacentModels(chapters[newIndex].id);
    preloadAdjacentStructures(chapters[newIndex].id, chapters);

    // 动画结束后解锁
    setTimeout(() => {
      isAnimating.current = false;
      setSlideDirection(null);
    }, ANIMATION_DURATION);

    return true;
  }, [activeChapter]);

  // 手动切换章节（点击索引时调用）
  const handleChapterChange = useCallback((newChapterId: string) => {
    if (isAnimating.current || newChapterId === activeChapter) return;

    const currentIndex = chapters.findIndex(c => c.id === activeChapter);
    const newIndex = chapters.findIndex(c => c.id === newChapterId);

    if (newIndex === -1) return;

    // 根据索引位置决定滑动方向
    const direction = newIndex > currentIndex ? 'down' : 'up';

    // 开始动画
    isAnimating.current = true;
    setSlideDirection(direction);
    setActiveChapter(newChapterId);

    // 动画结束后解锁
    setTimeout(() => {
      isAnimating.current = false;
      setSlideDirection(null);
    }, ANIMATION_DURATION);
  }, [activeChapter]);

  // 滚轮事件处理 - 使用节流
  useEffect(() => {
    let lastTime = 0;
    const throttleMs = ANIMATION_DURATION + 50;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();

      if (now - lastTime < throttleMs) return;

      if (e.deltaY > 0) {
        if (switchChapter('down')) {
          lastTime = now;
        }
      } else if (e.deltaY < 0) {
        if (switchChapter('up')) {
          lastTime = now;
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [switchChapter]);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleZoom = () => {
    cameraActions.trigger('zoomIn');
  };

  const handleReset = () => {
    cameraActions.trigger('resetView');
  };

  // 获取当前章节名称
  const getChapterName = useCallback((chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    return chapter?.label || '斗拱结构';
  }, []);

  // 切换章节时生成结构信息（仅在首次加载完成后执行）
  useEffect(() => {
    // 跳过首次加载（由上面的 useEffect 处理）
    if (!isFirstLoadComplete) return;

    const chapterName = getChapterName(activeChapter);

    // 检查缓存
    if (structureCache[activeChapter]) {
      setStructureInfo(structureCache[activeChapter]);
      setIsLoading(false); // 缓存命中也要关闭加载状态
      return;
    }

    setIsLoading(true);

    generateStructureInfo(chapterName).then(result => {
      structureCache[activeChapter] = result;
      setStructureInfo(result);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, [activeChapter, getChapterName, isFirstLoadComplete]);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';

  // 获取当前章节对应的装饰文字
  const currentDecorativeChar = decorativeChars[activeChapter] || decorativeChar;

  return (
    <div className={`relative min-h-screen ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* MacBook 风格开机加载动画 */}
      <BootLoader
        progress={bootProgress}
        isLoading={isBooting}
        onComplete={handleBootComplete}
        onLogoFlyStart={handleLogoFlyStart}
      />

      {/* 3D 画布层 */}
      <ExhibitionCanvas
        theme={theme}
        isBlurred={isMenuOpen}
        chapterId={activeChapter}
        cameraActions={cameraActions}
        slideDirection={slideDirection}
      />

      {/* 失焦遮罩层 - 用于点击关闭，z-30 确保在索引栏下方 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 顶部导航 - 始终在最上层 */}
      <ExhibitionNav
        theme={theme}
        onThemeChange={handleThemeChange}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
        showLogo={showNavLogo}
      />

      {/* 左侧章节导航 - 菜单打开时突出显示 */}
      <ChapterNav
        chapters={chapters}
        activeId={activeChapter}
        onChange={handleChapterChange}
        theme={theme}
        isHighlighted={isMenuOpen}
      />

      {/* 右侧信息卡片 - 不包裹任何容器 */}
      <InfoCard
        structureInfo={structureInfo}
        theme={theme}
        isLoading={isLoading}
        isBlurred={isMenuOpen}
      />

      {/* 底部控件 */}
      <BottomControls
        artifactOrigin={artifactInfo.name}
        artifactOriginEn={artifactInfo.nameEn}
        onZoom={handleZoom}
        onReset={handleReset}
        theme={theme}
        isBlurred={isMenuOpen}
      />

      {/* 装饰元素 */}
      <DecorativeChar char={currentDecorativeChar} theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Exhibition);
