/**
 * Loader - 加载器组件
 */

import { memo } from 'react';

interface LoaderProps {
  progress: number;
  isLoading: boolean;
  onComplete?: () => void;
}

function Loader({ progress, isLoading }: LoaderProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf9f7]">
      <div className="text-center">
        <div className="text-6xl font-serif text-[#b91c1c] mb-4">
          {String(Math.floor(progress)).padStart(2, '0')}
        </div>
        <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#b91c1c] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Loader);
