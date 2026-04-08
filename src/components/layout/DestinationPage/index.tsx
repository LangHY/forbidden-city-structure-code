/**
 * DestinationPage - 目标页面
 */

import { memo } from 'react';

interface DestinationPageProps {
  visible: boolean;
}

function DestinationPage({ visible }: DestinationPageProps) {
  if (!visible) return null;

  return (
    <div className="min-h-screen bg-[#faf9f7] py-20 px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif text-[#b91c1c] mb-8">探索故宫</h2>
        <p className="text-[#78716c] font-serif leading-relaxed">
          紫禁城，中国明清两代的皇家宫殿，位于北京中轴线的中心...
        </p>
      </div>
    </div>
  );
}

export default memo(DestinationPage);
