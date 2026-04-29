/**
 * useChartData - 数据加载 Hook
 *
 * 用于加载本地 JSON/CSV 数据文件
 * 支持缓存，避免重复请求
 */

import { useState, useEffect } from 'react';

// 缓存对象
const dataCache = new Map<string, unknown>();

/**
 * 加载 JSON 数据
 */
export function useJsonData<T>(path: string): {
  data: T | null;
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 检查缓存
    if (dataCache.has(path)) {
      setData(dataCache.get(path) as T);
      setLoading(false);
      return;
    }

    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        return res.json();
      })
      .then(json => {
        dataCache.set(path, json);
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [path]);

  return { data, loading, error };
}

/**
 * 加载 CSV 数据
 */
export function useCsvData<T extends Record<string, string>>(path: string): {
  data: T[];
  loading: boolean;
  error: Error | null;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 检查缓存
    if (dataCache.has(path)) {
      setData(dataCache.get(path) as T[]);
      setLoading(false);
      return;
    }

    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${path}`);
        return res.text();
      })
      .then(text => {
        const lines = text.trim().split('\n');
        if (lines.length < 2) {
          setData([]);
          setLoading(false);
          return;
        }

        // 解析表头
        const headers = lines[0].split(',').map(h => h.trim());

        // 解析数据行
        const parsed: T[] = lines.slice(1).map(line => {
          const values = line.split(',');
          const row = {} as T;
          headers.forEach((header, i) => {
            (row as Record<string, string>)[header] = values[i]?.trim() || '';
          });
          return row;
        });

        dataCache.set(path, parsed);
        setData(parsed);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [path]);

  return { data, loading, error };
}

/**
 * 功能归类映射 - 将细分功能归类为6大类别
 */
export const FUNCTION_CATEGORIES: Record<string, string> = {
  // 朝会典礼
  '朝会大典': '朝会典礼',
  '皇帝登基': '朝会典礼',
  '接见使臣': '朝会典礼',
  '献俘典礼': '朝会典礼',
  '颁发诏书': '朝会典礼',
  '千叟宴': '朝会典礼',

  // 日常政务
  '皇帝休憩': '日常政务',
  '阅视祝文': '日常政务',
  '批阅奏章': '日常政务',
  '召见大臣': '日常政务',
  '御门听政': '日常政务',
  '皇帝办公': '日常政务',
  '召见军机': '日常政务',
  '殿试读卷': '日常政务',
  '编修书籍': '日常政务',
  '皇帝斋居': '日常政务',
  '经筵讲学': '日常政务',

  // 重要典礼
  '殿试宴席': '重要典礼',
  '册立太子': '重要典礼',
  '帝后大婚': '重要典礼',
  '太后寿诞': '重要典礼',

  // 居住生活
  '帝后寝宫': '居住生活',
  '皇后寝宫': '居住生活',
  '嫔妃居所': '居住生活',
  '太后居所': '居住生活',
  '太后休养': '居住生活',
  '慈禧寝宫': '居住生活',
  '外朝正门': '居住生活',
  '太上皇宫殿': '居住生活',

  // 祭祀宗教
  '祭祀神明': '祭祀宗教',
  '道教殿宇': '祭祀宗教',
  '祈雨祈福': '祭祀宗教',
  '祭祀祖先': '祭祀宗教',
  '皇帝祭祖': '祭祀宗教',

  // 日常出入
  '宫门正门': '日常出入',
  '东门出入': '日常出入',
  '西门出入': '日常出入',
  '北门出入': '日常出入',
  '物资运送': '日常出入',
  '日常物资': '日常出入',
  '官员出入': '日常出入',
};

/** 权重放大倍数，使流向线视觉更粗 */
const VALUE_SCALE = 3;

/** 核心宫殿列表 - 筛选后保留的15大宫殿 */
const CORE_BUILDINGS = [
  // 外朝三大殿
  '太和殿', '中和殿', '保和殿',
  // 内廷核心
  '乾清宫', '坤宁宫', '养心殿',
  // 宫门
  '午门', '神武门', '东华门', '西华门',
  // 后宫与祭祀
  '慈宁宫', '文华殿', '武英殿', '奉先殿', '储秀宫',
];

/**
 * 聚合桑基图数据 - 将细分功能归类并合并权重
 */
export function aggregateSankeyData(
  rawData: Array<{ source: string; target: string; value: string }>
): Array<{ source: string; target: string; value: string }> {
  // 1. 筛选核心宫殿
  const filteredData = rawData.filter(row => CORE_BUILDINGS.includes(row.source));

  // 2. 使用 Map 存储聚合后的链接，key = "source|target"
  const aggregatedMap = new Map<string, { source: string; target: string; value: number }>();

  filteredData.forEach(row => {
    // 将细分功能归类到大类
    const category = FUNCTION_CATEGORIES[row.target] || row.target;
    const key = `${row.source}|${category}`;

    const value = parseInt(row.value, 10) || 1;

    if (aggregatedMap.has(key)) {
      // 累加权重
      const existing = aggregatedMap.get(key)!;
      existing.value += value;
    } else {
      // 新建聚合节点
      aggregatedMap.set(key, {
        source: row.source,
        target: category,
        value,
      });
    }
  });

  // 3. 转换为数组，value 放大并转为字符串
  return Array.from(aggregatedMap.values()).map(item => ({
    source: item.source,
    target: item.target,
    value: String(item.value * VALUE_SCALE),
  }));
}

/**
 * 解析 CSV 为 Sankey 图表数据格式
 */
export function parseSankeyData(csvData: Array<{ source: string; target: string; value: string }>): {
  nodes: { name: string }[];
  links: { source: string; target: string; value: number }[];
} {
  const nodesSet = new Set<string>();
  const links: { source: string; target: string; value: number }[] = [];

  csvData.forEach(row => {
    nodesSet.add(row.source);
    nodesSet.add(row.target);
    links.push({
      source: row.source,
      target: row.target,
      value: parseInt(row.value, 10) || 1,
    });
  });

  return {
    nodes: Array.from(nodesSet).map(name => ({ name })),
    links,
  };
}

/**
 * 解析树形数据为 ECharts Tree 格式
 */
export function parseTreeData(
  data: Array<{ name: string; parent: string | null; value: number | null; description?: string }>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodeMap = new Map<string, any>();

  // 创建所有节点
  data.forEach(item => {
    nodeMap.set(item.name, {
      name: item.name,
      value: item.value || undefined,
      children: [],
      description: item.description,
    });
  });

  // 构建树形结构
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let root: any = null;

  data.forEach(item => {
    const node = nodeMap.get(item.name)!;
    if (item.parent === null) {
      root = node;
    } else {
      const parent = nodeMap.get(item.parent);
      if (parent) {
        parent.children.push(node);
      }
    }
  });

  return root || { name: 'root', children: [] };
}

export default {
  useJsonData,
  useCsvData,
  parseSankeyData,
  parseTreeData,
  aggregateSankeyData,
  FUNCTION_CATEGORIES,
};
