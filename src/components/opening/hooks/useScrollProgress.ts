/**
 * useScrollProgress - 滚动进度 Hook（带阻尼）
 *
 * 返回阻尼后的滚动进度 (0 ~ 1) 和 scrollY。
 * 固定参考高度 200vh，不随页面总高度变化。
 *
 * 阻尼原理：
 * - scroll 事件直接更新 targetRef（瞬时响应，不触发渲染）
 * - rAF 循环每帧将 currentRef 向 targetRef lerp（平滑追赶）
 * - 所有函数定义在单个 useEffect 内，避免 useCallback 闭包陷阱
 * - 追上目标后 rAF 自动停止，下次滚动时按需重启
 */

import { useState, useEffect, useRef } from 'react';

/** 阻尼系数：越小越"重"。0.10 = 到达 90% 目标约需 22 帧 (~370ms @ 60fps) */
const LERP_FACTOR = 0.1;

export function useScrollProgress() {
  const [state, setState] = useState({ progress: 0, scrollY: 0 });
  const targetRef = useRef({ progress: 0, scrollY: 0 });
  const currentRef = useRef({ progress: 0, scrollY: 0 });

  useEffect(() => {
    let raf = 0;
    let running = false;

    // rAF 循环：每帧向 target 追一步，追上后自动停
    const animate = () => {
      const cur = currentRef.current;
      const tgt = targetRef.current;

      cur.progress += (tgt.progress - cur.progress) * LERP_FACTOR;
      cur.scrollY += (tgt.scrollY - cur.scrollY) * LERP_FACTOR;

      const progressDelta = Math.abs(tgt.progress - cur.progress);
      const scrollYDelta = Math.abs(tgt.scrollY - cur.scrollY);

      if (progressDelta > 0.0005 || scrollYDelta > 1) {
        setState({ progress: cur.progress, scrollY: cur.scrollY });
        raf = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    // scroll 事件：更新 target，按需启动 rAF
    const onScroll = () => {
      const y = window.scrollY;
      const refHeight = window.innerHeight * 2;
      targetRef.current = {
        progress: Math.min(1, Math.max(0, y / refHeight)),
        scrollY: y,
      };

      if (!running) {
        running = true;
        raf = requestAnimationFrame(animate);
      }
    };

    // 初始化
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return state;
}
