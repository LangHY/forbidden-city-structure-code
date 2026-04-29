/**
 * ScrollProgressContext - 滚动进度 Context
 *
 * 用于跨组件共享滚动进度
 */

import { createContext, useContext, type ReactNode } from 'react';

interface ScrollProgressContextValue {
  progress: number;
}

const ScrollProgressContext = createContext<ScrollProgressContextValue>({
  progress: 0,
});

interface ScrollProgressProviderProps {
  progress: number;
  children: ReactNode;
}

export function ScrollProgressProvider({ progress, children }: ScrollProgressProviderProps) {
  return (
    <ScrollProgressContext.Provider value={{ progress }}>
      {children}
    </ScrollProgressContext.Provider>
  );
}

export function useScrollProgressContext() {
  return useContext(ScrollProgressContext);
}

export default ScrollProgressContext;
