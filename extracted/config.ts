/**
 * ===========================================
 * 主题配置 (Theme Configuration)
 * ===========================================
 *
 * 从 opening.html CSS变量提取的主题配置
 * 现代简约中国风 - 明亮清新
 */

export const theme = {
  colors: {
    bg: '#faf9f7',
    accent: '#1a1a1a',
    primary: '#b91c1c',        // 故宫红
    secondary: '#78716c',      // 石灰色
    goldAccent: '#b91c1c',
    darkBlue: '#1e3a5f',
    textMuted: '#78716c',
    lightAccent: '#f5f5f4',
    accentGlow: 'rgba(185, 28, 28, 0.1)',
  },

  // 尺寸变量
  sizing: {
    imgH: '70vh',
    imgW: '50vh',
    gap: '3vh',
  },

  // 字体
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    serif: "'Noto Serif SC', 'Songti SC', 'SimSun', serif",
    cursive: "'Ma Shan Zheng', cursive",
    display: "'Playfair Display', serif",
  },

  // 动画时长
  animation: {
    openingDuration: 4,        // 开场动画时长(秒)
    burstTime: 3.8,            // 闪光时间点
    fadeInDuration: 1.8,       // 淡入时长
    cardTransitionDuration: 0.8,
  },
} as const;

/**
 * ===========================================
 * 视频帧播放配置 (Video Frame Playback)
 * ===========================================
 */
export const videoConfig = {
  targetFps: 20,              // 每秒提取帧数
  keyFrameInterval: 1,        // 关键帧间隔(秒)
  maxCacheSize: 60,           // LRU缓存最大帧数
  scrollDriverHeight: '600vh', // 滚动驱动区域高度
  videoSrc: 'gugong.mp4',
} as const;

/**
 * ===========================================
 * 卡片配置 (Cards Configuration)
 * ===========================================
 */
export const cardConfig = {
  width: 280,
  height: 400,
  borderRadius: 16,
  splitDistance: 140,         // 分离距离
  fanSpreadDistance: 70,      // 展开距离
  fanAngle: 12,               // 展开角度
} as const;

/**
 * ===========================================
 * 滚动触发配置 (ScrollTrigger Configuration)
 * ===========================================
 */
export const scrollConfig = {
  // 白色遮罩淡出
  whiteMaskFade: {
    start: 'top top',
    end: '25% top',
    scrub: 1.5,
  },

  // 视频帧播放
  videoScrub: {
    scrub: 0.15,
  },

  // Dashboard出现
  dashboardAppear: {
    start: 'bottom 150%',
    end: 'bottom 100%',
    scrub: 1,
  },

  // 卡片分离动画
  cardSplit: {
    start: 'top bottom',
    end: 'center center',
    scrub: 1,
  },
} as const;

/**
 * ===========================================
 * 卡片数据 (Cards Data)
 * ===========================================
 */
export interface CardData {
  id: string;
  bigNum: string;
  title: string;
  subtitle: string;
  description: string;
  suit: string;
}

export const cardsData: CardData[] = [
  {
    id: 'poker-card-1',
    bigNum: '壹',
    title: '太和殿',
    subtitle: 'Hall of Supreme Harmony',
    description: '紫禁城中等级最高的建筑，举行盛大典礼的场所。',
    suit: '🏯',
  },
  {
    id: 'poker-card-2',
    bigNum: '贰',
    title: '琉璃瓦',
    subtitle: 'Glazed Tiles',
    description: '黄绿蓝三色琉璃，象征皇权与天地和谐。',
    suit: '⚱',
  },
  {
    id: 'poker-card-3',
    bigNum: '叁',
    title: '金丝楠',
    subtitle: 'Golden Phoebe',
    description: '珍贵木材构建栋梁，千年不腐，幽香阵阵。',
    suit: '📜',
  },
];

/**
 * ===========================================
 * 诗句数据 (Quotes Data)
 * ===========================================
 */
export const defaultQuotes = [
  '红墙宫里万重门，太和殿上紫云深。',
  '琉璃瓦上凝宿雨，金水河畔映残阳。',
  '雕梁画栋千秋意，玉砌雕栏万古情。',
];

/**
 * ===========================================
 * 瀑布流图片 (Waterfall Images)
 * ===========================================
 */
export const waterfallImages = [
  'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515405299443-f73bb32881fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1635492491273-455af7728453?auto=format&fit=crop&w=1200&q=80',
];

/**
 * ===========================================
 * 背景图片 (Background Images)
 * ===========================================
 */
export const backgroundImages = {
  main: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=95',
  dashboard: 'https://images.unsplash.com/photo-1584450150050-4b9bdb5be8a1?auto=format&fit=crop&w=1200&q=80',
};
