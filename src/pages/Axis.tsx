/**
 * Axis - 故宫中轴线建筑展示页面
 *
 * 展示故宫中轴线 11 个主要建筑
 * 支持 3D 透视节点切换、滚轮/键盘导航
 * 使用与 Exhibition 页面相同的组件风格
 * 集成 GLM-4.7-Flash LLM 服务生成建筑描述
 */

import { useState, useEffect, useCallback, useRef, memo } from 'react';
import ExhibitionNav from '../components/exhibition/ExhibitionNav';
import ChapterNav from '../components/exhibition/ChapterNav';
import BottomControls from '../components/exhibition/BottomControls';
import DecorativeChar from '../components/exhibition/DecorativeChar';
import BootLoader from '../components/exhibition/BootLoader';
import InfoCard from '../components/exhibition/InfoCard';
import AxisCanvas from '../components/axis/AxisCanvas';
import {
  generateBuildingInfo,
  preloadAdjacentBuildings,
  setApiKey,
  type BuildingInfo
} from '../components/axis/axisLLMService';
import type { ThemeMode } from '../components/exhibition/types';
import type { StructureInfo } from '../components/exhibition/services/llmService';

// 初始化 API Key（优先使用环境变量，其次使用硬编码）
const API_KEY = import.meta.env.VITE_GLM_API_KEY || '327d5d8bd0d1435a9ded2d58f430e915.N45zV86IIe3TUqr6';
setApiKey(API_KEY);

// 建筑名称
const BUILDING_NAMES = [
  '午门', '太和门', '太和殿', '中和殿', '保和殿',
  '乾清门', '乾清宫', '交泰殿', '坤宁宫', '御花园', '神武门'
];

// 建筑图片路径
const BUILDING_IMAGES = [
  '/axis/午门.webp',
  '/axis/太和门webp.webp',
  '/axis/太和殿.png',
  '/axis/中和殿.webp',
  '/axis/保和殿.jpg',
  '/axis/乾清门.webp',
  '/axis/乾清宫.jpg',
  '/axis/交泰殿.jpg',
  '/axis/坤宁宫.jpg',
  '/axis/御花园.webp',
  '/axis/神武门.webp'
];

// 章节配置（用于左侧导航）
const chapters = BUILDING_NAMES.map((name, index) => ({
  id: String(index),
  label: name,
}));

