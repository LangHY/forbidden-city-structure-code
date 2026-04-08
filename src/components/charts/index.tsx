/**
 * Charts - 数字考古页面主组件
 *
 * 数据可视化图表展示页
 * 复用 Exhibition 的背景和布局风格
 * 嵌入 Flourish 图表
 */

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import ChartsNav from './ChartsNav';
import BootLoader from '../exhibition/BootLoader';
import DecorativeChar from '../exhibition/DecorativeChar';
import type { ThemeMode } from '../exhibition/types';

// 图表配置
const chartSections = [
  {
    id: 'collection',
    title: '藏品统计',
    titleEn: 'Collection Statistics',
    iframe: 'https://flo.uri.sh/visualisation/28417462/embed',
    description: '故宫博物院藏品分类统计',
  },
  {
    id: 'timeline',
    title: '历史演变',
    titleEn: 'Historical Timeline',
    iframe: 'https://flo.uri.sh/visualisation/28417423/embed',
    description: '故宫六百年历史时间轴',
  },
];

// 动画时长（毫秒）
const ANIMATION_DURATION = 500;
// 加载进度增量速度
const LOADING_SPEED = 2;

function Charts() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  // MacBook 风格加载状态
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  // 滚动控制
  const isAnimating = useRef(false);
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

  // 滚轮切换章节
  const switchSection = useCallback((direction: 'up' | 'down') => {
    if (isAnimating.current) return false;

    if (direction === 'down' && activeSection < chartSections.length - 1) {
      isAnimating.current = true;
      setActiveSection(prev => prev + 1);
    } else if (direction === 'up' && activeSection > 0) {
      isAnimating.current = true;
      setActiveSection(prev => prev - 1);
    } else {
      return false;
    }

    setTimeout(() => {
      isAnimating.current = false;
    }, ANIMATION_DURATION);

    return true;
  }, [activeSection]);

  // 滚轮事件处理
  useEffect(() => {
    let lastTime = 0;
    const throttleMs = ANIMATION_DURATION + 50;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;

      if (e.deltaY > 0) {
        if (switchSection('down')) lastTime = now;
      } else if (e.deltaY < 0) {
        if (switchSection('up')) lastTime = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [switchSection]);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#2a2520]';
  const cardBg = theme === 'dark'
    ? 'bg-[rgba(250,246,240,0.08)] border-[rgba(255,255,255,0.05)]'
    : 'bg-[rgba(255,255,255,0.45)] border-[rgba(255,255,255,0.6)]';

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
      <main className="relative z-10 pt-24 pb-16 px-8 min-h-screen flex flex-col">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-quanHeng ${textColor} tracking-[0.2em] mb-2`}>
            数字考古
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'} tracking-wider`}>
            DIGITAL ARCHAEOLOGY
          </p>
        </div>

        {/* 章节指示器 */}
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {chartSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeSection
                  ? theme === 'dark'
                    ? 'bg-emerald-400 scale-125'
                    : 'bg-[#4a7c59] scale-125'
                  : theme === 'dark'
                    ? 'bg-stone-600 hover:bg-stone-400'
                    : 'bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={section.title}
            />
          ))}
        </div>

        {/* 图表卡片区域 */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className={`w-full max-w-5xl transition-all duration-500 ${
              isMenuOpen ? 'blur-sm opacity-50' : ''
            }`}
          >
            {/* 图表标题 */}
            <div className="mb-6 text-center">
              <h2 className={`text-xl md:text-2xl font-serif ${textColor} mb-1`}>
                {currentSection.title}
              </h2>
              <p className={`text-xs ${theme === 'dark' ? 'text-stone-500' : 'text-stone-400'} tracking-widest`}>
                {currentSection.titleEn}
              </p>
            </div>

            {/* 图表容器 */}
            <div
              className={`${cardBg} backdrop-blur-2xl border rounded-2xl overflow-hidden shadow-2xl`}
            >
              <iframe
                src={currentSection.iframe}
                title={currentSection.title}
                className="w-full"
                style={{ height: '600px' }}
                frameBorder="0"
                scrolling="no"
                sandbox="allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
              />
            </div>

            {/* 图表描述 */}
            <p className={`mt-4 text-center text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
              {currentSection.description}
            </p>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className={`text-center mt-8 ${textColor} opacity-50`}>
          <div className="flex items-center justify-center gap-2 text-xs tracking-wider">
            <span>滚轮切换图表</span>
            <span className="animate-bounce">↓</span>
          </div>
        </div>
      </main>

      {/* 装饰元素 */}
      <DecorativeChar char="数字" theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Charts);
