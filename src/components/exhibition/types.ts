/**
 * Exhibition 组件类型定义
 *
 * 从 3D_exhibition.html 提取的类型
 */

/**
 * 章节导航项
 */
export interface Chapter {
  id: string;
  label: string;
  active?: boolean;
}

/**
 * 斗拱组件项
 */
export interface DougongComponent {
  id: string;
  name: string;
  nameEn: string;
  desc: string;
}

/**
 * 观察模式
 */
export type ObservationMode = 'panorama' | 'section' | 'perspective';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark';

/**
 * InfoCard Props
 */
export interface InfoCardProps {
  title: string;
  description: string;
  components: DougongComponent[];
  className?: string;
}

/**
 * ChapterNav Props
 */
export interface ChapterNavProps {
  chapters: Chapter[];
  activeId: string;
  onChange?: (id: string) => void;
  className?: string;
}

/**
 * ExhibitionNav Props
 */
export interface ExhibitionNavProps {
  logo?: string;
  links?: { label: string; href: string }[];
  className?: string;
}

/**
 * BottomControls Props
 */
export interface BottomControlsProps {
  artifactOrigin: string;
  artifactOriginEn: string;
  onZoom?: () => void;
  onReset?: () => void;
  onExplodeToggle?: () => void;
  isExploded?: boolean;
  onStartGame?: () => void;
  className?: string;
}

/**
 * ExhibitionCanvas Props
 */
export interface ExhibitionCanvasProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

/**
 * DecorativeChar Props
 */
export interface DecorativeCharProps {
  char: string;
  className?: string;
}

/**
 * 爆炸图 — 单个构件的爆炸参数
 */
export interface ComponentExplosion {
  /** 构件在 GLB scene.children 中的索引 */
  index: number;
  /** 爆炸方向向量（归一化），从中心指向外 */
  direction: [number, number, number];
  /** 爆炸距离（模型坐标系单位） */
  distance: number;
}

/**
 * 爆炸图 — 单种斗拱的完整配置
 */
export interface DougongExplosionConfig {
  /** 斗拱类型 ID（对应 chapter id） */
  chapterId: string;
  /** 模型 ID（对应 GLB 文件名） */
  modelId: string;
  /** 各构件的爆炸配置 */
  components: ComponentExplosion[];
}

/**
 * 游戏模式
 */
export type GameMode = 'exhibit' | 'playing' | 'completed';
