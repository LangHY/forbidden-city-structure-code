/**
 * Charts - 数字考古页面主组件
 *
 * 使用 ECharts 自建图表替换 Flourish iframe
 * 加载本地 JSON/CSV 数据
 */

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChartsNav from './ChartsNav';
import ChartsMenu from './ChartsMenu';
import BootLoader from '../exhibition/BootLoader';
import DecorativeChar from '../exhibition/DecorativeChar';
import ChartSkeleton from './ChartSkeleton';
import ChartSource from './ChartSource';
// CollectionChart 暂未使用，保留导入以备后续扩展
// import CollectionChart from './CollectionChart';
import PalaceRadarChart from './PalaceRadarChart';
import type { RadarData } from './PalaceRadarChart';
import DougongHierarchy, { type DougongItem } from './DougongHierarchy';
import BuildingRankChart from './BuildingRankChart';
import SankeyChart from './SankeyChart';
import { useJsonData, useCsvData, aggregateSankeyData } from '@/hooks/useChartData';
import type { ThemeMode } from '../exhibition/types';

// 图表配置
const chartSections = [
  {
    id: 'collection',
    title: '宫殿藏品',
    titleEn: 'Palace Collections',
    description: '各宫殿藏品分布对比',
    dataSource: '故宫博物院藏品数据库',
    chartType: 'radar' as const,
    dataPath: '/data/palace-collection-radar.json',
    dataType: 'json' as const,
  },
  {
    id: 'hierarchy',
    title: '斗拱层级',
    titleEn: 'Dougong Hierarchy',
    description: '斗拱构件层级结构图',
    dataSource: '《清式营造则例》',
    chartType: 'tree' as const,
    dataPath: '/data/dougong-hierarchy.json',
    dataType: 'json' as const,
  },
  {
    id: 'building-rank',
    title: '建筑等级',
    titleEn: 'Building Rank',
    description: '斗拱踩数与建筑等级关系',
    dataSource: '故宫建筑实测数据',
    chartType: 'scatter' as const,
    dataPath: '/data/doupan-building-rank.csv',
    dataType: 'csv' as const,
  },
  {
    id: 'sankey',
    title: '功能流向',
    titleEn: 'Function Flow',
    description: '建筑功能与斗拱规格流向',
    dataSource: '故宫博物院建筑档案',
    chartType: 'sankey' as const,
    dataPath: '/data/dougong-building-sankey.csv',
    dataType: 'csv' as const,
  },
];

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

  // MacBook 风格加载状态
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 加载活动图表的数据
  const collectionData = useJsonData<RadarData>(chartSections[0].dataPath);
  const hierarchyData = useJsonData<DougongItem[]>(chartSections[1].dataPath);

  // 加载进度动画
  useEffect(() => {
    if (!isBooting) return;

    const quickInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 70) {
          clearInterval(quickInterval);
          return 70;
        }
        const increment = Math.random() * 8 + 3;
        return Math.min(prev + increment, 70);
      });
    }, 50);

    return () => clearInterval(quickInterval);
  }, [isBooting]);

  // 数据加载完成后完成进度
  useEffect(() => {
    if (!isBooting || collectionData.loading) return;

    const completeInterval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 100) {
          clearInterval(completeInterval);
          setTimeout(() => {
            setIsBooting(false);
            setShowNavLogo(true);
          }, 300);
          return 100;
        }
        const increment = Math.random() * 5 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 30);

    return () => clearInterval(completeInterval);
  }, [isBooting, collectionData.loading]);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setShowNavLogo(true);
  }, []);

  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';
  const textColor = theme === 'dark' ? 'text-white' : 'text-[#2a2520]';
  const cardBg = theme === 'dark'
    ? 'bg-[rgba(250,246,240,0.06)] border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
    : 'bg-[rgba(255,255,255,0.55)] border-[rgba(255,255,255,0.7)] shadow-[0_8px_32px_rgba(74,124,89,0.08)]';

  const currentSection = chartSections[activeSection];

  // 渲染图表组件
  const renderChart = () => {
    switch (currentSection.id) {
      case 'collection':
        return collectionData.data ? (
          <PalaceRadarChart data={collectionData.data} theme={theme} />
        ) : (
          <ChartSkeleton theme={theme} type="radar" />
        );

      case 'hierarchy':
        return hierarchyData.data && Array.isArray(hierarchyData.data) && hierarchyData.data.length > 0 ? (
          <DougongHierarchy data={hierarchyData.data} theme={theme} />
        ) : (
          <ChartSkeleton theme={theme} type="tree" />
        );

      case 'building-rank':
        return <BuildingRankChartFromCsv theme={theme} />;

      case 'sankey':
        return <SankeyChartFromCsv theme={theme} />;

      default:
        return <ChartSkeleton theme={theme} type="bar" />;
    }
  };

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

      {/* 背景装饰 */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1a1a2e] via-black to-[#16213e]'
              : 'bg-gradient-to-br from-[#faf9f7] via-[#f7f3ed] to-[#f5f0e8]'
          }`}
        />
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

      {/* 主内容区 */}
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
          {/* 左箭头 */}
          <button
            onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
            disabled={activeSection === 0}
            className={`absolute left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-60 hover:opacity-100 cursor-pointer'
            } ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
            aria-label="上一个图表"
          >
            <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-stone-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 图表内容 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
              className={`w-full max-w-4xl transition-all duration-500 ${isMenuOpen ? 'blur-sm opacity-50' : ''}`}
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
              <div className={`${cardBg} backdrop-blur-2xl border rounded-xl overflow-hidden shadow-2xl relative`} style={{ height: '380px' }}>
                {renderChart()}
              </div>

              {/* 数据来源 */}
              <ChartSource theme={theme} dataSource={currentSection.dataSource} />

              {/* 图表描述 */}
              <p className={`mt-2 text-center text-xs ${theme === 'dark' ? 'text-stone-400' : 'text-stone-500'}`}>
                {currentSection.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* 右箭头 */}
          <button
            onClick={() => setActiveSection(prev => Math.min(chartSections.length - 1, prev + 1))}
            disabled={activeSection === chartSections.length - 1}
            className={`absolute right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              activeSection === chartSections.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-60 hover:opacity-100 cursor-pointer'
            } ${theme === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-black/10 hover:bg-black/20'}`}
            aria-label="下一个图表"
          >
            <svg className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : 'text-stone-700'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

// CSV 数据加载组件包装器
function BuildingRankChartFromCsv({ theme }: { theme: ThemeMode }) {
  const { data, loading } = useCsvData<{ '建筑名称': string; '斗拱踩数': string; '建筑高度(米)': string; '建筑等级': string; '建造年代': string; '用途类型': string }>('/data/doupan-building-rank.csv');

  if (loading || !data.length) {
    return <ChartSkeleton theme={theme} type="scatter" />;
  }

  return <BuildingRankChart data={data as unknown as Array<{ '建筑名称': string; '斗拱踩数': string; '建筑高度(米)': string; '建筑等级': string; '建造年代': string; '用途类型': string }>} theme={theme} />;
}

function SankeyChartFromCsv({ theme }: { theme: ThemeMode }) {
  const { data, loading } = useCsvData<{ source: string; target: string; value: string }>('/data/dougong-building-sankey.csv');

  // 聚合数据：将35个细分功能归类为6大类别
  const aggregatedData = data.length > 0 ? aggregateSankeyData(data) : [];

  if (loading || !aggregatedData.length) {
    return <ChartSkeleton theme={theme} type="sankey" />;
  }

  return <SankeyChart data={aggregatedData} theme={theme} />;
}

export default memo(Charts);
