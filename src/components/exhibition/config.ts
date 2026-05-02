/**
 * Exhibition 配置数据
 */

import type { Chapter, DougongComponent, DougongExplosionConfig } from './types';

/**
 * 章节数据 - 斗拱类型
 */
export const chapters: Chapter[] = [
  { id: 'zhong-gong-su-fang', label: '重栱素方' },
  { id: 'dai-ang-zhuan-jiao', label: '带昂转角铺作' },
  { id: 'dai-ang-bu-jian', label: '带昂补间铺作' },
  { id: 'qing-shi-dan-qiao', label: '清式单翘' },
  { id: 'zhong-gong-xia-ang', label: '重栱下昂' },
  { id: 'zhong-gong-zhong-ang', label: '重拱重昂' },
  { id: 'ru-yi', label: '如意' },
  { id: 'xie-xiang-ang-zui', label: '斜向昂嘴构件' },
  { id: 'zhong-gong-qi-xin', label: '重栱齐心' },
  { id: 'jian-hua-ling-gong', label: '简化令拱' },
  { id: 'zhong-gong-xia-ang-2', label: '重栱下昂' },
  { id: 'qing-shi-liu-jin', label: '清式溜金' },
];

/**
 * 章节与 3D 模型映射
 */
export const chapterModelMap: Record<string, string> = {
  'zhong-gong-su-fang': 'R1L3',
  'dai-ang-zhuan-jiao': 'R1L4',
  'dai-ang-bu-jian': 'R2L1',
  'qing-shi-dan-qiao': 'R2L2',
  'zhong-gong-xia-ang': 'R2L3',
  'zhong-gong-zhong-ang': 'R2L4',
  'ru-yi': 'R2L5',
  'xie-xiang-ang-zui': 'R3L4',
  'zhong-gong-qi-xin': 'R3L5',
  'jian-hua-ling-gong': 'R3L6',
  'zhong-gong-xia-ang-2': 'R4L1',
  'qing-shi-liu-jin': 'R4L2',
};

/**
 * 装饰文字列表 - 与章节对应
 */
export const decorativeChars: Record<string, string> = {
  'zhong-gong-su-fang': '重栱素方',
  'dai-ang-zhuan-jiao': '带昂转角铺作',
  'dai-ang-bu-jian': '带昂补间铺作',
  'qing-shi-dan-qiao': '清式单翘',
  'zhong-gong-xia-ang': '重栱下昂',
  'zhong-gong-zhong-ang': '重拱重昂',
  'ru-yi': '如意',
  'xie-xiang-ang-zui': '斜向昂嘴构件',
  'zhong-gong-qi-xin': '重栱齐心',
  'jian-hua-ling-gong': '简化令拱',
  'zhong-gong-xia-ang-2': '重栱下昂',
  'qing-shi-liu-jin': '清式溜金',
};

/**
 * 默认装饰文字
 */
export const decorativeChar = '斗拱';

/**
 * 斗拱组件数据
 */
export const dougongComponents: DougongComponent[] = [
  { id: 'lu-dou', name: '栌斗', nameEn: 'Lu Dou', desc: '基础底座' },
  { id: 'heng-gong', name: '横拱', nameEn: 'Heng Gong', desc: '横向支撑' },
  { id: 'ang', name: '昂', nameEn: 'Ang', desc: '斜向伸出' },
];

/**
 * 导航链接
 */
export const navLinks: { label: string; href: string }[] = [];

/**
 * 文物来源
 */
export const artifactInfo = {
  name: '故宫太和殿',
  nameEn: 'Forbidden City',
};

/**
 * 斗拱图片 URL
 */
export const dougongImageUrl =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCOKK9gqHYJqTipSbwCRqfLwYNkat0_nhg65Y-R8stIg3Mr6TWGe9cd4kAdUaII0vsmJVOoFgI57cLq5JNHsoLg0YGN1AgsVvUaphls0RlitIDxRiCXhK5WGMeOdR_rCoQN2tM_bBodoCaBBeN0BJ-xAgiRFHkN7zj1-rUWsryd0AFcrZ_PbiZV2VuwFrMBZ0qmaOGVoi-9NMG5_ye2vnKl2IuDjhRvDUNyydWqZHPhCsWCwk5fYyLV6c9g2UEduJ9Qk0RHHmPj2T4';

