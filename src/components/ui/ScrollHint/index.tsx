/**
 * ScrollHint - 滚动提示组件
 */

import { memo } from 'react';

interface ScrollHintProps {
  visible: boolean;
}

function ScrollHint({ visible }: ScrollHintProps) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-bounce">
      <div className="text-sm text-[#78716c] font-serif">向下滚动</div>
      <div className="material-symbols-outlined text-center text-[#78716c]">
        keyboard_arrow_down
      </div>
    </div>
  );
}

export default memo(ScrollHint);
