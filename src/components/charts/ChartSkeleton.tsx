/**
 * ChartSkeleton - 图表加载骨架屏
 *
 * 在 Flourish iframe 加载完成前显示的占位动画
 * 匹配项目整体设计风格
 */

import { memo } from 'react';
import type { ThemeMode } from '../exhibition/types';

interface ChartSkeletonProps {
  theme: ThemeMode;
  type?: 'sankey' | 'bar' | 'tree' | 'scatter';
}

function ChartSkeleton({ theme, type = 'bar' }: ChartSkeletonProps) {
  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-white/10' : 'bg-black/8';
  const bgLightClass = isDark ? 'bg-white/5' : 'bg-black/5';

  // 根据图表类型显示不同骨架
  const renderSkeleton = () => {
    switch (type) {
      case 'sankey':
        return (
          <div className="space-y-3">
            {/* Sankey 流向图骨架 */}
            <div className="flex justify-between items-start">
              {/* 左侧节点 */}
              <div className="space-y-3 w-24">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-6 rounded ${bgClass}`}
                    style={{ width: `${60 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
              {/* 中间连线区域 */}
              <div className="flex-1 mx-4">
                <div className={`h-48 rounded ${bgLightClass}`} />
              </div>
              {/* 右侧节点 */}
              <div className="space-y-2 w-24">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-5 rounded ${bgClass}`}
                    style={{ width: `${50 + Math.random() * 50}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'tree':
        return (
          <div className="space-y-3">
            {/* 树形图骨架 */}
            <div className="flex items-center gap-4">
              {/* 根节点 */}
              <div className={`w-16 h-8 rounded ${bgClass}`} />
              {/* 分支 */}
              <div className="flex gap-6">
                {[1, 2, 3].map((group) => (
                  <div key={group} className="space-y-2">
                    <div className={`w-14 h-6 rounded ${bgLightClass}`} />
                    <div className="ml-4 space-y-1">
                      <div className={`w-12 h-4 rounded ${bgLightClass}`} />
                      <div className={`w-10 h-4 rounded ${bgLightClass}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'scatter':
        return (
          <div className="space-y-3">
            {/* 散点图骨架 */}
            <div className={`h-64 rounded ${bgLightClass} relative overflow-hidden`}>
              {/* 坐标轴 */}
              <div className={`absolute bottom-0 left-0 right-0 h-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              <div className={`absolute bottom-0 top-0 left-0 w-px ${isDark ? 'bg-white/20' : 'bg-black/20'}`} />
              {/* 散点 */}
              <div className="absolute inset-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className={`absolute rounded-full ${bgClass}`}
                    style={{
                      width: `${8 + Math.random() * 16}px`,
                      height: `${8 + Math.random() * 16}px`,
                      left: `${10 + Math.random() * 80}%`,
                      top: `${10 + Math.random() * 80}%`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            {/* 柱状图骨架 */}
            <div className="flex items-end justify-center gap-3 h-56">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className={`w-8 rounded-t ${bgClass}`}
                  style={{ height: `${30 + Math.random() * 70}%` }}
                />
              ))}
            </div>
            {/* X轴标签 */}
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className={`w-8 h-2 rounded ${bgLightClass}`} />
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="animate-pulse p-4">
      {/* 标题骨架 */}
      <div className={`h-4 rounded ${bgLightClass} w-1/4 mb-4`} />

      {/* 图表区域骨架 */}
      {renderSkeleton()}

      {/* 图例骨架 */}
      <div className="flex gap-4 justify-center mt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded ${bgClass}`} />
            <div className={`h-2 rounded ${bgLightClass} w-12`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ChartSkeleton);
