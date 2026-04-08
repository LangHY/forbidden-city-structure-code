/**
 * Router 页面主题类型
 */
export type RouterTheme = 'dark' | 'light';

/**
 * 导航区域数据
 */
export interface NavZone {
  id: string;
  sequence: string;
  titleCn: string;
  titleEn: string;
  action: string;
  href: string;
}
