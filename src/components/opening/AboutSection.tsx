/**
 * AboutSection - 开场页底部项目信息区块
 *
 * 纯黑背景 + 白色字体，展示项目简介与技术栈
 */

import { memo } from 'react';

const techCategories = [
  {
    label: '前端框架',
    items: ['React 19', 'TypeScript 5.9'],
  },
  {
    label: '构建工具',
    items: ['Vite 7'],
  },
  {
    label: '3D 渲染',
    items: ['Three.js', 'React Three Fiber', 'React Three Drei'],
  },
  {
    label: '动画',
    items: ['Framer Motion', 'GSAP'],
  },
  {
    label: '样式',
    items: ['Tailwind CSS 4'],
  },
  {
    label: '数据可视化',
    items: ['ECharts 6'],
  },
  {
    label: 'AI 内容生成',
    items: ['GLM-4.7-Flash (智谱 AI)'],
  },
  {
    label: '路由',
    items: ['React Router 7'],
  },
];

function AboutSection() {
  return (
    <section className="relative z-30 min-h-screen bg-black text-white font-body">
      <div className="mx-auto max-w-4xl px-6 py-24 md:px-10 md:py-36">
        {/* 项目名称 */}
        <h2
          className="text-3xl tracking-[0.3em] md:text-5xl md:tracking-[0.4em]"
          style={{ fontFamily: 'DingLieXiDaTi, serif' }}
        >
          故宫斗拱结构
          <br />
          沉浸式交互网站
        </h2>

        <p className="mt-4 text-xs tracking-[0.5em] uppercase text-white/40 md:text-sm">
          Forbidden City Dougong Structure
          <br />
          Immersive Interactive Website
        </p>

        {/* 分隔线 */}
        <div className="mt-12 h-px bg-gradient-to-r from-white/20 via-white/10 to-transparent" />

        {/* 项目简介 */}
        <p className="mt-10 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
          一个探索故宫建筑结构与斗拱艺术的沉浸式交互体验项目。
          通过三维可视化、数据图表与 AI 驱动的知识库问答，
          呈现紫禁城木结构建筑中斗拱的构造逻辑、历史演变与文化内涵。
        </p>

        {/* 技术栈 */}
        <div className="mt-16">
          <h3 className="text-xs tracking-[0.4em] uppercase text-white/30">
            技术栈
          </h3>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {techCategories.map((cat) => (
              <div key={cat.label}>
                <span className="text-[10px] tracking-[0.2em] uppercase text-white/25">
                  {cat.label}
                </span>
                <ul className="mt-2 space-y-1">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm text-white/70">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <div className="mt-20 flex flex-col gap-2 text-xs text-white/20">
          <p>
            &copy; {new Date().getFullYear()} Forbidden City Structure Project
          </p>
          <p>
            本网站仅供学术研究与文化展示使用，不涉及商业用途。
          </p>
        </div>
      </div>
    </section>
  );
}

export default memo(AboutSection);
