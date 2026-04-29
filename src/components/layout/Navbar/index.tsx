/**
 * Navbar - 导航栏
 */

import { memo } from 'react';

interface NavbarProps {
  visible: boolean;
}

function Navbar({ visible }: NavbarProps) {
  if (!visible) return null;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 bg-transparent" aria-label="主导航">
      <div className="flex justify-between items-center">
        <div className="text-xl font-serif text-[#b91c1c] font-bold">故宫</div>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-[#78716c] hover:text-[#b91c1c] transition-colors font-serif">
            首页
          </a>
          <a href="#" className="text-sm text-[#78716c] hover:text-[#b91c1c] transition-colors font-serif">
            探索
          </a>
          <a href="#" className="text-sm text-[#78716c] hover:text-[#b91c1c] transition-colors font-serif">
            关于
          </a>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);
