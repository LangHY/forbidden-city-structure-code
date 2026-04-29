/**
 * AIButton - AI 按钮
 */

import { memo } from 'react';

interface AIButtonProps {
  onClick?: () => void;
}

function AIButton({ onClick }: AIButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-[#b91c1c] text-white rounded-lg font-serif hover:bg-[#991b1b] transition-colors"
    >
      生成诗句
    </button>
  );
}

export default memo(AIButton);