// 信息面板内容
const PANEL_CONTENT = {
  layout: {
    '午门': {
      title: '布局与定位 · 午门',
      content: `
        <p class="highlight">紫禁城正门</p>
        <p>午门位于紫禁城中轴线南端，是紫禁城的正门。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">紫禁城南端</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">凹字形阙门</span></div>
        <p>呈"凹"字形，两侧向前伸出，形成独特的阙门形式。</p>
      `
    },
    '太和门': {
      title: '布局与定位 · 太和门',
      content: `
        <p class="highlight">外朝正门</p>
        <p>太和门是外朝宫殿的正门，门前有金水河流过。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">太和殿前</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">重檐歇山顶</span></div>
        <p>门前铜狮镇守，气势雄伟，是进入外朝的必经之路。</p>
      `
    },
    '太和殿': {
      title: '布局与定位 · 太和殿',
      content: `
        <p class="highlight">金銮殿</p>
        <p>太和殿是紫禁城内规模最大的殿宇，俗称金銮殿。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">外朝中心</span></div>
        <div class="data-row"><span class="data-label">面阔</span><span class="data-value">十一间</span></div>
        <p>位于三层汉白玉台基之上，是举行重大典礼的场所。</p>
      `
    },
    '中和殿': {
      title: '布局与定位 · 中和殿',
      content: `
        <p class="highlight">皇帝休息处</p>
        <p>中和殿位于太和殿与保和殿之间，是皇帝大典前的休息处。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">太和殿后</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">单檐四角攒尖顶</span></div>
        <p>方形平面，造型独特，是三大殿中最小的一座。</p>
      `
    },
    '保和殿': {
      title: '布局与定位 · 保和殿',
      content: `
        <p class="highlight">殿试场所</p>
        <p>保和殿是外朝三大殿之一，清代作为殿试场所。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">中和殿后</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">重檐歇山顶</span></div>
        <p>皇帝在此举行宴会，后成为科举殿试的考场。</p>
      `
    },
    '乾清门': {
      title: '布局与定位 · 乾清门',
      content: `
        <p class="highlight">内廷正门</p>
        <p>乾清门是内廷后三宫的正门，分隔外朝与内廷。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">保和殿后</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">单檐歇山顶</span></div>
        <p>门前设有御门听政的场所，是皇帝处理政务之处。</p>
      `
    },
    '乾清宫': {
      title: '布局与定位 · 乾清宫',
      content: `
        <p class="highlight">皇帝寝宫</p>
        <p>乾清宫是内廷后三宫之首，明代至清初为皇帝寝宫。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">乾清门内</span></div>
        <div class="data-row"><span class="data-label">面阔</span><span class="data-value">九间</span></div>
        <p>殿内正中悬挂"正大光明"匾，雍正后改为皇帝处理政务之所。</p>
      `
    },
    '交泰殿': {
      title: '布局与定位 · 交泰殿',
      content: `
        <p class="highlight">存放玉玺</p>
        <p>交泰殿位于乾清宫与坤宁宫之间，存放皇帝玉玺。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">后三宫中</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">单檐四角攒尖顶</span></div>
        <p>殿内悬有乾隆御笔"无为"匾，是皇后千秋节受贺之处。</p>
      `
    },
    '坤宁宫': {
      title: '布局与定位 · 坤宁宫',
      content: `
        <p class="highlight">皇后寝宫</p>
        <p>坤宁宫是内廷后三宫之末，明代为皇后寝宫。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">交泰殿后</span></div>
        <div class="data-row"><span class="data-label">面阔</span><span class="data-value">九间</span></div>
        <p>清代改为祭神场所和皇帝大婚洞房，东暖阁为婚房。</p>
      `
    },
    '御花园': {
      title: '布局与定位 · 御花园',
      content: `
        <p class="highlight">皇室园林</p>
        <p>御花园位于紫禁城中轴线北端，是皇室休憩的园林。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">坤宁宫后</span></div>
        <div class="data-row"><span class="data-label">面积</span><span class="data-value">约一万二千平方米</span></div>
        <p>园内奇石罗布，古木参天，有堆秀山、钦安殿等建筑。</p>
      `
    },
    '神武门': {
      title: '布局与定位 · 神武门',
      content: `
        <p class="highlight">紫禁城北门</p>
        <p>神武门是紫禁城的北门，原名玄武门，后避讳改称神武门。</p>
        <div class="data-row"><span class="data-label">方位</span><span class="data-value">紫禁城北端</span></div>
        <div class="data-row"><span class="data-label">形制</span><span class="data-value">重檐庑殿顶</span></div>
        <p>门楼设有钟鼓，是宫女选秀和皇帝后妃出入之门。</p>
      `
    }
  },
  structure: {
    '午门': {
      title: '结构与装饰 · 午门',
      content: `
        <p class="highlight">建筑结构</p>
        <p>午门采用重檐庑殿顶，是古代建筑中等级最高的屋顶形式。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐庑殿顶</span></div>
        <div class="data-row"><span class="data-label">彩画</span><span class="data-value">和玺彩画</span></div>
        <p>梁枋施以和玺彩画，檐下斗拱繁复精美。</p>
      `
    },
    '太和门': {
      title: '结构与装饰 · 太和门',
      content: `
        <p class="highlight">建筑结构</p>
        <p>太和门面阔九间，进深三间，重檐歇山顶。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐歇山顶</span></div>
        <div class="data-row"><span class="data-label">斗拱</span><span class="data-value">七踩单翘双昂</span></div>
        <p>门前铜狮为明代遗物，造型威猛，栩栩如生。</p>
      `
    },
    '太和殿': {
      title: '结构与装饰 · 太和殿',
      content: `
        <p class="highlight">建筑结构</p>
        <p>太和殿是中国现存最大的木结构宫殿，重檐庑殿顶。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐庑殿顶</span></div>
        <div class="data-row"><span class="data-label">脊兽</span><span class="data-value">十件（全国唯一）</span></div>
        <p>殿内金漆雕龙宝座，藻井金蟠龙，极尽奢华。</p>
      `
    },
    '中和殿': {
      title: '结构与装饰 · 中和殿',
      content: `
        <p class="highlight">建筑结构</p>
        <p>中和殿为方形平面，单檐四角攒尖顶。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">单檐四角攒尖顶</span></div>
        <div class="data-row"><span class="data-label">宝顶</span><span class="data-value">鎏金宝顶</span></div>
        <p>殿内设有宝座，皇帝在此接受执事官员朝拜。</p>
      `
    },
    '保和殿': {
      title: '结构与装饰 · 保和殿',
      content: `
        <p class="highlight">建筑结构</p>
        <p>保和殿重檐歇山顶，殿内有大雕龙石阶。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐歇山顶</span></div>
        <div class="data-row"><span class="data-label">云龙石雕</span><span class="data-value">长16.57米</span></div>
        <p>殿后有紫禁城最大的云龙石雕，重达二百余吨。</p>
      `
    },
    '乾清门': {
      title: '结构与装饰 · 乾清门',
      content: `
        <p class="highlight">建筑结构</p>
        <p>乾清门单檐歇山顶，门前有鎏金铜狮一对。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">单檐歇山顶</span></div>
        <div class="data-row"><span class="data-label">彩画</span><span class="data-value">旋子彩画</span></div>
        <p>门前设有一对鎏金铜狮，耳下垂，示听政之意。</p>
      `
    },
    '乾清宫': {
      title: '结构与装饰 · 乾清宫',
      content: `
        <p class="highlight">建筑结构</p>
        <p>乾清宫重檐庑殿顶，殿内设宝座屏风。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐庑殿顶</span></div>
        <div class="data-row"><span class="data-label">匾额</span><span class="data-value">正大光明</span></div>
        <p>殿内悬挂"正大光明"匾，雍正后密建皇储制度与此相关。</p>
      `
    },
    '交泰殿': {
      title: '结构与装饰 · 交泰殿',
      content: `
        <p class="highlight">建筑结构</p>
        <p>交泰殿方形平面，单檐四角攒尖顶。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">单檐四角攒尖顶</span></div>
        <div class="data-row"><span class="data-label">宝物</span><span class="data-value">二十五方宝玺</span></div>
        <p>殿内存放清代二十五方皇帝宝玺，具有重要的政治意义。</p>
      `
    },
    '坤宁宫': {
      title: '结构与装饰 · 坤宁宫',
      content: `
        <p class="highlight">建筑结构</p>
        <p>坤宁宫重檐庑殿顶，清代改建为萨满祭祀场所。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐庑殿顶</span></div>
        <div class="data-row"><span class="data-label">用途</span><span class="data-value">祭祀与大婚洞房</span></div>
        <p>西暖阁设大婚洞房，东暖阁为祭神之所。</p>
      `
    },
    '御花园': {
      title: '结构与装饰 · 御花园',
      content: `
        <p class="highlight">建筑结构</p>
        <p>御花园内有堆秀山、钦安殿、养性斋等建筑。</p>
        <div class="data-row"><span class="data-label">主要建筑</span><span class="data-value">钦安殿</span></div>
        <div class="data-row"><span class="data-label">特色</span><span class="data-value">人造山石</span></div>
        <p>园内古柏参天，奇石罗布，亭台楼阁错落有致。</p>
      `
    },
    '神武门': {
      title: '结构与装饰 · 神武门',
      content: `
        <p class="highlight">建筑结构</p>
        <p>神武门重檐庑殿顶，门楼设有钟鼓楼。</p>
        <div class="data-row"><span class="data-label">屋顶</span><span class="data-value">重檐庑殿顶</span></div>
        <div class="data-row"><span class="data-label">功能</span><span class="data-value">报时与选秀</span></div>
        <p>门楼上悬钟鼓，清代时黄昏鸣钟一百零八声。</p>
      `
    }
  }
};

