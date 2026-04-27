/**
 * Exhibition 配置数据
 */

import type { Chapter, DougongComponent } from './types';

/**
 * 章节数据 - 斗拱类型
 */
export const chapters: Chapter[] = [
  { id: 'zhong-gong-su-fang', label: '重栱素方' },
  { id: 'dai-ang-zhuan-jiao', label: '带昂转角铺作' },
  { id: 'shu-zhu-duo-ceng', label: '竖柱式多层' },
  { id: 'dan-qiao-wai-zhuai', label: '单翘外拽' },
  { id: 'dai-ang-bu-jian', label: '带昂补间铺作' },
  { id: 'qing-shi-dan-qiao', label: '清式单翘' },
  { id: 'zhong-gong-xia-ang', label: '重栱下昂' },
  { id: 'zhong-gong-zhong-ang', label: '重拱重昂' },
  { id: 'ru-yi', label: '如意' },
  { id: 'juan-yun-ling-gong', label: '卷云形令拱' },
  { id: 'yi-xing-da-dou', label: '异形大斗组合' },
  { id: 'lou-ge-ping-zuo', label: '楼阁平座' },
  { id: 'heng-gong-su-fang-2', label: '横拱素方' },
  { id: 'xie-xiang-ang-zui', label: '斜向昂嘴构件' },
  { id: 'zhong-gong-qi-xin', label: '重栱齐心' },
  { id: 'jian-hua-ling-gong', label: '简化令拱' },
  { id: 'zhong-gong-xia-ang-2', label: '重栱下昂' },
  { id: 'qing-shi-liu-jin', label: '清式溜金' },
  { id: 'pin-zi-ke', label: '品字科' },
  { id: 'duo-ceng-ping-zuo', label: '多层平座' },
  { id: 'gao-deng-ji-ping-zuo', label: '高等级平座' },
  { id: 'li-zhu-shi', label: '立柱式' },
  { id: 'ta-cha-ji-zuo', label: '塔刹基座' },
];

/**
 * 章节与 3D 模型映射
 */
export const chapterModelMap: Record<string, string> = {
  'zhong-gong-su-fang': 'R1L3',
  'dai-ang-zhuan-jiao': 'R1L4',
  'shu-zhu-duo-ceng': 'R1L5',
  'dan-qiao-wai-zhuai': 'R1L6',
  'dai-ang-bu-jian': 'R2L1',
  'qing-shi-dan-qiao': 'R2L2',
  'zhong-gong-xia-ang': 'R2L3',
  'zhong-gong-zhong-ang': 'R2L4',
  'ru-yi': 'R2L5',
  'juan-yun-ling-gong': 'R2L6',
  'yi-xing-da-dou': 'R3L1',
  'lou-ge-ping-zuo': 'R3L2',
  'heng-gong-su-fang-2': 'R3L3',
  'xie-xiang-ang-zui': 'R3L4',
  'zhong-gong-qi-xin': 'R3L5',
  'jian-hua-ling-gong': 'R3L6',
  'zhong-gong-xia-ang-2': 'R4L1',
  'qing-shi-liu-jin': 'R4L2',
  'pin-zi-ke': 'R5L1',
  'duo-ceng-ping-zuo': 'R5L2',
  'gao-deng-ji-ping-zuo': 'R5L3',
  'li-zhu-shi': 'R5L4',
  'ta-cha-ji-zuo': 'R5L5',
};

/**
 * 装饰文字列表 - 与章节对应
 */
export const decorativeChars: Record<string, string> = {
  'zhong-gong-su-fang': '重栱素方',
  'dai-ang-zhuan-jiao': '带昂转角铺作',
  'shu-zhu-duo-ceng': '竖柱式多层',
  'dan-qiao-wai-zhuai': '单翘外拽',
  'dai-ang-bu-jian': '带昂补间铺作',
  'qing-shi-dan-qiao': '清式单翘',
  'zhong-gong-xia-ang': '重栱下昂',
  'zhong-gong-zhong-ang': '重拱重昂',
  'ru-yi': '如意',
  'juan-yun-ling-gong': '卷云形令拱',
  'yi-xing-da-dou': '异形大斗组合',
  'lou-ge-ping-zuo': '楼阁平座',
  'heng-gong-su-fang-2': '横拱素方',
  'xie-xiang-ang-zui': '斜向昂嘴构件',
  'zhong-gong-qi-xin': '重栱齐心',
  'jian-hua-ling-gong': '简化令拱',
  'zhong-gong-xia-ang-2': '重栱下昂',
  'qing-shi-liu-jin': '清式溜金',
  'pin-zi-ke': '品字科',
  'duo-ceng-ping-zuo': '多层平座',
  'gao-deng-ji-ping-zuo': '高等级平座',
  'li-zhu-shi': '立柱式',
  'ta-cha-ji-zuo': '塔刹基座',
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
