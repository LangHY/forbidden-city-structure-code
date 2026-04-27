/**
 * CollectionChart - 藏品统计图表
 *
 * 使用 ECharts 柱状图展示故宫博物院藏品分类统计
 * 支持主题切换、交互提示
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ThemeMode } from '../exhibition/types';

interface CollectionCategory {
  rank: number;
  name: string;
  count: number;
  percentage: number;
  description: string;
  icon: string;
}

interface CollectionData {
  title: string;
  total: number;
  categories: CollectionCategory[];
}

interface CollectionChartProps {
  data: CollectionData;
  theme: ThemeMode;
}

function CollectionChart({ data, theme }: CollectionChartProps) {
  const isDark = theme === 'dark';

  const option: EChartsOption = useMemo(() => {
    // 提取数据
    const categories = data.categories.slice(0, 8); // 只显示前8个
    const names = categories.map(c => c.name);
    const values = categories.map(c => c.count);
    const percentages = categories.map(c => c.percentage);

    // 颜色配置 - 故宫红金配色
    const colors = [
      '#B91C1C', // 红
      '#D97706', // 琥珀
      '#059669', // 绿
      '#7C3AED', // 紫
      '#0284C7', // 蓝
      '#DB2777', // 粉
      '#EA580C', // 橙
      '#4B5563', // 灰
    ];

    return {
      title: {
        text: `总计 ${data.total.toLocaleString()} 件`,
        left: 'center',
        top: 10,
        textStyle: {
          color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
          fontSize: 12,
          fontWeight: 400,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        textStyle: {
          color: isDark ? '#fff' : '#333',
        },
        formatter: (params: unknown) => {
          const p = params as Array<{ name: string; value: number; dataIndex: number }>;
          const item = p[0];
          const category = categories[item.dataIndex];
          return `
            <div style="padding: 4px 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${category.icon} ${item.name}</div>
              <div style="color: #888; font-size: 11px;">${category.description}</div>
              <div style="margin-top: 8px;">
                <span style="font-weight: 600; color: #B91C1C;">${item.value.toLocaleString()}</span> 件
                <span style="color: #888;">(${percentages[item.dataIndex]}%)</span>
              </div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '25%',
        top: '15%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
          fontSize: 10,
          interval: 0,
          rotate: 30,
        },
        axisLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          },
        },
        axisTick: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          fontSize: 10,
          formatter: (value: number) => {
            if (value >= 10000) return `${(value / 10000).toFixed(0)}万`;
            return value.toString();
          },
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: values.map((value, index) => ({
            value,
            itemStyle: {
              color: colors[index],
              borderRadius: [4, 4, 0, 0],
            },
          })),
          barWidth: '50%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(185, 28, 28, 0.3)',
            },
          },
          animationDelay: (idx: number) => idx * 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 50,
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

export default CollectionChart;