// 装饰文字映射
const decorativeChars: Record<string, string> = {};
BUILDING_NAMES.forEach((name, index) => {
  decorativeChars[String(index)] = name.charAt(0);
});

const TOTAL_NODES = 11;
const ANIMATION_DURATION = 500;
const LOADING_SPEED = 2;

// artifact 信息
const artifactInfo = {
  name: '故宫中轴',
  nameEn: 'FORBIDDEN CITY AXIS'
};

/**
 * 将 PANEL_CONTENT 转换为 StructureInfo 格式
 */
function convertToStructureInfo(buildingName: string): StructureInfo {
  const layoutContent = PANEL_CONTENT.layout[buildingName as keyof typeof PANEL_CONTENT.layout];
  const structureContent = PANEL_CONTENT.structure[buildingName as keyof typeof PANEL_CONTENT.structure];

  // 解析 HTML 内容提取信息
  const parseContent = (html: string) => {
    const tempDiv = typeof document !== 'undefined'
      ? document.createElement('div')
      : null;
    if (tempDiv) {
      tempDiv.innerHTML = html;
      const highlight = tempDiv.querySelector('.highlight')?.textContent || '';
      const paragraphs = Array.from(tempDiv.querySelectorAll('p')).map(p => p.textContent || '');
      const dataRows = Array.from(tempDiv.querySelectorAll('.data-row')).map(row => ({
        label: row.querySelector('.data-label')?.textContent || '',
        value: row.querySelector('.data-value')?.textContent || '',
      }));
      return { highlight, paragraphs, dataRows };
    }
    return { highlight: '', paragraphs: [], dataRows: [] };
  };

  const layout = layoutContent ? parseContent(layoutContent.content) : { highlight: '', paragraphs: [], dataRows: [] };
  const structure = structureContent ? parseContent(structureContent.content) : { highlight: '', paragraphs: [], dataRows: [] };

  // 构建构件列表
  const components = [
    {
      name: layout.dataRows[0]?.label || '方位',
      nameEn: 'Location',
      description: layout.dataRows[0]?.value || '',
      material: '木质结构',
      function: '建筑定位',
    },
    {
      name: layout.dataRows[1]?.label || '形制',
      nameEn: 'Form',
      description: layout.dataRows[1]?.value || '',
      material: '传统工艺',
      function: '建筑形制',
    },
  ];

  return {
    title: layoutContent?.title?.split('·')[1]?.trim() || buildingName,
    subtitle: layout.highlight || '故宫建筑',
    description: layout.paragraphs.filter(p => p.length > 20)[0] || `${buildingName}是故宫中轴线上的重要建筑。`,
    historicalContext: structure.paragraphs.filter(p => p.length > 20)[0] || `${buildingName}具有重要的历史价值。`,
    components,
    technicalParams: {
      era: '明清',
      style: '官式',
      loadBearing: '重型',
      complexity: '复杂',
    },
    funFacts: [layout.highlight],
  };
}

