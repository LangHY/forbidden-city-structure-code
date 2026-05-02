/**
 * Exhibition - 展览页面主组件
 *
 * 组合所有子组件，实现斗拱结构展示页面
 * 集成 LLM 生成结构描述
 * 支持滚轮切换章节
 * MacBook 风格开机加载动画
 *
 * 🚀 重构：使用自定义 Hooks 拆分逻辑
 */

import { useState, useCallback, useEffect, memo } from 'react';
import ExhibitionCanvas, { useCameraControl, preloadAdjacentModels } from './ExhibitionCanvas';
import ExhibitionNav from './ExhibitionNav';
import ChapterNav from './ChapterNav';
import InfoCard from './InfoCard';
import BottomControls from './BottomControls';
import DecorativeChar from './DecorativeChar';
import BootLoader from './BootLoader';
import GameControls from './GameControls';
import CompletionEffect from './CompletionEffect';
import { chapters, artifactInfo, decorativeChars, decorativeChar, explodedViewConfigs } from './config';
import type { ThemeMode, GameMode } from './types';

// 导入自定义 Hooks
import { useBootAnimation, useChapterNavigation, useStructureData, usePreloadAdjacent } from './hooks';

function Exhibition() {
  // ========================================
  // 自定义 Hooks - 状态管理拆分
  // ========================================

  // 开机加载动画
  const {
    bootProgress,
    isBooting,
    showNavLogo,
    handleBootComplete,
    setBootProgress,
  } = useBootAnimation();

  // 章节导航
  const {
    activeChapter,
    slideDirection,
    goToChapter: handleChapterChange,
  } = useChapterNavigation();

  // 结构数据加载（内部管理 isFirstLoadComplete）
  const { structureInfo, isLoading } = useStructureData(
    activeChapter,
    // 首次加载完成回调：进度条冲刺到 100%
    useCallback(() => setBootProgress(100), [setBootProgress])
  );

  // 预加载相邻章节
  usePreloadAdjacent(activeChapter);

  // ========================================
  // 本地状态
  // ========================================

  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>('exhibit');
  const [placedPieces, setPlacedPieces] = useState<Set<number>>(new Set());

  // 相机控制
  const cameraActions = useCameraControl();

  // ========================================
  // 首次加载完成回调
  // ========================================

  const onBootComplete = useCallback(() => {
    handleBootComplete();
    // 预加载相邻模型
    preloadAdjacentModels(activeChapter);
  }, [handleBootComplete, activeChapter]);

  // ========================================
  // 事件处理
  // ========================================

  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  const handleZoom = useCallback(() => {
    cameraActions.trigger('zoomIn');
  }, [cameraActions]);

  const handleReset = useCallback(() => {
    cameraActions.trigger('resetView');
  }, [cameraActions]);

  const handleExplodeToggle = useCallback(() => {
    setIsExploded(prev => !prev);
  }, []);

  // 游戏：开始拼装
  const handleStartGame = useCallback(() => {
    setIsExploded(true);
    setPlacedPieces(new Set());
    setGameMode('playing');
  }, []);

  // 游戏：重置
  const handleResetGame = useCallback(() => {
    setPlacedPieces(new Set());
    // 先合并再爆炸，触发重新散开
    setIsExploded(false);
    requestAnimationFrame(() => setIsExploded(true));
  }, []);

  // 游戏：退出
  const handleExitGame = useCallback(() => {
    setGameMode('exhibit');
    setPlacedPieces(new Set());
    setIsExploded(false);
  }, []);

  // 游戏：构件归位
  const handlePiecePlaced = useCallback((index: number) => {
    setPlacedPieces(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  // 通关动画结束
  const handleCompletionDone = useCallback(() => {
    setGameMode('exhibit');
    setIsExploded(false);
    setPlacedPieces(new Set());
  }, []);

  // 检测是否通关
  useEffect(() => {
    if (gameMode !== 'playing') return;
    const config = explodedViewConfigs[activeChapter];
    if (!config) return;

    if (placedPieces.size >= config.components.length) {
      setGameMode('completed');
    }
  }, [placedPieces, gameMode, activeChapter]);

  const handleChapterChangeWithReset = useCallback((chapterId: string) => {
    setIsExploded(false);
    setGameMode('exhibit');
    setPlacedPieces(new Set());
    handleChapterChange(chapterId);
  }, [handleChapterChange]);

  // ========================================
  // 渲染
  // ========================================

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';
  const currentDecorativeChar = decorativeChars[activeChapter] || decorativeChar;

  return (
    <div className={`relative min-h-screen ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* MacBook 风格开机加载动画 */}
      <BootLoader
        progress={bootProgress}
        isLoading={isBooting}
        onComplete={onBootComplete}
        onLogoFlyStart={() => {}}
      />

      {/* 3D 画布层 */}
      <ExhibitionCanvas
        theme={theme}
        isBlurred={isMenuOpen}
        chapterId={activeChapter}
        cameraActions={cameraActions}
        slideDirection={slideDirection}
        isExploded={isExploded}
        gameMode={gameMode}
        onPiecePlaced={handlePiecePlaced}
        placedPieces={placedPieces}
      />

      {/* 失焦遮罩层 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 cursor-pointer"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 顶部导航 */}
      <ExhibitionNav
        theme={theme}
        onThemeChange={handleThemeChange}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
        showLogo={showNavLogo}
      />

      {/* 左侧章节导航 */}
      <ChapterNav
        chapters={chapters}
        activeId={activeChapter}
        onChange={handleChapterChangeWithReset}
        theme={theme}
        isHighlighted={isMenuOpen}
      />

      {/* 右侧信息卡片 */}
      <InfoCard
        structureInfo={structureInfo}
        theme={theme}
        isLoading={isLoading}
        isBlurred={isMenuOpen}
      />

      {/* 底部控件 - 展览模式用 BottomControls，游戏模式用 GameControls */}
      {gameMode === 'exhibit' ? (
        <BottomControls
          artifactOrigin={artifactInfo.name}
          artifactOriginEn={artifactInfo.nameEn}
          onZoom={handleZoom}
          onReset={handleReset}
          onExplodeToggle={explodedViewConfigs[activeChapter] ? handleExplodeToggle : undefined}
          isExploded={isExploded}
          onStartGame={explodedViewConfigs[activeChapter] ? handleStartGame : undefined}
          theme={theme}
          isBlurred={isMenuOpen}
        />
      ) : (
        <GameControls
          gameMode={gameMode}
          theme={theme}
          isBlurred={isMenuOpen}
          placedCount={placedPieces.size}
          totalCount={explodedViewConfigs[activeChapter]?.components.length ?? 0}
          onStart={handleStartGame}
          onReset={handleResetGame}
          onExit={handleExitGame}
        />
      )}

      {/* 通关祝贺 */}
      <CompletionEffect
        visible={gameMode === 'completed'}
        theme={theme}
        onComplete={handleCompletionDone}
      />

      {/* 装饰元素 */}
      <DecorativeChar char={currentDecorativeChar} theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Exhibition);
