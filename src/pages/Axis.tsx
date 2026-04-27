/**
 * Axis - 故宫中轴线3D漫游页面
 *
 * Blender风格网格地面 + 俯视3D场景
 * 集成 GLM-4.7-Flash LLM 服务生成建筑描述
 */

import { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExhibitionNav from '../components/exhibition/ExhibitionNav';
import ChapterNav from '../components/exhibition/ChapterNav';
import BottomControls from '../components/exhibition/BottomControls';
import DecorativeChar from '../components/exhibition/DecorativeChar';
import BootLoader from '../components/exhibition/BootLoader';
import AxisScene from '../components/axis/AxisScene';
import { buildings } from '../components/axis/buildingData';
import type { Chapter } from '../components/exhibition/types';
import {
  generateBuildingInfo,
  preloadAdjacentBuildings,
  setApiKey,
  type BuildingInfo,
} from '../components/axis/axisLLMService';
import BuildingTimeline from '../components/axis/BuildingTimeline';
import type { ThemeMode } from '../components/exhibition/types';
import type { StructureInfo } from '../components/exhibition/services/llmService';

// 初始化 API Key（仅从环境变量获取）
const API_KEY = import.meta.env.VITE_GLM_API_KEY;
if (API_KEY) {
  setApiKey(API_KEY);
} else {
  console.warn('VITE_GLM_API_KEY 未配置，将使用默认数据');
}

// 章节配置（与 Exhibition 页面格式一致）
const chapters: Chapter[] = buildings.map((b) => ({
  id: b.id,
  label: b.name,
}));

// 建筑名称列表（LLM服务用）
const BUILDING_NAMES = buildings.map((b) => b.name);

// 装饰文字映射
const decorativeChars: Record<string, string> = {};
buildings.forEach((building) => {
  decorativeChars[building.id] = building.name.charAt(0);
});

// 信息面板上下文（LLM提示用）
const PANEL_CONTEXT: Record<string, { location: string; form: string }> = {
  午门: { location: '紫禁城南端', form: '凹字形阙门' },
  太和门: { location: '外朝正门', form: '重檐歇山顶' },
  太和殿: { location: '外朝中心', form: '重檐庑殿顶' },
  中和殿: { location: '太和殿后', form: '单檐四角攒尖顶' },
  保和殿: { location: '中和殿后', form: '重檐歇山顶' },
  乾清门: { location: '内廷正门', form: '单檐歇山顶' },
  乾清宫: { location: '乾清门内', form: '重檐庑殿顶' },
  交泰殿: { location: '后三宫中', form: '单檐四角攒尖顶' },
  坤宁宫: { location: '交泰殿后', form: '重檐庑殿顶' },
  御花园: { location: '坤宁宫后', form: '皇家园林' },
  神武门: { location: '紫禁城北端', form: '重檐庑殿顶' },
};

function convertToStructureInfo(info: BuildingInfo): StructureInfo {
  return {
    title: info.title,
    subtitle: info.subtitle,
    description: info.description,
    historicalContext: info.historicalContext,
    components: info.components,
    technicalParams: info.technicalParams,
    funFacts: info.funFacts,
  };
}

function getDefaultStructureInfo(buildingName: string): StructureInfo {
  const ctx = PANEL_CONTEXT[buildingName];
  return {
    title: buildingName,
    subtitle: '故宫建筑',
    description: `${buildingName}是故宫中轴线上的重要建筑，承载着深厚的历史文化价值。`,
    historicalContext: '始建于明清时期，历经数百年风雨，见证了王朝兴衰。',
    components: [
      { name: '方位', nameEn: 'Location', description: ctx?.location || '故宫中轴', material: '-', function: '建筑定位' },
      { name: '形制', nameEn: 'Form', description: ctx?.form || '传统建筑', material: '-', function: '建筑形制' },
    ],
    technicalParams: { era: '明清', style: '官式', loadBearing: '高等', complexity: '中等' },
    funFacts: ['故宫是世界上现存规模最大、保存最完整的木结构宫殿建筑群'],
  };
}

const artifactInfo = { name: '故宫中轴', nameEn: 'FORBIDDEN CITY AXIS' };

function Axis() {
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [structureInfo, setStructureInfo] = useState<StructureInfo | null>(null);
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  // 加载动画
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  // 加载进度
  useEffect(() => {
    if (!isBooting) return;
    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setIsBooting(false); setShowNavLogo(true); }, 300);
          return 100;
        }
        return Math.min(prev + Math.random() * 6 + 2, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, [isBooting]);

  const handleBootComplete = useCallback(() => { setIsBooting(false); setShowNavLogo(true); }, []);
  const handleThemeChange = useCallback((t: ThemeMode) => setTheme(t), []);

  const isDark = theme === 'dark';
  const currentBuilding = selectedBuilding ? buildings.find((b) => b.id === selectedBuilding) : null;
  const currentDecorativeChar = currentBuilding ? decorativeChars[currentBuilding.id] || '故' : '故';

  // 选中建筑时加载 LLM
  useEffect(() => {
    if (!selectedBuilding) { setStructureInfo(null); return; }
    const building = buildings.find((b) => b.id === selectedBuilding);
    if (!building) return;

    setIsLLMLoading(true);
    const ctx = PANEL_CONTEXT[building.name];

    generateBuildingInfo(building.name, ctx)
      .then((info) => setStructureInfo(convertToStructureInfo(info)))
      .catch(() => setStructureInfo(getDefaultStructureInfo(building.name)))
      .finally(() => setIsLLMLoading(false));

    preloadAdjacentBuildings(building.name, BUILDING_NAMES);
  }, [selectedBuilding]);

  const handleSelectBuilding = useCallback((id: string | null) => {
    if (id === '' || id === null) {
      setSelectedBuilding(null);
    } else {
      setSelectedBuilding((prev) => (prev === id ? null : id));
    }
  }, []);

  // 获取当前建筑索引
  const currentIndex = selectedBuilding ? buildings.findIndex((b) => b.id === selectedBuilding) : -1;

  // 上一个/下一个建筑导航
  const handlePrevBuilding = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedBuilding(buildings[currentIndex - 1].id);
    } else if (currentIndex === -1 && buildings.length > 0) {
      setSelectedBuilding(buildings[0].id);
    }
  }, [currentIndex]);

  const handleNextBuilding = useCallback(() => {
    if (currentIndex < buildings.length - 1) {
      setSelectedBuilding(buildings[currentIndex + 1].id);
    }
  }, [currentIndex]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isMenuOpen) return;
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevBuilding();
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          handleNextBuilding();
          break;
        case 'Escape':
          e.preventDefault();
          setSelectedBuilding(null);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrevBuilding, handleNextBuilding, isMenuOpen]);

  return (
    <div className={`relative min-h-screen ${isDark ? 'bg-black' : 'bg-[#f7f3ed]'} overflow-hidden transition-colors duration-500`}>
      {/* 加载动画 */}
      <BootLoader progress={bootProgress} isLoading={isBooting} onComplete={handleBootComplete} />

      {/* 3D场景 */}
      <AxisScene
        selectedBuilding={selectedBuilding}
        onSelectBuilding={handleSelectBuilding}
        theme={theme}
        isBlurred={isMenuOpen}
      />

      {/* 失焦遮罩 */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 cursor-pointer bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
      )}

      {/* 顶部导航 */}
      <ExhibitionNav theme={theme} onThemeChange={handleThemeChange} isMenuOpen={isMenuOpen} onMenuToggle={setIsMenuOpen} showLogo={showNavLogo} />

      {/* 迷你导航条 */}
      <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-md transition-all duration-500 ${isMenuOpen ? 'blur-sm opacity-50' : ''} ${isDark ? 'bg-black/50 border border-white/10' : 'bg-white/60 border border-[#2a2520]/5'}`}>
        {buildings.map((building) => {
          const isActive = selectedBuilding === building.id;
          return (
            <button
              key={building.id}
              onClick={() => setSelectedBuilding(building.id)}
              className="group relative flex flex-col items-center"
            >
              <div className="relative">
                {/* 脉冲光圈 - 选中时播放 */}
                {isActive && (
                  <span className={`absolute inset-0 rounded-full animate-ping-once ${
                    isDark ? 'bg-amber-400/40' : 'bg-[#4a7c59]/30'
                  }`} style={{ transform: 'scale(2.5)' }} />
                )}
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? isDark ? 'bg-amber-400 scale-150' : 'bg-[#4a7c59] scale-150'
                    : isDark ? 'bg-white/30 hover:bg-white/60' : 'bg-stone-400/50 hover:bg-stone-600'
                }`} />
              </div>
              <span className={`absolute -bottom-5 text-[9px] whitespace-nowrap transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              } ${isActive ? (isDark ? 'text-amber-300' : 'text-[#4a7c59]') : (isDark ? 'text-white/60' : 'text-stone-500')}`} style={{ fontFamily: 'DingLieXiDaTi, serif' }}>
                {building.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 左侧章节导航 */}
      <ChapterNav
        chapters={chapters}
        activeId={selectedBuilding || ''}
        onChange={handleSelectBuilding}
        theme={theme}
        isHighlighted={isMenuOpen}
      />

      {/* 右侧信息面板 */}
      <AnimatePresence>
        {selectedBuilding && currentBuilding && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`fixed right-4 top-16 bottom-20 z-20 w-80 flex flex-col gap-2 transition-all duration-500 ${isMenuOpen ? 'blur-sm opacity-50 pointer-events-none' : ''}`}
          >
            {/* 建筑标题卡片 - 固定高度，紧凑 */}
            <div className={`shrink-0 relative overflow-hidden rounded-2xl p-4 backdrop-blur-xl ${isDark ? 'bg-gradient-to-br from-amber-900/30 to-black/50 border border-amber-500/20' : 'bg-gradient-to-br from-white/80 to-white/50 border border-[#4a7c59]/10'}`}>
              {/* 装饰线 */}
              <div className={`absolute top-0 left-0 right-0 h-0.5 ${isDark ? 'bg-gradient-to-r from-transparent via-amber-400/50 to-transparent' : 'bg-gradient-to-r from-transparent via-[#4a7c59]/40 to-transparent'}`} />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h2 className={`text-xl tracking-[0.15em] ${isDark ? 'text-amber-200' : 'text-[#4a7c59]'}`} style={{ fontFamily: 'DingLieXiDaTi, serif' }}>
                    {currentBuilding.name}
                  </h2>
                  <span className={`px-2 py-0.5 rounded text-[10px] ${isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-[#4a7c59]/15 text-[#4a7c59]'}`}>
                    {currentBuilding.era.split('·')[0].trim()}
                  </span>
                </div>
              </div>
              <p className={`text-xs mt-2 leading-relaxed line-clamp-2 ${isDark ? 'text-white/70' : 'text-stone-600'}`}>
                {currentBuilding.description}
              </p>
            </div>

            {/* 详细信息卡片 - 可滚动 */}
            <div className={`flex-1 min-h-0 rounded-2xl backdrop-blur-xl overflow-hidden ${isDark ? 'bg-black/40 border border-white/10' : 'bg-white/60 border border-[#2a2520]/5'}`}>
              <div className="h-full overflow-y-auto p-4">
                {isLLMLoading ? (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                    <span className={`text-xs ${isDark ? 'text-white/50' : 'text-stone-400'}`}>加载中...</span>
                  </div>
                ) : structureInfo ? (
                  <div className="space-y-3">
                    {/* 副标题 */}
                    <p className={`text-xs font-medium ${isDark ? 'text-amber-200/80' : 'text-[#4a7c59]'}`}>
                      {structureInfo.subtitle}
                    </p>

                    {/* 描述 */}
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-white/70' : 'text-stone-600'}`}>
                      {structureInfo.description}
                    </p>

                    {/* 分隔线 */}
                    <div className={`h-px ${isDark ? 'bg-gradient-to-r from-transparent via-amber-500/30 to-transparent' : 'bg-gradient-to-r from-transparent via-stone-300 to-transparent'}`} />

                    {/* 技术参数 - 标签式布局 */}
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: '年代', value: structureInfo.technicalParams.era },
                        { label: '风格', value: structureInfo.technicalParams.style },
                        { label: '等级', value: structureInfo.technicalParams.loadBearing },
                        { label: '复杂度', value: structureInfo.technicalParams.complexity },
                      ].map((item, idx) => (
                        <div key={idx} className={`px-2 py-1 rounded ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                          <span className={`text-[9px] block ${isDark ? 'text-amber-400/60' : 'text-stone-400'}`}>{item.label}</span>
                          <span className={`text-[11px] ${isDark ? 'text-white/90' : 'text-stone-700'}`}>{item.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* 核心构件 */}
                    {structureInfo.components.length > 0 && (
                      <div className="space-y-1.5">
                        <span className={`text-[9px] uppercase tracking-widest ${isDark ? 'text-amber-400/50' : 'text-stone-400'}`}>核心构件</span>
                        <div className="space-y-1">
                          {structureInfo.components.slice(0, 3).map((comp, idx) => (
                            <div key={idx} className={`flex items-center gap-2 p-1.5 rounded ${isDark ? 'bg-white/5' : 'bg-black/3'}`}>
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${isDark ? 'bg-amber-400/20 text-amber-300' : 'bg-[#4a7c59]/20 text-[#4a7c59]'}`}>{idx + 1}</span>
                              <div className="flex-1 min-w-0">
                                <span className={`text-xs ${isDark ? 'text-white/90' : 'text-stone-700'}`}>{comp.name}</span>
                                <span className={`text-[9px] ml-1.5 ${isDark ? 'text-white/40' : 'text-stone-400'}`}>{comp.material}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 历史背景 */}
                    <div className={`p-2.5 rounded-lg ${isDark ? 'bg-gradient-to-br from-amber-900/20 to-transparent' : 'bg-gradient-to-br from-stone-100/50 to-transparent'}`}>
                      <span className={`text-[9px] uppercase tracking-widest block mb-1 ${isDark ? 'text-amber-400/50' : 'text-stone-400'}`}>历史背景</span>
                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-white/70' : 'text-stone-600'}`}>{structureInfo.historicalContext}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 历史沿革时间轴 - 固定底部，可展开 */}
            <div className={`shrink-0 rounded-2xl overflow-hidden backdrop-blur-xl ${isDark ? 'bg-black/40 border border-white/10' : 'bg-white/60 border border-[#2a2520]/5'}`}>
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className={`w-full flex items-center justify-between px-3 py-2.5 transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
              >
                <div className="flex items-center gap-2">
                  <svg className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-[#4a7c59]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`text-xs tracking-wide ${isDark ? 'text-white/80' : 'text-stone-700'}`} style={{ fontFamily: 'DingLieXiDaTi, serif' }}>
                    {currentBuilding.name}·历史沿革
                  </span>
                </div>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${showTimeline ? 'rotate-180' : ''} ${isDark ? 'text-white/50' : 'text-stone-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showTimeline && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className={`p-2.5 pt-0 max-h-[200px] overflow-y-auto ${isDark ? 'scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20' : ''}`}>
                      <BuildingTimeline buildingName={currentBuilding.name} theme={theme} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 章节导航按钮 */}
            <div className={`shrink-0 flex items-center justify-between rounded-2xl px-3 py-2 backdrop-blur-xl ${isDark ? 'bg-black/40 border border-white/10' : 'bg-white/60 border border-[#2a2520]/5'}`}>
              <button
                onClick={handlePrevBuilding}
                disabled={currentIndex <= 0}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentIndex <= 0
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark ? 'hover:bg-white/10 active:scale-95' : 'hover:bg-black/5 active:scale-95'
                }`}
              >
                <svg className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#4a7c59]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className={`text-xs ${isDark ? 'text-white/70' : 'text-stone-600'}`}>上一座</span>
              </button>

              <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-stone-400'}`}>
                {currentIndex + 1} / {buildings.length}
              </span>

              <button
                onClick={handleNextBuilding}
                disabled={currentIndex >= buildings.length - 1 || currentIndex === -1}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  currentIndex >= buildings.length - 1 || currentIndex === -1
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark ? 'hover:bg-white/10 active:scale-95' : 'hover:bg-black/5 active:scale-95'
                }`}
              >
                <span className={`text-xs ${isDark ? 'text-white/70' : 'text-stone-600'}`}>下一座</span>
                <svg className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-[#4a7c59]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部控件 */}
      <BottomControls artifactOrigin={artifactInfo.name} artifactOriginEn={artifactInfo.nameEn} onZoom={() => {}} onReset={() => setSelectedBuilding(null)} theme={theme} isBlurred={isMenuOpen} showZoom={false} />

      {/* 操作提示 */}
      {!selectedBuilding && (
        <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-20 text-center transition-all duration-500 ${isMenuOpen ? 'blur-sm opacity-50' : ''}`}>
          <p className={`text-xs tracking-widest ${isDark ? 'text-white/30' : 'text-stone-400'}`}>
            点击建筑查看详情 · 拖拽旋转视角 · 滚轮缩放 · 方向键切换
          </p>
        </div>
      )}

      {/* 装饰元素 */}
      <DecorativeChar char={currentDecorativeChar} theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Axis);