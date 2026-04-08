/**
 * UILayer - UI 层容器
 */

import { memo, type ReactNode } from 'react';

interface UILayerProps {
  visible: boolean;
  children: ReactNode;
}

function UILayer({ visible, children }: UILayerProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto">{children}</div>
    </div>
  );
}

/**
 * QuoteDisplay - 诗句显示
 */
interface QuoteDisplayProps {
  quote: string;
  typing?: boolean;
  typingSpeed?: number;
}

export function QuoteDisplay({ quote }: QuoteDisplayProps) {
  return (
    <div className="text-center">
      <p className="text-2xl font-serif text-[#1a1a1a] tracking-wider leading-relaxed">
        {quote}
      </p>
    </div>
  );
}

export default memo(UILayer);
