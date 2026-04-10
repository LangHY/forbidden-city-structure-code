/**
 * AxisInfoPanel - 右侧信息面板
 *
 * 滑出式详情面板，显示布局/结构信息
 */

import { useEffect, useState, memo } from 'react';

interface PanelContent {
  title: string;
  content: string;
}

interface AxisInfoPanelProps {
  isOpen: boolean;
  content?: PanelContent;
  onClose: () => void;
}

function AxisInfoPanel({ isOpen, content, onClose }: AxisInfoPanelProps) {
  const [displayContent, setDisplayContent] = useState<PanelContent | null>(null);

  useEffect(() => {
    if (isOpen && content) {
      // 先关闭，触发滑出动画，然后更新内容再滑入
      const timer = setTimeout(() => {
        setDisplayContent(content);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [content, isOpen]);

  if (!displayContent) return null;

  return (
    <>
      <div className={`axis-info-panel ${isOpen ? 'axis-info-panel-active' : ''}`}>
        <span className="axis-info-panel-close" onClick={onClose}>
          &times;
        </span>
        <h2>{displayContent.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: displayContent.content }} />
      </div>

      <style>{`
        .axis-info-panel {
          position: fixed;
          right: 0;
          top: 50%;
          transform: translateY(-50%) translateX(100%);
          width: 25vw;
          height: 75vh;
          background: rgba(249, 247, 242, 0.95);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(46, 49, 48, 0.1);
          padding: 40px 30px;
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: 50;
        }

        .axis-info-panel-active {
          transform: translateY(-50%) translateX(0);
        }

        .axis-info-panel-close {
          position: absolute;
          top: 20px;
          right: 20px;
          color: #2e3130;
          font-size: 24px;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.3s;
        }

        .axis-info-panel-close:hover {
          opacity: 1;
        }

        .axis-info-panel h2 {
          font-family: 'Newsreader', serif;
          font-style: italic;
          font-size: 28px;
          color: #2e3130;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(46, 49, 48, 0.1);
        }

        .axis-info-panel h3 {
          font-family: 'Newsreader', serif;
          font-style: italic;
          font-size: 18px;
          color: #2e3130;
          margin-top: 25px;
          margin-bottom: 12px;
        }

        .axis-info-panel p {
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          line-height: 1.8;
          color: rgba(46, 49, 48, 0.7);
          margin-bottom: 15px;
        }

        .axis-info-panel .highlight {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4a7c59;
          margin-bottom: 8px;
        }

        .axis-info-panel .data-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid rgba(46, 49, 48, 0.05);
          font-size: 13px;
        }

        .axis-info-panel .data-label {
          font-family: monospace;
          color: rgba(46, 49, 48, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 10px;
        }

        .axis-info-panel .data-value {
          font-family: 'Inter', sans-serif;
          color: #2e3130;
        }
      `}</style>
    </>
  );
}

export default memo(AxisInfoPanel);
