/**
 * buildingData - 中轴线建筑数据定义
 *
 * 11个故宫中轴线主要建筑的位置、尺寸、图片、描述等信息
 * 用于 Three.js 3D 场景构建
 */

export interface AxisBuilding {
  id: string;
  name: string;
  nameEn: string;
  position: [number, number, number]; // x, y, z (y为高度偏移)
  scale: [number, number, number]; // width, height, depth
  image: string; // 图片路径
  description: string; // 简介
  era: string; // 建造年代
  importance: number; // 重要程度 1-5，影响视觉效果
}

/**
 * 中轴线建筑数据 - 从南到北排列
 *
 * 布局说明：
 * - z 轴为南北方向（负值向南，正值向北）
 * - x 轴为东西方向（中轴线建筑都在 x=0）
 * - y 轴为高度（建筑底部离地面的距离）
 */
export const buildings: AxisBuilding[] = [
  {
    id: 'wumen',
    name: '午门',
    nameEn: 'Meridian Gate',
    position: [0, 0, -20],
    scale: [5, 4, 2.5],
    image: '/axis/午门.webp',
    description: '紫禁城正门，皇权象征',
    era: '明永乐十八年（1420年）',
    importance: 5,
  },
  {
    id: 'taihemen',
    name: '太和门',
    nameEn: 'Gate of Supreme Harmony',
    position: [0, 0, -14],
    scale: [4, 3.5, 2],
    image: '/axis/太和门webp.webp',
    description: '外朝正门，御门听政',
    era: '明永乐十八年（1420年）',
    importance: 4,
  },
  {
    id: 'taihedian',
    name: '太和殿',
    nameEn: 'Hall of Supreme Harmony',
    position: [0, 0, -8],
    scale: [6, 5, 3],
    image: '/axis/太和殿.png',
    description: '金銮殿，至高无上',
    era: '清康熙三十四年（1695年）重建',
    importance: 5,
  },
  {
    id: 'zhonghedian',
    name: '中和殿',
    nameEn: 'Hall of Central Harmony',
    position: [0, 0, -2],
    scale: [3, 3, 2],
    image: '/axis/中和殿.webp',
    description: '皇帝休憩，典礼前奏',
    era: '明永乐十八年（1420年）',
    importance: 3,
  },
  {
    id: 'baohedian',
    name: '保和殿',
    nameEn: 'Hall of Preserving Harmony',
    position: [0, 0, 4],
    scale: [5, 4, 2.5],
    image: '/axis/保和殿.jpg',
    description: '殿试考场，科举圣殿',
    era: '明永乐十八年（1420年）',
    importance: 4,
  },
  {
    id: 'qianqingmen',
    name: '乾清门',
    nameEn: 'Gate of Heavenly Purity',
    position: [0, 0, 10],
    scale: [3.5, 3, 2],
    image: '/axis/乾清门.webp',
    description: '内廷正门，政务中枢',
    era: '明永乐十八年（1420年）',
    importance: 3,
  },
  {
    id: 'qianqinggong',
    name: '乾清宫',
    nameEn: 'Palace of Heavenly Purity',
    position: [0, 0, 16],
    scale: [5, 4.5, 2.5],
    image: '/axis/乾清宫.jpg',
    description: '皇帝寝宫，正大光明',
    era: '明永乐十八年（1420年）',
    importance: 5,
  },
  {
    id: 'jiaotaidian',
    name: '交泰殿',
    nameEn: 'Hall of Union',
    position: [0, 0, 22],
    scale: [3, 3, 2],
    image: '/axis/交泰殿.jpg',
    description: '玉玺珍藏，天地交泰',
    era: '明永乐十八年（1420年）',
    importance: 3,
  },
  {
    id: 'kunninggong',
    name: '坤宁宫',
    nameEn: 'Palace of Earthly Tranquility',
    position: [0, 0, 28],
    scale: [5, 4, 2.5],
    image: '/axis/坤宁宫.jpg',
    description: '皇后寝宫，萨满祭所',
    era: '明永乐十八年（1420年）',
    importance: 4,
  },
  {
    id: 'yuhuayuan',
    name: '御花园',
    nameEn: 'Imperial Garden',
    position: [0, 0, 34],
    scale: [6, 2.5, 4],
    image: '/axis/御花园.webp',
    description: '皇室园林，天人合一',
    era: '明永乐十八年（1420年）',
    importance: 4,
  },
  {
    id: 'shenwumen',
    name: '神武门',
    nameEn: 'Gate of Divine Prowess',
    position: [0, 0, 40],
    scale: [4.5, 4, 2.5],
    image: '/axis/神武门.webp',
    description: '紫禁城北门，钟鼓报时',
    era: '明永乐十八年（1420年）',
    importance: 4,
  },
];

/**
 * 获取建筑索引
 */
export function getBuildingIndex(id: string): number {
  return buildings.findIndex(b => b.id === id);
}

/**
 * 获取相邻建筑
 */
export function getAdjacentBuildings(currentId: string): { prev: AxisBuilding | null; next: AxisBuilding | null } {
  const index = getBuildingIndex(currentId);
  return {
    prev: index > 0 ? buildings[index - 1] : null,
    next: index < buildings.length - 1 ? buildings[index + 1] : null,
  };
}

/**
 * 相机默认位置（俯视全局）
 */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [20, 18, 25];

/**
 * 相机聚焦位置（选中建筑时）
 */
export function getFocusCameraPosition(building: AxisBuilding): [number, number, number] {
  // 相机在建筑上方偏前位置
  return [
    building.position[0] + 5,
    building.position[1] + 8,
    building.position[2] - 3,
  ];
}

export default buildings;