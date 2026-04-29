/**
 * BuildingTimeline - 建筑演变时间轴
 *
 * 展示故宫中轴线建筑的历史演变事件
 * 数据来源: public/data/forbidden-city-timeline.json
 */

import { useState, useEffect, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJsonData } from '@/hooks/useChartData';
import type { ThemeMode } from '../exhibition/types';

// 时间轴事件类型
interface TimelineEvent {
  year: number;
  era: string;
  eraGroup: string;
  event: string;
  title: string;
  description: string;
  importance: number;
  category: string;
  location?: string;
  emperor?: string;
  details?: Record<string, string>;
}

// 事件类型颜色映射
const categoryColors: Record<string, { bg: string; text: string; dot: string; darkBg: string; darkText: string }> = {
  '建造': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', darkBg: 'bg-emerald-900/30', darkText: 'text-emerald-300' },
  '建成': { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500', darkBg: 'bg-emerald-900/30', darkText: 'text-emerald-300' },
  '修缮': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500', darkBg: 'bg-blue-900/30', darkText: 'text-blue-300' },
  '灾害': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', darkBg: 'bg-red-900/30', darkText: 'text-red-300' },
  '改建': { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', darkBg: 'bg-amber-900/30', darkText: 'text-amber-300' },
  '政权更迭': { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500', darkBg: 'bg-purple-900/30', darkText: 'text-purple-300' },
  '战争': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', darkBg: 'bg-red-900/30', darkText: 'text-red-300' },
  '开放': { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500', darkBg: 'bg-cyan-900/30', darkText: 'text-cyan-300' },
  '保护': { bg: 'bg-teal-100', text: 'text-teal-700', dot: 'bg-teal-500', darkBg: 'bg-teal-900/30', darkText: 'text-teal-300' },
  '荣誉': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500', darkBg: 'bg-yellow-900/30', darkText: 'text-yellow-300' },
  '纪念': { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500', darkBg: 'bg-rose-900/30', darkText: 'text-rose-300' },
  '文创': { bg: 'bg-pink-100', text: 'text-pink-700', dot: 'bg-pink-500', darkBg: 'bg-pink-900/30', darkText: 'text-pink-300' },
  '管理': { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', darkBg: 'bg-slate-900/30', darkText: 'text-slate-300' },
  '分离': { bg: 'bg-orange-100', text: 'text-orange-700', dot: 'bg-orange-500', darkBg: 'bg-orange-900/30', darkText: 'text-orange-300' },
  '接管': { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: 'bg-indigo-500', darkBg: 'bg-indigo-900/30', darkText: 'text-indigo-300' },
};

// 建筑名称映射到时间轴事件关键词
const buildingKeywordMap: Record<string, string[]> = {
  '午门': ['午门', '紫禁城正门', '宫门'],
  '太和门': ['太和门', '外朝正门'],
  '太和殿': ['太和殿', '奉天殿', '金銮殿', '三大殿'],
  '中和殿': ['中和殿', '华盖殿', '三大殿'],
  '保和殿': ['保和殿', '谨身殿', '三大殿'],
  '乾清门': ['乾清门'],
  '乾清宫': ['乾清宫', '正大光明'],
  '交泰殿': ['交泰殿'],
  '坤宁宫': ['坤宁宫'],
  '御花园': ['御花园'],
  '神武门': ['神武门', '北门'],
};

interface BuildingTimelineProps {
  buildingName: string;
  theme: ThemeMode;
}

function BuildingTimeline({ buildingName, theme }: BuildingTimelineProps) {
  const { data: timelineData, loading } = useJsonData<TimelineEvent[]>('/data/forbidden-city-timeline.json');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const isDark = theme === 'dark';

  // 筛选与当前建筑相关的事件
  const filteredEvents = useMemo(() => {
    if (!timelineData) return [];

    const keywords = buildingKeywordMap[buildingName] || [buildingName];

    // 先筛选包含关键词的事件
    const matched = timelineData.filter(event => {
      const text = `${event.event}${event.title}${event.description}${event.location || ''}`;
      return keywords.some(kw => text.includes(kw));
    });

    // 如果匹配事件太少，补充通用的紫禁城大事件
    if (matched.length < 3) {
      const generalEvents = timelineData.filter(event =>
        event.importance >= 5 &&
        !matched.some(m => m.year === event.year)
      );
      return [...matched, ...generalEvents].sort((a, b) => a.year - b.year).slice(0, 8);
    }

    return matched.sort((a, b) => a.year - b.year);
  }, [timelineData, buildingName]);

  // 切换建筑时重置展开状态
  useEffect(() => {
    setExpandedIndex(null);
  }, [buildingName]);

  if (loading || !timelineData) {
    return (
      <div className="space-y-3 animate-pulse p-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-start gap-3">
            <div className={`w-3 h-3 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/10'}`} />
            <div className="flex-1 space-y-1">
              <div className={`h-3 w-16 rounded ${isDark ? 'bg-white/10' : 'bg-black/8'}`} />
              <div className={`h-4 w-3/4 rounded ${isDark ? 'bg-white/8' : 'bg-black/5'}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <div className={`text-center py-4 text-xs ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
        暂无历史记录
      </div>
    );
  }

  return (
    <div className="building-timeline">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-1 h-4 rounded-full ${isDark ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
        <h3 className={`text-sm font-serif tracking-wider ${isDark ? 'text-stone-300' : 'text-stone-600'}`}>
          {buildingName} · 历史沿革
        </h3>
        <span className={`text-[10px] ml-auto ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
          {filteredEvents.length} 条记录
        </span>
      </div>

      {/* 时间轴 */}
      <div className="space-y-0">
        {filteredEvents.map((event, index) => {
          const colors = categoryColors[event.category] || categoryColors['修缮'];
          const isExpanded = expandedIndex === index;
          const importanceDot = event.importance >= 5 ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';

          return (
            <div key={`${event.year}-${index}`} className="relative">
              {/* 事件条目 */}
              <motion.button
                className="w-full text-left flex items-start gap-3 py-1.5 px-1 rounded-lg transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                whileTap={{ scale: 0.99 }}
              >
                {/* 时间轴线 + 节点 */}
                <div className="flex flex-col items-center shrink-0 pt-1">
                  <div className={`${importanceDot} rounded-full ${isDark ? colors.darkBg : colors.bg} flex items-center justify-center`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isDark ? colors.dot : colors.dot}`} />
                  </div>
                  {index < filteredEvents.length - 1 && (
                    <div className={`w-px flex-1 min-h-[16px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
                  )}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] shrink-0 ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                      {event.year}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isDark ? colors.darkBg + ' ' + colors.darkText : colors.bg + ' ' + colors.text}`}>
                      {event.category}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-stone-600' : 'text-stone-400'}`}>
                      {event.eraGroup}
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-stone-300' : 'text-stone-700'}`}>
                    {event.title}
                  </p>
                </div>
              </motion.button>

              {/* 展开详情 */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className={`ml-7 mb-2 p-2.5 rounded-lg text-xs leading-relaxed ${
                      isDark ? 'bg-white/5 text-stone-400' : 'bg-black/3 text-stone-600'
                    }`}>
                      <p>{event.description}</p>
                      {event.emperor && (
                        <p className={`mt-1.5 ${isDark ? 'text-stone-500' : 'text-stone-400'}`}>
                          帝王: {event.emperor}
                        </p>
                      )}
                      {event.details && (
                        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                          {Object.entries(event.details).map(([key, value]) => (
                            <span key={key} className={isDark ? 'text-stone-500' : 'text-stone-400'}>
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(BuildingTimeline);
