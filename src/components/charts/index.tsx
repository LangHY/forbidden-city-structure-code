/**
 * Charts - 数字考古页面主组件
 *
 * 数据可视化图表展示页
 * 复用 Exhibition 的背景和布局风格
 * 嵌入 Flourish 图表
 * 支持箭头按钮切换
 */

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartsNav from './ChartsNav';
import ChartsMenu from './ChartsMenu';
import BootLoader from '../exhibition/BootLoader';
import DecorativeChar from '../exhibition/DecorativeChar';
import ChartSkeleton from './ChartSkeleton';
import ChartSource from './ChartSource';
import type { ThemeMode } from '../exhibition/types';

// 图表配置
const chartSections = [
  {
    id: 'sankey',
    title: '功能流向',
    titleEn: 'Function Flow',
    iframe: 'https://flo.uri.sh/visualisation/28435676/embed',
    description: '建筑功能与斗拱规格流向',
    dataSource: '故宫博物院建筑档案',
    chartType: 'sankey' as const,
  },
  {
    id: 'collection',
    title: '藏品统计',
    titleEn: 'Collection Statistics',
    iframe: 'https://flo.uri.sh/visualisation/28417462/embed',
    description: '故宫博物院藏品分类统计',
    dataSource: '故宫博物院藏品数据库',
    chartType: 'bar' as const,
  },
  {
    id: 'hierarchy',
    title: '斗拱结构',
    titleEn: 'Dougong Hierarchy',
    iframe: 'https://flo.uri.sh/visualisation/28417423/embed',
    description: '斗拱构件层级结构图',
    dataSource: '《清式营造则例》',
    chartType: 'tree' as const,
  },
  {
    id: 'building-rank',
    title: '建筑等级',
    titleEn: 'Building Rank',
    iframe: 'https://flo.uri.sh/visualisation/28435531/embed',
    description: '斗拱踩数与建筑等级关系',
    dataSource: '故宫建筑实测数据',
    chartType: 'scatter' as const,
  },
];

// 加载进度增量速度
const LOADING_SPEED = 2;

// 切换动画配置
const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

function Charts() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // MacBook 风格加载状态
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 加载进度模拟
  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 90) return prev;
        const increment = Math.random() * LOADING_SPEED + 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isBooting]);

  // 首次加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootProgress(100);
      setTimeout(() => {
        setIsBooting(false);
        setShowNavLogo(true);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 加载动画完成回调
  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setShowNavLogo(true);
  }, []);

  // 主题切换
  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#2a2520]';
  // 增强卡片玻璃态效果
  const cardBg = theme === 'dark'
    ? 'bg-[rgba(250,246,240,0.06)] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
    : 'bg-[rgba(255,255,255,0.55)] border-[rgba(255,255,255,0.7)] shadow-[0_8px_32px_rgba(74,124,89,0.08)]';

  // iframe 加载完成回调
  const handleIframeLoad = useCallback(() => {
    // 延迟显示，确保图表完全渲染
    setTimeout(() => setIframeLoaded(true), 300);
  }, []);

  // 切换图表时重置加载状态
  useEffect(() => {
    setIframeLoaded(false);
  }, [activeSection]);

  const currentSection = chartSections[activeSection];

  return (
    <div
      ref={containerRef}
      className={`relative min-h-screen ${bgColor} overflow-hidden transition-colors duration-500`}
    >
      {/* MacBook 风格开机加载动画 */}
      <BootLoader
        progress={bootProgress}
        isLoading={isBooting}
        onComplete={handleBootComplete}
      />

      {/* 背景装饰 - 复用 Exhibition 风格 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 渐变背景 */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1a1a2e] via-black to-[#16213e]'
              : 'bg-gradient-to-br from-[#faf9f7] via-[#f7f3ed] to-[#f5f0e8]'
          }`}
        />
        {/* 噪点纹理 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 失焦遮罩层 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 cursor-pointer bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 顶部导航 */}
      <ChartsNav
        theme={theme}
        onThemeChange={handleThemeChange}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
        showLogo={showNavLogo}
      />

      {/* 主内容区 - 图表展示 */}
      <main className="relative z-10 pt-16 pb-8 px-8 h-screen flex flex-col">
        {/* 页面标题 */}
        <div className="text-center mb-4">
          <h1 className={`text-2xl md:text-3xl font-quanHeng ${textColor} tracking-[0.2em] mb-1`}>
            数字考古
          </h1>
          <p className={`text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'} tracking-wider`}>
            DIGITAL ARCHAEOLOGY
          </p>
        </div>

        {/* 图表卡片区域 */}
        <div className="flex-1 flex items-center justify-center relative">
          {/* 左箭头按钮 */}
          <button
            onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
            disabled={activeSection === 0}
            className={`absolute left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'opacity-60 hover:opacity-100 cursor-pointer'
            } ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-black/10 hover:bg-black/20'
            }`}
            aria-label="上一个图表"
          >
            <svg
              className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-stone-700'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 图表内容容器 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className={`w-full max-w-4xl transition-all duration-500 ${
                isMenuOpen ? 'blur-sm opacity-50' : ''
              }`}
            >
              {/* 图表标题 */}
              <div className="mb-3 text-center">
                <h2 className={`text-lg md:text-xl font-serif ${textColor} mb-0.5`}>
                  {currentSection.title}
                </h2>
                <p className={`text-xs ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'} tracking-widest`}>
                  {currentSection.titleEn}
                </p>
              </div>

              {/* 图表容器 */}
              <div
                className={`${cardBg} backdrop-blur-2xl border rounded-xl overflow-hidden shadow-2xl relative`}
              >
                {/* 骨架屏 - 加载中显示 */}
                {!iframeLoaded && (
                  <div className="absolute inset-0 z-10">
                    <ChartSkeleton theme={theme} type={currentSection.chartType} />
                  </div>
                )}

                {/* Flourish iframe */}
                <iframe
                  src={currentSection.iframe}
                  title={currentSection.title}
                  className="w-full"
                  style={{
                    height: '380px',
                    opacity: iframeLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out'
                  }}
                  frameBorder="0"
                  scrolling="no"
                  sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                  onLoad={handleIframeLoad}
                />
              </div>

              {/* 数据来源标注 */}
              <ChartSource theme={theme} dataSource={currentSection.dataSource} />

              {/* 图表描述 */}
              <p className={`mt-2 text-center text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                {currentSection.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* 右箭头按钮 */}
          <button
            onClick={() => setActiveSection(prev => Math.min(chartSections.length - 1, prev + 1))}
            disabled={activeSection === chartSections.length - 1}
            className={`absolute right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection === chartSections.length - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'opacity-60 hover:opacity-100 cursor-pointer'
            } ${
              theme === 'dark'
                ? 'bg-white/10 hover:bg-white/20'
                : 'bg-black/10 hover:bg-black/20'
            }`}
            aria-label="下一个图表"
          >
            <svg
              className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-stone-700'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* 切换提示 */}
        <div className={`text-center ${textColor} opacity-50`}>
          <div className="flex items-center justify-center gap-2 text-xs tracking-wider">
            <span>点击箭头切换图表</span>
          </div>
        </div>
      </main>

      {/* 图表选择菜单 */}
      <ChartsMenu
        isOpen={isMenuOpen}
        theme={theme}
        charts={chartSections}
        activeIndex={activeSection}
        onSelect={(index) => setActiveSection(index)}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* 装饰元素 */}
      <DecorativeChar char="数字" theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Charts);
