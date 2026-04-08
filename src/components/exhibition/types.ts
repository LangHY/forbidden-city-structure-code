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
