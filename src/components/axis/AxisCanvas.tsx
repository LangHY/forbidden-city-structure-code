/**
 * AxisCanvas - 主画布组件
 *
 * 3D 透视节点系统，滚轮/键盘切换
 * 粒子破碎效果
 */

import { useState, useCallback, memo } from 'react';

interface AxisCanvasProps {
  startIndex: number;
  buildingImages: string[];
  TOTAL_NODES: number;
  VISIBLE_COUNT: number;
  visible?: boolean;
  isBlurred?: boolean;
}

// 位置配置
const POSITIONS = [
  { x: -120, z: 150, scale: 0.9, hoverScale: 1.2 },
  { x: -40, z: 50, scale: 0.65, hoverScale: 0.87 },
  { x: 40, z: -50, scale: 0.5, hoverScale: 0.67 },
  { x: 130, z: -150, scale: 0.35, hoverScale: 0.47 }
];

function AxisCanvas({
  startIndex,
  buildingImages,
  TOTAL_NODES,
  VISIBLE_COUNT,
  visible = true,
  isBlurred = false
}: AxisCanvasProps) {
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // 获取 transform
  const getTransform = useCallback((posIndex: number, hover = false) => {
    const pos = POSITIONS[posIndex];
    const scale = hover ? pos.hoverScale : pos.scale;
    return `translate(-50%, -50%) translateX(${pos.x}px) translateZ(${pos.z}px) scale(${scale})`;
  }, []);

  // 渲染节点
  const renderNodes = () => {
    const nodes = [];

    for (let i = 0; i < TOTAL_NODES; i++) {
      const visiblePos = i - startIndex;
      const isVisible = visiblePos >= 0 && visiblePos < VISIBLE_COUNT;
      const isCurrent = visiblePos === 0;
      const isLocked = isVisible && !isCurrent;
      const isHidden = !isVisible;
      const isHovered = hoveredNode === i && isCurrent;

      let className = 'axis-node';
      if (isHidden) className += ' axis-node-hidden';
      if (isCurrent) className += ' axis-node-current';
      if (isLocked) className += ' axis-node-locked';

      const transform = isVisible ? getTransform(visiblePos, isHovered) : '';

      nodes.push(
        <div
          key={i}
          className={className}
          style={{
            transform,
          }}
          onMouseEnter={() => isCurrent && setHoveredNode(i)}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <div
            className="axis-node-core"
            style={{ backgroundImage: `url('${buildingImages[i]}')` }}
          />
        </div>
      );
    }

    return nodes;
  };

  return (
    <main
      className={`relative h-screen w-full flex items-center justify-center transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      } ${isBlurred ? 'blur-sm' : ''}`}
    >
      {/* 节点场景 */}
      <div className="axis-scene">
        <div className="axis-nodes-container">
          {renderNodes()}
        </div>
      </div>

      {/* Secondary HUD elements */}
      <div className="absolute bottom-24 right-12 text-right">
        <div className="font-mono text-[10px] text-[#2e3130]/40 mb-1 tracking-widest">
          SCROLL TO NAVIGATE
        </div>
        <div className="w-32 h-[1px] bg-[#2e3130]/10 mb-1"></div>
        <div className="font-mono text-[9px] text-[#2e3130]/30 uppercase tracking-[0.3em]">
          Use mouse wheel
        </div>
      </div>

      {/* 节点样式 */}
      <style>{`
        .axis-scene {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          perspective: 1000px;
          z-index: 10;
        }

        .axis-nodes-container {
          position: relative;
          transform-style: preserve-3d;
        }

        .axis-node {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12vw;
          height: 12vw;
          max-width: 180px;
          max-height: 180px;
          min-width: 60px;
          min-height: 60px;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.3s ease;
        }

        .axis-node-hidden {
          opacity: 0;
          pointer-events: none;
          visibility: hidden;
        }

        .axis-node-shattering {
          animation: axisShatterFade 0.4s ease-out forwards;
        }

        @keyframes axisShatterFade {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        .axis-node-shattering .axis-node-core {
          animation: axisCoreShatter 0.4s ease-out forwards;
        }

        @keyframes axisCoreShatter {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }

        .axis-node-current {
          animation: axisCurrentPulse 1.5s infinite ease-in-out;
        }

        @keyframes axisCurrentPulse {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 15px rgba(255, 255, 200, 0.8)); }
          50% { filter: brightness(1.5) drop-shadow(0 0 30px rgba(255, 255, 200, 1)); }
        }

        .axis-node-locked {
          cursor: not-allowed;
          opacity: 0.4;
          filter: grayscale(0.5);
        }

        .axis-node-core {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          border-radius: 50%;
          filter: drop-shadow(0 0 15px rgba(255, 255, 200, 0.8))
                  drop-shadow(0 0 30px rgba(255, 215, 0, 0.4));
          transition: filter 0.3s ease;
        }

        .axis-node:hover .axis-node-core {
          filter: drop-shadow(0 0 25px rgba(255, 255, 200, 1))
                  drop-shadow(0 0 50px rgba(255, 215, 0, 0.7));
        }

        .axis-particles-container {
          position: fixed;
          width: 100px;
          height: 100px;
          pointer-events: none;
          z-index: 100;
        }

        .axis-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
        }

        @keyframes axisParticleFall {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(0.3);
            opacity: 0;
          }
        }

        .node-counter {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          font-family: monospace;
          font-size: 10px;
          letter-spacing: 0.3em;
          color: rgba(46, 49, 48, 0.4);
          z-index: 100;
        }
      `}</style>
    </main>
  );
}

export default memo(AxisCanvas);
