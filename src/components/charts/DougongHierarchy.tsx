/**
 * DougongHierarchy - 斗拱层级树图
 *
 * 使用 ECharts Tree 展示斗拱构件层级结构
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ThemeMode } from '../exhibition/types';
import { parseTreeData } from '@/hooks/useChartData';

export interface DougongItem {
  name: string;
  parent: string | null;
  value: number | null;
  description?: string;
  material?: string;
  function?: string;
}

interface DougongHierarchyProps {
  data: DougongItem[];
  theme: ThemeMode;
}

function DougongHierarchy({ data, theme }: DougongHierarchyProps) {
  const isDark = theme === 'dark';

  // 解析树形数据
  const treeData = useMemo(() => parseTreeData(data), [data]);

  const option: EChartsOption = useMemo(() => {
    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        textStyle: {
          color: isDark ? '#fff' : '#333',
        },
        formatter: (params: unknown) => {
          const p = params as { name: string; value?: number; data?: { description?: string } };
          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: 600; color: ${isDark ? '#34d399' : '#059669'};">${p.name}</div>
              ${p.data?.description ? `<div style="color: #888; font-size: 11px; margin-top: 4px;">${p.data.description}</div>` : ''}
              ${p.value ? `<div style="margin-top: 4px; font-size: 11px;">权重: ${p.value}</div>` : ''}
            </div>
          `;
        },
      },
      series: [
        {
          type: 'tree',
          data: [treeData],
          top: '5%',
          left: '10%',
          bottom: '5%',
          right: '15%',
          symbolSize: 12,
          orient: 'LR',
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 11,
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left',
            },
          },
          emphasis: {
            focus: 'descendant',
            itemStyle: {
              color: '#B91C1C',
              borderWidth: 2,
            },
            lineStyle: {
              width: 2,
            },
          },
          expandAndCollapse: true,
          animationDuration: 550,
          animationDurationUpdate: 750,
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            width: 1.5,
            curveness: 0.5,
          },
          itemStyle: {
            color: isDark ? '#34d399' : '#059669',
            borderWidth: 0,
          },
        },
      ],
    };
  }, [treeData, isDark]);

  return (
    <ReactECharts
      echarts={null as unknown as typeof import('echarts')}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}

export default DougongHierarchy;
