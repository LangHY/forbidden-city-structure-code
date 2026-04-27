/**
 * PalaceRadarChart - 宫殿藏品雷达图
 *
 * 使用 ECharts Radar 展示各宫殿藏品分布对比
 * 8维度：古籍文献、陶瓷、书画、织绣、玉器、宗教文物、青铜器、珐琅器
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ThemeMode } from '../exhibition/types';

interface RadarIndicator {
  name: string;
  max: number;
}

interface PalaceData {
  name: string;
  values: number[];
}

export interface RadarData {
  indicators: RadarIndicator[];
  palaces: PalaceData[];
}

interface PalaceRadarChartProps {
  data: RadarData;
  theme: ThemeMode;
}

/** 宫殿配色 - 鲜明高对比 */
const PALACE_COLORS: Record<string, string> = {
  '太和殿': '#EF4444',
  '乾清宫': '#3B82F6',
  '养心殿': '#14B8A6',
  '坤宁宫': '#A855F7',
  '文华殿': '#6366F1',
};

/** 宫殿线型 - 区分实线/虚线 */
const PALACE_LINE_TYPES: Record<string, number[]> = {
  '太和殿': [],
  '乾清宫': [],
  '养心殿': [6, 4],
  '坤宁宫': [2, 3],
  '文华殿': [8, 4, 2, 4],
};

function PalaceRadarChart({ data, theme }: PalaceRadarChartProps) {
  const isDark = theme === 'dark';

  const option: EChartsOption = useMemo(() => {
    const seriesData = data.palaces.map(palace => {
      const color = PALACE_COLORS[palace.name] || '#EF4444';
      return {
        value: palace.values,
        name: palace.name,
        symbol: 'circle',
        symbolSize: 5,
        lineStyle: {
          width: 1.5,
          color,
          type: PALACE_LINE_TYPES[palace.name] ? 'dashed' as const : 'solid' as const,
        },
        areaStyle: {
          color: `${color}18`,
        },
        itemStyle: {
          color,
          borderColor: isDark ? '#000' : '#fff',
          borderWidth: 1.5,
        },
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.98)',
        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: {
          color: isDark ? '#fff' : '#333',
          fontSize: 15,
          fontFamily: 'DingLieXiDaTi, serif',
        },
        extraCssText: 'border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);',
      },
      legend: {
        data: data.palaces.map(p => p.name),
        bottom: 6,
        itemWidth: 20,
        itemHeight: 12,
        itemGap: 20,
        textStyle: {
          color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)',
          fontSize: 15,
          fontFamily: 'DingLieXiDaTi, serif',
          padding: [0, 0, 0, 4],
        },
        icon: 'roundRect',
      },
      radar: {
        indicator: data.indicators,
        center: ['50%', '45%'],
        radius: '72%',
        startAngle: 90,
        axisName: {
          color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
          fontSize: 18,
          fontFamily: 'DingLieXiDaTi, serif',
          fontWeight: 500,
          backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.6)',
          borderRadius: 4,
          padding: [4, 8],
        },
        splitNumber: 4,
        splitArea: {
          areaStyle: {
            color: isDark
              ? ['rgba(255,255,255,0.01)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.01)', 'rgba(255,255,255,0.04)']
              : ['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.03)', 'rgba(0,0,0,0.01)', 'rgba(0,0,0,0.03)'],
          },
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
            width: 1,
          },
        },
        axisLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
            width: 1.5,
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: seriesData,
          emphasis: {
            lineStyle: {
              width: 2.5,
            },
            areaStyle: {
              color: `${PALACE_COLORS[data.palaces[0]?.name ?? '太和殿']}35`,
            },
          },
          animationDuration: 1000,
          animationEasing: 'cubicInOut',
        },
      ],
    };
  }, [data, isDark]);

  return (
    <ReactECharts
      echarts={null as unknown as typeof import('echarts')}
      option={option}
      style={{ height: '100%', width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
}

export default PalaceRadarChart;
