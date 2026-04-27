/**
 * BootLoader - MacBook 风格开机进度条加载动画
 *
 * 特点：
 * - 深色背景，白色进度条
 * - "紫禁匠心" 标题使用权衡体
 * - 平滑的进度动画
 * - 加载完成后"紫禁匠心"飞向左上角
 * - 背景和进度条淡出
 * - 点击 Logo 跳转首页
 */

import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface BootLoaderProps {
  progress: number;      // 0-100
  isLoading: boolean;
  onComplete?: () => void;
  onLogoFlyStart?: () => void;  // Logo 开始飞行时的回调
}

// 动画阶段
type AnimationPhase = 'loading' | 'logo-flying' | 'hiding' | 'complete';

function BootLoader({ progress, isLoading, onComplete, onLogoFlyStart }: BootLoaderProps) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<AnimationPhase>('loading');

  // 加载完成时触发 Logo 飞行动画
  useEffect(() => {
    if (progress >= 100 && isLoading && phase === 'loading') {
      // 延迟一点，让用户看到 100%
      setTimeout(() => {
        onLogoFlyStart?.();
        setPhase('logo-flying');
      }, 300);

      // Logo 飞行动画完成后，开始隐藏背景和进度条
      setTimeout(() => {
        setPhase('hiding');
      }, 800);

      // 完全隐藏
      setTimeout(() => {
        setPhase('complete');
        onComplete?.();
      }, 1400);
    }
  }, [progress, isLoading, phase, onComplete, onLogoFlyStart]);

  // 完成后不渲染
  if (phase === 'complete') return null;

  // 计算动画状态
  const isLogoFlying = phase === 'logo-flying' || phase === 'hiding';
  const isHidingBackground = phase === 'hiding';

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      {/* 背景层 */}
      <div
        className={`fixed inset-0 z-[100] bg-black transition-opacity duration-500 ${
          isHidingBackground ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* 进度条层 */}
      {!isLogoFlying && (
        <div className="fixed inset-0 z-[101] flex flex-col items-center justify-center pointer-events-none">
          <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden mt-20">
            {/* mt-20 为 Logo 留出空间 */}
            <div
              className="h-full bg-white rounded-full transition-all duration-200 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 紫禁匠心 Logo - 最高层，可以飞向左上角 */}
      <div
        className={`fixed z-[102] transition-all duration-700 ease-in-out cursor-pointer ${
          isLogoFlying ? 'top-6 left-8' : 'top-1/2 left-1/2'
        }`}
        style={{
          transform: isLogoFlying
            ? 'translate(0, 0) scale(0.7)'
            : 'translate(-50%, calc(-50% - 60px))', // Logo 在进度条正上方
        }}
        onClick={handleLogoClick}
      >
        <h1
          className="font-quanHeng text-4xl md:text-5xl tracking-[0.4em] text-white text-center whitespace-nowrap hover:opacity-80 transition-opacity"
          style={{
            textShadow: '0 2px 20px rgba(255, 255, 255, 0.1)',
          }}
        >
          紫禁匠心
        </h1>
      </div>
    </>
  );
}

export default memo(BootLoader);
