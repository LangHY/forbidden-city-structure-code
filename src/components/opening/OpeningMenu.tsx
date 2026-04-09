/**
 * OpeningMenu - 首页路由选择菜单
 *
 * 点击右上角菜单按钮时展开
 * 竖排显示在页面左侧，用于快捷跳转路由页面
 */

import { memo } from 'react';
import { useLocation } from 'react-router-dom';
import type { OpeningTheme } from './types';

interface OpeningMenuProps {
  isOpen: boolean;
  theme: OpeningTheme;
  onClose: () => void;
}

function OpeningMenu({ isOpen, theme, onClose }: OpeningMenuProps) {
  const location = useLocation();
  const isDark = theme === 'dark';

  // 路由菜单项配置
  const menuItems = [
    { label: '数字考古', path: '/charts', desc: 'DIGITAL ARCHAEOLOGY' },
    { label: '结构蓝图', path: '/exhibition', desc: 'STRUCTURE BLUEPRINT' },
    { label: '沉浸空间', path: '/router', desc: 'IMMERSIVE SPACE' },
  ];

  // 颜色
  const activeText = isDark ? 'text-stone-100' : 'text-stone-900';
  const inactiveText = isDark ? 'text-stone-300/80' : 'text-stone-600/70';
  const activeDot = isDark ? 'bg-stone-100' : 'bg-stone-900';
  const inactiveDot = isDark ? 'bg-stone-500/50' : 'bg-stone-400/40';

  return (
    <div
      className={`fixed left-12 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        perspective: '800px',
      }}
    >
      <div
        className="flex flex-col gap-6"
        style={{
          transform: isOpen ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.9)',
          transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;

          return (
            <a
              key={item.path}
              href={item.path}
              onClick={onClose}
              className={`flex items-center gap-4 cursor-pointer group transition-all duration-300 ${
                isActive ? activeText : inactiveText
              }`}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: `translateX(${isOpen ? 0 : -20}px)`,
                transition: `transform 0.4s cubic-bezier(0.25, 1, 0.5, 1) ${index * 0.05}s, opacity 0.4s ease ${index * 0.05}s`,
              }}
            >
              {/* 指示点 */}
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive ? activeDot : inactiveDot
                }`}
                style={{
                  width: isActive ? '10px' : '6px',
                  height: isActive ? '10px' : '6px',
                  boxShadow: isActive
                    ? (isDark ? '0 0 15px rgba(255, 255, 255, 0.3)' : '0 0 15px rgba(0, 0, 0, 0.2)')
                    : 'none',
                }}
              />

              {/* 文字 */}
              <div className="flex flex-col">
                <span
                  className="font-serif tracking-[0.2em] whitespace-nowrap transition-all duration-300"
                  style={{
                    fontSize: isActive ? '1.25rem' : '1rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {item.label}
                </span>
                <span
                  className={`text-[10px] tracking-widest mt-0.5 transition-all duration-300 ${
                    isDark ? 'opacity-40' : 'opacity-35'
                  }`}
                >
                  {item.desc}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

export default memo(OpeningMenu);
