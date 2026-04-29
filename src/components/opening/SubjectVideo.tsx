/**
 * SubjectVideo - 主体视频 + HUD 元数据叠加
 *
 * 支持滚动放大动画
 * 使用帧间隔控制，减少 seek 调用
 */

import { memo, useMemo, useRef, useEffect, useState, useCallback } from 'react';
import type { OpeningTheme } from './types';
import { useScrollProgressContext } from './context/ScrollProgressContext';

interface SubjectVideoProps {
  theme?: OpeningTheme;
}

function SubjectVideo({ theme = 'dark' }: SubjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastFrameRef = useRef(-1);

  // 视口尺寸
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // 视频是否已加载
  const [videoLoaded, setVideoLoaded] = useState(false);

  const isDark = theme === 'dark';

  const { progress } = useScrollProgressContext();
  const clampedProgress = Math.min(1, Math.max(0, progress));

  // 监听视口变化
  useEffect(() => {
    const updateSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 计算视频缩放
  const scale = useMemo(() => {
    if (viewportSize.width === 0) return 1;
    const initialSize = viewportSize.width * 0.25;
    const targetSize = Math.min(viewportSize.width, viewportSize.height) - 100;
    const maxScale = targetSize / initialSize;
    return Math.min(maxScale, 1 + clampedProgress * (maxScale - 1));
  }, [clampedProgress, viewportSize]);

  // HUD 透明度
  const hudOpacity = Math.max(0, 1 - clampedProgress * 2);

  // 视频加载处理
  const handleCanPlay = useCallback(() => {
    console.log('[SubjectVideo] canplay triggered');
    setVideoLoaded(true);
  }, []);

  // 视频帧同步 - 只在帧号变化时 seek
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoLoaded) return;

    const duration = video.duration;
    if (duration <= 0 || !isFinite(duration)) return;

    // 计算目标帧号（0-120）
    const targetFrame = Math.floor(clampedProgress * 120);

    // 只在帧号变化时 seek
    if (targetFrame !== lastFrameRef.current) {
      // 帧号转时间
      const frameTime = targetFrame * (duration / 121);

      // 确保 frameTime 在有效范围内
      if (frameTime >= 0 && frameTime <= duration) {
        video.currentTime = frameTime;
        lastFrameRef.current = targetFrame;
      }
    }
  }, [clampedProgress, videoLoaded]);

  // 初始化时加载视频元数据
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // 强制加载视频
    video.load();

    const handleLoadedMetadata = () => {
      console.log('[SubjectVideo] loadedmetadata, duration:', video.duration);
    };

    const handleError = (e: Event) => {
      console.error('[SubjectVideo] video error:', (e.target as HTMLVideoElement).error);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div
        ref={containerRef}
        className="relative w-1/4 aspect-square max-w-md"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src="/gugong_reverse.mp4"
          poster="/gugong_reverse_poster.jpg"
          muted
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          onCanPlay={handleCanPlay}
        />

        {/* HUD */}
        {hudOpacity > 0 && (
          <>
            <div
              className="absolute -top-12 -left-4 font-serif text-[10px] tracking-[0.2em]"
              style={{ opacity: hudOpacity, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
            >
              <p>[ 系统状态：运行中 ]</p>
              <p>几何编号：DG-4492-X</p>
            </div>
            <div
              className="absolute -bottom-12 -right-4 text-right font-serif text-[10px] tracking-[0.2em]"
              style={{ opacity: hudOpacity, color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}
            >
              <p>顶点数：42,912</p>
              <p>渲染引擎：ACES_CG</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default memo(SubjectVideo);