/**
 * 标题和描述
 */
export const exhibitionContent = {
  title: '斗拱结构解析',
  description:
    '斗拱是中国建筑特有的一种结构，位于柱子顶端，由斗、拱、翘、昂组成。它承载着梁架传递下来的荷载，并将其均匀地分散到柱头上。',
};

/**
 * 爆炸图元数据配置
 * index 对应 GLB 加载后 scene.children 数组的顺序
 * direction 是归一化向量，从模型中心指向外
 * distance 是爆炸偏移量（模型缩放后约 4 单位大小）
 */
export const explodedViewConfigs: Record<string, DougongExplosionConfig> = {
  // R1L3（重栱素方）— 7 个构件（手动调优）
  'zhong-gong-su-fang': {
    chapterId: 'zhong-gong-su-fang',
    modelId: 'R1L3',
    components: [
      // 向下扩散 — 拉开高度差
      { index: 0, direction: [0, -1, 0], distance: 10.0 },
      { index: 1, direction: [0, -1, 0], distance: 20.0 },
      { index: 5, direction: [0, -1, 0], distance: 32.0 },
      { index: 6, direction: [0, -1, 0], distance: 46.0 },
      // 向不同方向扩散
      { index: 2, direction: [1, 0, 0],  distance: 20.0 },
      { index: 3, direction: [-1, 0, 0], distance: 20.0 },
      { index: 4, direction: [0, 0, 1],  distance: 20.0 },
    ],
  },

  // R1L4（带昂转角铺作）— 11 个构件
  'dai-ang-zhuan-jiao': {
    chapterId: 'dai-ang-zhuan-jiao',
    modelId: 'R1L4',
    components: [
      { index: 0, direction: [-0.8, 0, -0.59], distance: 14.9 },
      { index: 1, direction: [0, 0.8, -0.59], distance: 14.9 },
      { index: 2, direction: [0.81, 0, -0.59], distance: 15.0 },
      { index: 3, direction: [0, -0.81, -0.59], distance: 15.0 },
      { index: 4, direction: [0.86, 0, 0.51], distance: 14.4 },
      { index: 5, direction: [-0.86, 0, 0.51], distance: 14.3 },
      { index: 6, direction: [0.01, 0.86, 0.51], distance: 14.3 },
      { index: 7, direction: [0, -0.86, 0.51], distance: 14.3 },
      { index: 8, direction: [0.02, 0.17, -0.98], distance: 7.0 },
      { index: 9, direction: [-0.24, -0.02, -0.97], distance: 7.0 },
      { index: 10, direction: [0.01, 0, 1.0], distance: 13.5 },
    ],
  },

  // R2L1（带昂补间铺作）— 12 个构件
  'dai-ang-bu-jian': {
    chapterId: 'dai-ang-bu-jian',
    modelId: 'R2L1',
    components: [
      { index: 0, direction: [-0.24, 0, -0.97], distance: 13.8 },
      { index: 1, direction: [0.45, 0, 0.89], distance: 5.9 },
      { index: 2, direction: [0.05, 0, -1.0], distance: 13.6 },
      { index: 3, direction: [0.45, 0, 0.89], distance: 5.9 },
      { index: 4, direction: [0.08, 0, 1.0], distance: 10.5 },
      { index: 5, direction: [0.04, 0, 1.0], distance: 15.0 },
      { index: 6, direction: [0.04, 0, 1.0], distance: 15.0 },
      { index: 7, direction: [0.08, 0, 1.0], distance: 10.5 },
      { index: 8, direction: [0.45, 0, 0.89], distance: 5.9 },
      { index: 9, direction: [0.05, 0, -1.0], distance: 13.6 },
      { index: 10, direction: [0.45, 0, 0.89], distance: 5.9 },
      { index: 11, direction: [-0.24, 0, -0.97], distance: 13.8 },
    ],
  },

  // R2L2（清式单翘）— 8 个构件
  'qing-shi-dan-qiao': {
    chapterId: 'qing-shi-dan-qiao',
    modelId: 'R2L2',
    components: [
      { index: 0, direction: [0.7, 0, 0.71], distance: 9.3 },
      { index: 1, direction: [0.52, 0, 0.85], distance: 10.8 },
      { index: 2, direction: [0.7, 0, 0.71], distance: 9.3 },
      { index: 3, direction: [1.0, 0, 0.01], distance: 8.0 },
      { index: 4, direction: [1.0, 0, 0.01], distance: 6.3 },
      { index: 5, direction: [-0.87, 0, -0.49], distance: 10.3 },
      { index: 6, direction: [-0.82, 0, -0.57], distance: 15.0 },
      { index: 7, direction: [-0.18, 0, -0.98], distance: 7.8 },
    ],
  },

  // R2L3（重栱下昂）— 26 个构件
  'zhong-gong-xia-ang': {
    chapterId: 'zhong-gong-xia-ang',
    modelId: 'R2L3',
    components: [
      { index: 0, direction: [0.01, 0.01, 1.0], distance: 9.8 },
      { index: 1, direction: [0, 1.0, -0.09], distance: 9.2 },
      { index: 2, direction: [0, -1.0, -0.09], distance: 9.2 },
      { index: 3, direction: [0, 0.96, -0.29], distance: 12.9 },
      { index: 4, direction: [0, -0.96, -0.29], distance: 12.9 },
      { index: 5, direction: [-0.01, -0.7, 0.72], distance: 9.0 },
      { index: 6, direction: [-0.01, 0.7, 0.71], distance: 9.1 },
      { index: 7, direction: [-0.01, -0.98, 0.2], distance: 9.9 },
      { index: 8, direction: [-0.01, 0.98, 0.19], distance: 10.0 },
      { index: 9, direction: [-0.04, -0.02, 1.0], distance: 6.2 },
      { index: 10, direction: [-1.0, -0.01, -0.07], distance: 10.3 },
      { index: 11, direction: [1.0, -0.01, -0.07], distance: 10.3 },
      { index: 12, direction: [-0.97, 0, -0.23], distance: 15.0 },
      { index: 13, direction: [0.97, 0, -0.23], distance: 15.0 },
      { index: 14, direction: [-0.7, -0.01, 0.72], distance: 9.0 },
      { index: 15, direction: [0.7, -0.01, 0.71], distance: 9.1 },
      { index: 16, direction: [-0.98, -0.01, 0.19], distance: 9.9 },
      { index: 17, direction: [0.98, -0.01, 0.19], distance: 10.0 },
      { index: 18, direction: [0.77, -0.64, -0.06], distance: 11.5 },
      { index: 19, direction: [0.77, 0.64, -0.06], distance: 11.5 },
      { index: 20, direction: [0.53, -0.81, -0.25], distance: 14.2 },
      { index: 21, direction: [0.53, 0.81, -0.25], distance: 14.3 },
      { index: 22, direction: [-0.77, -0.64, -0.06], distance: 11.5 },
      { index: 23, direction: [-0.77, 0.64, -0.06], distance: 11.5 },
      { index: 24, direction: [-0.53, -0.81, -0.25], distance: 14.2 },
      { index: 25, direction: [-0.52, 0.81, -0.25], distance: 14.3 },
    ],
  },

  // R2L4（重拱重昂）— 10 个构件
  'zhong-gong-zhong-ang': {
    chapterId: 'zhong-gong-zhong-ang',
    modelId: 'R2L4',
    components: [
      { index: 0, direction: [0.02, 0.01, 1.0], distance: 10.3 },
      { index: 1, direction: [-0.03, -0.03, -1.0], distance: 6.9 },
      { index: 2, direction: [-0.97, -0.01, 0.26], distance: 10.8 },
      { index: 3, direction: [0.97, -0.01, 0.25], distance: 10.9 },
      { index: 4, direction: [-0.97, -0.01, -0.24], distance: 14.9 },
      { index: 5, direction: [0.97, -0.01, -0.24], distance: 15.0 },
      { index: 6, direction: [-0.01, -0.97, 0.26], distance: 10.8 },
      { index: 7, direction: [-0.01, 0.97, 0.25], distance: 10.9 },
      { index: 8, direction: [-0.01, -0.97, -0.24], distance: 14.9 },
      { index: 9, direction: [-0.01, 0.97, -0.23], distance: 15.0 },
    ],
  },

  // R2L5（如意）— 20 个构件
  'ru-yi': {
    chapterId: 'ru-yi',
    modelId: 'R2L5',
    components: [
      { index: 0, direction: [0, 0.22, 0.98], distance: 10.0 },
      { index: 1, direction: [0.87, 0.2, -0.46], distance: 10.5 },
      { index: 2, direction: [-0.87, 0.2, -0.46], distance: 10.5 },
      { index: 3, direction: [0.96, 0.11, -0.25], distance: 15.0 },
      { index: 4, direction: [0, 0.92, -0.39], distance: 11.4 },
      { index: 5, direction: [-0.96, 0.11, -0.25], distance: 15.0 },
      { index: 6, direction: [0, 0.4, -0.92], distance: 7.8 },
      { index: 7, direction: [0, -0.83, -0.56], distance: 9.5 },
      { index: 8, direction: [0.89, 0.2, 0.42], distance: 10.4 },
      { index: 9, direction: [-0.89, 0.2, 0.42], distance: 10.4 },
      { index: 10, direction: [0, 0.22, 0.98], distance: 10.0 },
      { index: 11, direction: [-0.73, -0.56, -0.39], distance: 11.6 },
      { index: 12, direction: [0.73, -0.56, -0.39], distance: 11.6 },
      { index: 13, direction: [0, 1.0, 0.06], distance: 6.1 },
      { index: 14, direction: [0, -0.85, 0.52], distance: 9.4 },
      { index: 15, direction: [0, 0.15, 0.99], distance: 12.2 },
      { index: 16, direction: [0, 0.43, 0.9], distance: 7.5 },
      { index: 17, direction: [0, -1.0, 0.02], distance: 8.7 },
      { index: 18, direction: [0, 0.3, -0.95], distance: 8.7 },
      { index: 19, direction: [0, -0.99, 0.17], distance: 6.6 },
    ],
  },

  // R3L4（斜向昂嘴构件）— 20 个构件
  'xie-xiang-ang-zui': {
    chapterId: 'xie-xiang-ang-zui',
    modelId: 'R3L4',
    components: [
      { index: 0, direction: [0.22, 0, 0.98], distance: 10.0 },
      { index: 1, direction: [0.2, -0.87, -0.46], distance: 10.5 },
      { index: 2, direction: [0.2, 0.87, -0.46], distance: 10.5 },
      { index: 3, direction: [0.11, -0.96, -0.25], distance: 15.0 },
      { index: 4, direction: [0.92, 0, -0.39], distance: 11.4 },
      { index: 5, direction: [0.11, 0.96, -0.25], distance: 15.0 },
      { index: 6, direction: [0.4, 0, -0.92], distance: 7.8 },
      { index: 7, direction: [-0.83, 0, -0.56], distance: 9.5 },
      { index: 8, direction: [0.2, -0.89, 0.42], distance: 10.4 },
      { index: 9, direction: [0.2, 0.89, 0.42], distance: 10.4 },
      { index: 10, direction: [0.22, 0, 0.98], distance: 10.0 },
      { index: 11, direction: [-0.56, 0.73, -0.39], distance: 11.6 },
      { index: 12, direction: [-0.56, -0.73, -0.39], distance: 11.6 },
      { index: 13, direction: [1.0, 0, 0.06], distance: 6.1 },
      { index: 14, direction: [-0.85, 0, 0.52], distance: 9.4 },
      { index: 15, direction: [0.15, 0, 0.99], distance: 12.2 },
      { index: 16, direction: [0.43, 0, 0.9], distance: 7.5 },
      { index: 17, direction: [-1.0, 0, 0.02], distance: 8.7 },
      { index: 18, direction: [0.3, 0, -0.95], distance: 8.7 },
      { index: 19, direction: [-0.99, 0, 0.17], distance: 6.6 },
    ],
  },

  // R3L5（重栱齐心）— 34 个构件
  'zhong-gong-qi-xin': {
    chapterId: 'zhong-gong-qi-xin',
    modelId: 'R3L5',
    components: [
      { index: 0, direction: [0.51, 0, -0.86], distance: 9.0 },
      { index: 1, direction: [-0.8, 0, -0.61], distance: 6.5 },
      { index: 2, direction: [-0.66, 0, 0.75], distance: 8.2 },
      { index: 3, direction: [0.01, 0, -1.0], distance: 12.3 },
      { index: 4, direction: [-0.99, 0, -0.13], distance: 8.8 },
      { index: 5, direction: [-0.87, 0, 0.49], distance: 9.3 },
      { index: 6, direction: [0.88, 0, 0.47], distance: 9.5 },
      { index: 7, direction: [-1.0, 0, -0.06], distance: 12.7 },
      { index: 8, direction: [0.99, 0, -0.12], distance: 9.0 },
      { index: 9, direction: [0.93, 0, -0.36], distance: 13.5 },
      { index: 10, direction: [-0.33, 0, 0.94], distance: 10.3 },
      { index: 11, direction: [0.02, 0, 1.0], distance: 10.9 },
      { index: 12, direction: [0.02, 0, 1.0], distance: 9.3 },
      { index: 13, direction: [0.06, 0, 1.0], distance: 6.7 },
      { index: 14, direction: [-1.0, 0, 0.07], distance: 12.7 },
      { index: 15, direction: [0.97, 0, -0.25], distance: 13.1 },
      { index: 16, direction: [-0.74, -0.66, 0.11], distance: 10.1 },
      { index: 17, direction: [0.02, -0.73, 0.68], distance: 9.6 },
      { index: 18, direction: [0.02, 0.73, 0.68], distance: 9.6 },
      { index: 19, direction: [0.02, 0.99, 0.1], distance: 10.4 },
      { index: 20, direction: [0.02, -0.99, 0.1], distance: 10.4 },
      { index: 21, direction: [-0.55, -0.78, -0.3], distance: 11.9 },
      { index: 22, direction: [0.76, -0.64, 0.1], distance: 10.3 },
      { index: 23, direction: [-0.86, -0.45, -0.23], distance: 13.9 },
      { index: 24, direction: [-0.86, 0.45, -0.23], distance: 13.9 },
      { index: 25, direction: [-0.55, 0.78, -0.3], distance: 11.9 },
      { index: 26, direction: [-0.74, 0.66, 0.11], distance: 10.1 },
      { index: 27, direction: [0.76, 0.64, 0.1], distance: 10.3 },
      { index: 28, direction: [0.57, 0.76, -0.29], distance: 12.0 },
      { index: 29, direction: [0.57, -0.76, -0.29], distance: 12.0 },
      { index: 30, direction: [0.79, -0.4, -0.46], distance: 15.0 },
      { index: 31, direction: [0.79, 0.4, -0.46], distance: 15.0 },
      { index: 32, direction: [-0.77, 0, 0.64], distance: 9.9 },
      { index: 33, direction: [0.79, 0, 0.62], distance: 10.1 },
    ],
  },

  // R3L6（简化令拱）— 34 个构件
  'jian-hua-ling-gong': {
    chapterId: 'jian-hua-ling-gong',
    modelId: 'R3L6',
    components: [
      { index: 0, direction: [0, -0.51, -0.86], distance: 9.0 },
      { index: 1, direction: [0, 0.8, -0.61], distance: 6.5 },
      { index: 2, direction: [0, 0.66, 0.75], distance: 8.2 },
      { index: 3, direction: [0, -0.01, -1.0], distance: 12.3 },
      { index: 4, direction: [0, 0.99, -0.13], distance: 8.8 },
      { index: 5, direction: [0, 0.87, 0.49], distance: 9.3 },
      { index: 6, direction: [0, -0.88, 0.47], distance: 9.5 },
      { index: 7, direction: [0, 1.0, -0.06], distance: 12.7 },
      { index: 8, direction: [0, -0.99, -0.12], distance: 9.0 },
      { index: 9, direction: [0, -0.93, -0.36], distance: 13.5 },
      { index: 10, direction: [0, 0.33, 0.94], distance: 10.3 },
      { index: 11, direction: [0, -0.02, 1.0], distance: 10.9 },
      { index: 12, direction: [0, -0.02, 1.0], distance: 9.3 },
      { index: 13, direction: [0, -0.06, 1.0], distance: 6.7 },
      { index: 14, direction: [0, 1.0, 0.07], distance: 12.7 },
      { index: 15, direction: [0, -0.97, -0.25], distance: 13.1 },
      { index: 16, direction: [-0.66, 0.74, 0.11], distance: 10.1 },
      { index: 17, direction: [-0.73, -0.02, 0.68], distance: 9.6 },
      { index: 18, direction: [0.73, -0.02, 0.68], distance: 9.6 },
      { index: 19, direction: [0.99, -0.02, 0.1], distance: 10.4 },
      { index: 20, direction: [-0.99, -0.02, 0.1], distance: 10.4 },
      { index: 21, direction: [-0.78, 0.55, -0.3], distance: 11.9 },
      { index: 22, direction: [-0.64, -0.76, 0.1], distance: 10.3 },
      { index: 23, direction: [-0.45, 0.86, -0.23], distance: 13.9 },
      { index: 24, direction: [0.45, 0.86, -0.23], distance: 13.9 },
      { index: 25, direction: [0.78, 0.55, -0.3], distance: 11.9 },
      { index: 26, direction: [0.66, 0.74, 0.11], distance: 10.1 },
      { index: 27, direction: [0.64, -0.76, 0.1], distance: 10.3 },
      { index: 28, direction: [0.76, -0.57, -0.29], distance: 12.0 },
      { index: 29, direction: [-0.76, -0.57, -0.29], distance: 12.0 },
      { index: 30, direction: [-0.4, -0.79, -0.46], distance: 15.0 },
      { index: 31, direction: [0.4, -0.79, -0.46], distance: 15.0 },
      { index: 32, direction: [0, 0.77, 0.64], distance: 9.9 },
      { index: 33, direction: [0, -0.79, 0.62], distance: 10.1 },
    ],
  },

  // R4L1（重栱下昂2）— 52 个构件
  'zhong-gong-xia-ang-2': {
    chapterId: 'zhong-gong-xia-ang-2',
    modelId: 'R4L1',
    components: [
      { index: 0, direction: [0, -0.01, -1.0], distance: 6.7 },
      { index: 1, direction: [0.33, -0.9, -0.28], distance: 11.0 },
      { index: 2, direction: [0.38, -0.86, -0.34], distance: 13.0 },
      { index: 3, direction: [-0.32, -0.9, -0.28], distance: 11.0 },
      { index: 4, direction: [-0.38, -0.86, -0.34], distance: 13.0 },
      { index: 5, direction: [0, -0.93, -0.37], distance: 12.4 },
      { index: 6, direction: [0, -0.93, -0.38], distance: 13.9 },
      { index: 7, direction: [-0.37, -0.25, 0.9], distance: 8.9 },
      { index: 8, direction: [0.37, -0.25, 0.9], distance: 8.9 },
      { index: 9, direction: [0, -0.31, 0.95], distance: 8.1 },
      { index: 10, direction: [0, 0.93, -0.37], distance: 9.6 },
      { index: 11, direction: [0.79, 0.6, 0.13], distance: 12.1 },
      { index: 12, direction: [0, 1.0, 0.04], distance: 9.3 },
      { index: 13, direction: [0, 0.9, 0.43], distance: 9.7 },
      { index: 14, direction: [0, 0.74, 0.67], distance: 10.7 },
      { index: 15, direction: [0.85, 0.51, -0.11], distance: 13.4 },
      { index: 16, direction: [0.86, 0.43, -0.28], distance: 15.0 },
      { index: 17, direction: [0.63, 0.65, 0.42], distance: 11.6 },
      { index: 18, direction: [-0.63, 0.65, 0.42], distance: 11.6 },
      { index: 19, direction: [-0.79, 0.6, 0.13], distance: 12.1 },
      { index: 20, direction: [-0.85, 0.51, -0.11], distance: 13.4 },
      { index: 21, direction: [-0.86, 0.43, -0.28], distance: 15.0 },
      { index: 22, direction: [0, -0.49, -0.87], distance: 6.9 },
      { index: 23, direction: [0, -0.99, 0.16], distance: 6.0 },
      { index: 24, direction: [0, -0.43, 0.9], distance: 7.2 },
      { index: 25, direction: [-0.94, -0.24, 0.23], distance: 9.1 },
      { index: 26, direction: [-0.98, -0.16, -0.15], distance: 11.0 },
      { index: 27, direction: [-0.94, -0.11, -0.33], distance: 13.5 },
      { index: 28, direction: [0.94, -0.24, 0.23], distance: 9.1 },
      { index: 29, direction: [0.97, -0.16, -0.15], distance: 11.0 },
      { index: 30, direction: [0.94, -0.11, -0.33], distance: 13.5 },
      { index: 31, direction: [0, -0.92, -0.4], distance: 9.3 },
      { index: 32, direction: [-0.77, -0.52, -0.36], distance: 12.6 },
      { index: 33, direction: [0.77, -0.52, -0.36], distance: 12.6 },
      { index: 34, direction: [0, 0.16, 0.99], distance: 10.3 },
      { index: 35, direction: [0, 0.53, 0.85], distance: 9.5 },
      { index: 36, direction: [0, -0.79, 0.62], distance: 7.9 },
      { index: 37, direction: [-0.41, -0.68, 0.61], distance: 7.9 },
      { index: 38, direction: [0.41, -0.68, 0.61], distance: 7.9 },
      { index: 39, direction: [0, 0.99, 0.11], distance: 6.5 },
      { index: 40, direction: [0, -0.98, -0.2], distance: 8.9 },
      { index: 41, direction: [0.6, -0.78, -0.18], distance: 10.1 },
      { index: 42, direction: [0.63, -0.77, 0.05], distance: 8.1 },
      { index: 43, direction: [-0.63, -0.78, 0.05], distance: 8.1 },
      { index: 44, direction: [-0.6, -0.78, -0.18], distance: 10.1 },
      { index: 45, direction: [0, 0.98, 0.18], distance: 9.4 },
      { index: 46, direction: [0, 0.83, 0.56], distance: 8.6 },
      { index: 47, direction: [0, -0.01, -1.0], distance: 8.3 },
      { index: 48, direction: [0, 0.94, -0.34], distance: 11.0 },
      { index: 49, direction: [0, 1.0, -0.03], distance: 10.6 },
      { index: 50, direction: [0, 0.96, 0.28], distance: 10.9 },
      { index: 51, direction: [0, 0.86, 0.52], distance: 11.6 },
    ],
  },

  // R4L2（清式溜金）— 12 个构件
  'qing-shi-liu-jin': {
    chapterId: 'qing-shi-liu-jin',
    modelId: 'R4L2',
    components: [
      { index: 0, direction: [0, 0, 1.0], distance: 11.4 },
      { index: 1, direction: [0, 0.97, -0.23], distance: 15.0 },
      { index: 2, direction: [0, -0.97, -0.23], distance: 14.9 },
      { index: 3, direction: [0, 0.19, 0.98], distance: 5.1 },
      { index: 4, direction: [0, 0.01, 1.0], distance: 8.5 },
      { index: 5, direction: [0, 0, 1.0], distance: 8.5 },
      { index: 6, direction: [0.75, 0.59, -0.29], distance: 12.9 },
      { index: 7, direction: [0.75, -0.59, -0.29], distance: 12.9 },
      { index: 8, direction: [1.0, 0, 0.02], distance: 11.0 },
      { index: 9, direction: [-0.75, -0.6, -0.29], distance: 13.0 },
      { index: 10, direction: [-0.76, 0.59, -0.29], distance: 12.9 },
      { index: 11, direction: [-1.0, -0.01, 0.02], distance: 11.0 },
    ],
  },
};

/**
 * 根据构件数返回难度标示
 */
export function getDifficultyLabel(componentCount: number): string {
  if (componentCount <= 12) return '★';
  if (componentCount <= 26) return '★★★';
  if (componentCount <= 34) return '★★★★';
  return '★★★★★';
}
