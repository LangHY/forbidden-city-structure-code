/**
 * SankeyChart - 功能流向桑基图
 *
 * 使用 ECharts Sankey 展示建筑功能与斗拱规格流向
 * 已优化：6大功能类别归类，流向更明显
 */

import { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { ThemeMode } from '../exhibition/types';
import { parseSankeyData } from '@/hooks/useChartData';

interface SankeyRow {
  source: string;
  target: string;
  value: string;
}

interface SankeyChartProps {
  data: SankeyRow[];
  theme: ThemeMode;
}

/** 6大功能类别颜色 */
const CATEGORY_COLORS: Record<string, string> = {
  '朝会典礼': '#B91C1C',
  '日常政务': '#1E40AF',
  '重要典礼': '#D97706',
  '居住生活': '#7C3AED',
  '祭祀宗教': '#059669',
  '日常出入': '#6B7280',
};

/** 核心宫殿颜色（15个） */
const BUILDING_COLORS: Record<string, string> = {
  // 外朝三大殿
  '太和殿': '#B91C1C',
  '中和殿': '#D97706',
  '保和殿': '#059669',
  // 内廷核心
  '乾清宫': '#1E40AF',
  '坤宁宫': '#7C3AED',
  '养心殿': '#0D9488',
  // 宫门
  '午门': '#DC2626',
  '神武门': '#0891B2',
  '东华门': '#65A30D',
  '西华门': '#A16207',
  // 后宫与祭祀
  '慈宁宫': '#C2410C',
  '文华殿': '#4F46E5',
  '武英殿': '#15803D',
  '奉先殿': '#9A3412',
  '储秀宫': '#DB2777',
};

function getNodeColor(name: string): string {
  return BUILDING_COLORS[name] ?? CATEGORY_COLORS[name] ?? '#B91C1C';
}

/** 判断是否为功能类别节点（右侧） */
function isCategoryNode(name: string): boolean {
  return name in CATEGORY_COLORS;
}

function SankeyChart({ data, theme }: SankeyChartProps) {
  const isDark = theme === 'dark';

  const option: EChartsOption = useMemo(() => {
    const { nodes, links } = parseSankeyData(data);

    // 节点样式：左侧宫殿标签在左边，右侧功能类别标签在右边
    const nodesWithStyle = nodes.map(node => {
      const isCategory = isCategoryNode(node.name);
      return {
        ...node,
        itemStyle: {
          color: getNodeColor(node.name),
          borderWidth: 0,
        },
        label: {
          show: true,
          position: isCategory ? 'right' as const : 'left' as const,
          color: isDark ? '#fff' : '#333',
          fontSize: isCategory ? 18 : 16,
          fontWeight: isCategory ? ('bold' as const) : ('normal' as const),
          fontFamily: 'DingLieXiDaTi, serif',
        },
      };
    });

    // 流向线样式：加粗、高透明度
    const linksWithStyle = links.map(link => ({
      ...link,
      lineStyle: {
        color: getNodeColor(link.source),
        opacity: 0.55,
        curveness: 0.5,
      },
    }));

    return {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(255,255,255,0.95)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        textStyle: { color: isDark ? '#fff' : '#333', fontSize: 16, fontFamily: 'DingLieXiDaTi, serif' },
        formatter: (params: unknown) => {
          const p = params as { dataType: string; name: string; data: { source?: string; target?: string; value?: number } };
          if (p.dataType === 'edge') {
            return `<div style="padding:4px 8px;font-family:DingLieXiDaTi,serif;font-size:16px;">${p.data.source} → ${p.data.target}<br/>权重: ${p.data.value}</div>`;
          }
          return `<div style="padding:4px 8px;font-family:DingLieXiDaTi,serif;font-size:16px;">${p.name}</div>`;
        },
      },
      series: [
        {
          type: 'sankey',
          data: nodesWithStyle,
          links: linksWithStyle,
          top: '2%',
          bottom: '2%',
          left: '12%',  // 左侧留空间给宫殿名
          right: '12%', // 右侧留空间给功能类别名
          nodeWidth: 32,
          nodeGap: 6,
          layoutIterations: 48,
          orient: 'horizontal',
          // 左右分层配置
          levels: [
            {
              depth: 0, // 建筑侧（左侧）
              nodeGap: 6,
              nodeWidth: 28,
              label: {
                position: 'left',
                fontFamily: 'DingLieXiDaTi, serif',
                fontSize: 16,
              },
            },
            {
              depth: 1, // 功能类别侧（右侧）
              nodeGap: 0, // 无间隙，形成连续色块
              nodeWidth: 56, // 更宽，形成色块效果
              label: {
                position: 'right',
                fontFamily: 'DingLieXiDaTi, serif',
                fontSize: 18,
                fontWeight: 'bold',
              },
              itemStyle: {
                borderWidth: 0,
              },
            },
          ],
          lineStyle: {
            color: 'source',
            curveness: 0.5,
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: {
              opacity: 0.75,
            },
          },
          animationDuration: 800,
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

export default SankeyChart;
