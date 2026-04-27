/**
 * BuildingRankChart - 建筑等级散点图
 *
 * 使用 ECharts Scatter 展示建筑等级与斗拱踩数关系
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ThemeMode } from '../exhibition/types';

interface BuildingRankData {
  '建筑名称': string;
  '斗拱踩数': string;
  '建筑高度(米)': string;
  '建筑等级': string;
  '建造年代': string;
  '用途类型': string;
}

interface BuildingRankChartProps {
  data: BuildingRankData[];
  theme: ThemeMode;
}

function BuildingRankChart({ data, theme }: BuildingRankChartProps) {
  const isDark = theme === 'dark';

  const option: EChartsOption = useMemo(() => {
    // 等级映射为数值
    const rankMap: Record<string, number> = {
      '最高等级': 5,
      '高等': 4,
      '中高': 3,
      '中等': 2,
      '较低': 1,
    };

    // 颜色映射
    const colorMap: Record<string, string> = {
      '最高等级': '#B91C1C',
      '高等': '#D97706',
      '中高': '#059669',
      '中等': '#0284C7',
      '较低': '#6B7280',
    };

    // 转换数据
    const seriesData = data.map(item => ({
      name: item['建筑名称'],
      value: [
        parseInt(item['斗拱踩数'], 10),
        parseFloat(item['建筑高度(米)']),
        rankMap[item['建筑等级']] || 2,
      ],
      itemStyle: {
        color: colorMap[item['建筑等级']] || '#6B7280',
      },
      rank: item['建筑等级'],
      usage: item['用途类型'],
    }));

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        textStyle: { color: isDark ? '#fff' : '#333' },
        formatter: (params: unknown) => {
          const p = params as { name: string; value: number[]; data: { rank: string; usage: string } };
          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${p.name}</div>
              <div style="font-size: 11px; color: #888;">斗拱踩数: ${p.value[0]} 踩</div>
              <div style="font-size: 11px; color: #888;">建筑高度: ${p.value[1]} 米</div>
              <div style="font-size: 11px; color: #888;">建筑等级: ${p.data.rank}</div>
              <div style="font-size: 11px; color: #888;">用途: ${p.data.usage}</div>
            </div>
          `;
        },
      },
      legend: {
        data: ['最高等级', '高等', '中高', '中等', '较低'],
        bottom: 10,
        textStyle: {
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          fontSize: 10,
        },
        itemWidth: 10,
        itemHeight: 10,
      },
      grid: {
        left: '8%',
        right: '8%',
        bottom: '20%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'value',
        name: '斗拱踩数',
        nameLocation: 'middle',
        nameGap: 25,
        nameTextStyle: {
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontSize: 11,
        },
        min: 3,
        max: 13,
        axisLabel: {
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: 10,
        },
        axisLine: {
          lineStyle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
        },
        splitLine: {
          lineStyle: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
        },
      },
      yAxis: {
        type: 'value',
        name: '建筑高度(米)',
        nameLocation: 'middle',
        nameGap: 35,
        nameTextStyle: {
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontSize: 11,
        },
        axisLabel: {
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: 10,
        },
        axisLine: {
          lineStyle: { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' },
        },
        splitLine: {
          lineStyle: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
        },
      },
      series: [
        {
          type: 'scatter',
          symbolSize: (val: number[]) => 10 + val[2] * 4,
          data: seriesData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(185, 28, 28, 0.5)',
            },
          },
          animationDelay: (idx: number) => idx * 50,
        },
      ],
      animationEasing: 'elasticOut',
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

export default BuildingRankChart;
