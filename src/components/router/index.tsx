/**
 * Router - 路由页面主组件
 *
 * 电影风格的导航门户页面
 * 支持亮/暗主题切换
 */

import { memo, useState } from 'react';
import RouterBackground from './RouterBackground';
import RouterSideHUD from './RouterSideHUD';
import RouterNavZone from './RouterNavZone';
import RouterFooter from './RouterFooter';
import RouterDecorations from './RouterDecorations';
import type { RouterTheme } from './types';

function Router() {
  const [theme] = useState<RouterTheme>('light');

  return (
    <div
      className={`relative min-h-screen font-body overflow-hidden ${theme === 'light' ? 'bg-[#f9f7f2] text-[#2a2520]' : 'bg-[#111413] text-[#e1e3e1]'}`}
    >
      {/* 背景层 */}
      <RouterBackground theme={theme} />

      {/* 侧边 HUD */}
      <RouterSideHUD theme={theme} />

      {/* 主要内容区域 */}
      <RouterNavZone theme={theme} />

      {/* 底部页脚 */}
      <RouterFooter theme={theme} />

      {/* 装饰元素 */}
      <RouterDecorations theme={theme} />
    </div>
  );
}

export default memo(Router);