function Axis() {
  const [activeChapter, setActiveChapter] = useState('0');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [structureInfo, setStructureInfo] = useState<StructureInfo | null>(null);
  const [isLLMLoading, setIsLLMLoading] = useState(false);

  // MacBook 风格加载状态
  const [bootProgress, setBootProgress] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [showNavLogo, setShowNavLogo] = useState(false);

  // 滚动控制
  const isAnimating = useRef(false);

  // 加载进度模拟
  useEffect(() => {
    if (!isBooting) return;

    const interval = setInterval(() => {
      setBootProgress(prev => {
        if (prev >= 90) return prev;
        const increment = Math.random() * LOADING_SPEED + 0.5;
        return Math.min(prev + increment, 90);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isBooting]);

  // 加载完成
  useEffect(() => {
    const timer = setTimeout(() => {
      setBootProgress(100);
      setTimeout(() => {
        setIsBooting(false);
        setShowNavLogo(true);
      }, 500);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 加载动画完成回调
  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
    setShowNavLogo(true);
  }, []);

  // 切换章节
  const handleChapterChange = useCallback((newChapterId: string) => {
    if (isAnimating.current || newChapterId === activeChapter) return;

    isAnimating.current = true;
    setActiveChapter(newChapterId);

    setTimeout(() => {
      isAnimating.current = false;
    }, ANIMATION_DURATION);
  }, [activeChapter]);

  // 滚轮事件处理
  useEffect(() => {
    let lastTime = 0;
    const throttleMs = ANIMATION_DURATION + 50;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;

      const currentIndex = parseInt(activeChapter);

      if (e.deltaY > 0 && currentIndex < TOTAL_NODES - 1) {
        setActiveChapter(String(currentIndex + 1));
        lastTime = now;
      } else if (e.deltaY < 0 && currentIndex > 0) {
        setActiveChapter(String(currentIndex - 1));
        lastTime = now;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeChapter]);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = parseInt(activeChapter);

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (currentIndex < TOTAL_NODES - 1) {
          setActiveChapter(String(currentIndex + 1));
        }
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          setActiveChapter(String(currentIndex - 1));
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeChapter]);

  const handleThemeChange = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
  }, []);

  const bgColor = theme === 'dark' ? 'bg-black' : 'bg-[#f7f3ed]';
  const currentDecorativeChar = decorativeChars[activeChapter] || '故';

  // 当前建筑信息
  const currentIndex = parseInt(activeChapter);
  const currentBuilding = BUILDING_NAMES[currentIndex];

  // 使用 LLM 生成建筑信息
  useEffect(() => {
    if (!isBooting && currentBuilding) {
      setIsLLMLoading(true);

      // 获取建筑基础数据作为提示上下文
      const layoutContent = PANEL_CONTENT.layout[currentBuilding as keyof typeof PANEL_CONTENT.layout];
      const buildingData = {
        location: layoutContent?.content?.match(/data-value>([^<]+)</)?.[1],
        form: layoutContent?.content?.match(/data-value>([^<]+)</g)?.[1]?.match(/data-value>([^<]+)</)?.[1],
      };

      generateBuildingInfo(currentBuilding, buildingData)
        .then((info: BuildingInfo) => {
          // 转换为 StructureInfo 格式
          const structureInfoData: StructureInfo = {
            title: info.title,
            subtitle: info.subtitle,
            description: info.description,
            historicalContext: info.historicalContext,
            components: info.components,
            technicalParams: info.technicalParams,
            funFacts: info.funFacts,
          };
          setStructureInfo(structureInfoData);
        })
        .catch(() => {
          // 降级到静态数据
          const fallbackInfo = convertToStructureInfo(currentBuilding);
          setStructureInfo(fallbackInfo);
        })
        .finally(() => {
          setIsLLMLoading(false);
        });

      // 预加载相邻建筑
      preloadAdjacentBuildings(currentBuilding, BUILDING_NAMES);
    }
  }, [activeChapter, isBooting, currentBuilding]);

  return (
    <div className={`relative min-h-screen ${bgColor} overflow-hidden transition-colors duration-500`}>
      {/* MacBook 风格开机加载动画 */}
      <BootLoader
        progress={bootProgress}
        isLoading={isBooting}
        onComplete={handleBootComplete}
      />

      {/* 背景装饰 - 米白色宣纸效果 */}
      <div className="fixed inset-0 pointer-events-none">
        {/* 渐变背景 */}
        <div
          className={`absolute inset-0 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-[#1a1a2e] via-black to-[#16213e]'
              : 'bg-gradient-to-br from-[#faf9f7] via-[#f7f3ed] to-[#f5f0e8]'
          }`}
        />
        {/* 噪点纹理 - 宣纸效果 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* 主画布层 */}
      <AxisCanvas
        startIndex={currentIndex}
        buildingImages={BUILDING_IMAGES}
        TOTAL_NODES={TOTAL_NODES}
        VISIBLE_COUNT={4}
        visible={!isBooting}
        isBlurred={isMenuOpen}
      />

      {/* 失焦遮罩层 */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 cursor-pointer bg-black/20 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 顶部导航 */}
      <ExhibitionNav
        theme={theme}
        onThemeChange={handleThemeChange}
        isMenuOpen={isMenuOpen}
        onMenuToggle={setIsMenuOpen}
        showLogo={showNavLogo}
      />

      {/* 左侧章节导航 */}
      <ChapterNav
        chapters={chapters}
        activeId={activeChapter}
        onChange={handleChapterChange}
        theme={theme}
        isHighlighted={isMenuOpen}
      />

      {/* 右侧信息卡片 */}
      <InfoCard
        structureInfo={structureInfo}
        theme={theme}
        isLoading={isLLMLoading}
        isBlurred={isMenuOpen}
      />

      {/* 底部控件 */}
      <BottomControls
        artifactOrigin={artifactInfo.name}
        artifactOriginEn={artifactInfo.nameEn}
        onZoom={() => {}}
        onReset={() => setActiveChapter('0')}
        theme={theme}
        isBlurred={isMenuOpen}
        showZoom={false}
      />

      {/* 装饰元素 */}
      <DecorativeChar char={currentDecorativeChar} theme={theme} isBlurred={isMenuOpen} />
    </div>
  );
}

export default memo(Axis);
