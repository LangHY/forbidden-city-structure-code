/**
 * App - 主应用组件
 *
 * 集成所有组件,使用 Context 管理状态
 */

import { useState, useEffect } from 'react';
import { AppProvider, useAppState } from '@/store';
import Grain from '@/components/ui/Grain';
import Loader from '@/components/ui/Loader';
import ScrollHint from '@/components/ui/ScrollHint';
import AIButton from '@/components/ui/AIButton';
import Navbar from '@/components/layout/Navbar';
import UILayer, { QuoteDisplay } from '@/components/layout/UILayer';
import DestinationPage from '@/components/layout/DestinationPage';

/**
 * 主应用内容
 */
function AppContent() {
  const { state, dispatch } = useAppState();
  const [quoteText, setQuoteText] = useState('红墙宫里万重门,太和殿上紫云深。');

  // 模拟加载进度
  useEffect(() => {
    if (!state.opening.isLoading) return;

    const interval = setInterval(() => {
      const newProgress = Math.min(state.opening.loadProgress + 2, 100);
      dispatch({ type: 'SET_LOAD_PROGRESS', payload: newProgress });

      if (newProgress >= 100) {
        dispatch({ type: 'COMPLETE_LOADING' });
      }
    }, 80);

    return () => clearInterval(interval);
  }, [state.opening.isLoading, state.opening.loadProgress, dispatch]);

  // 加载完成后显示UI
  useEffect(() => {
    if (state.opening.phase === 'complete') {
      // 延迟显示导航栏
      setTimeout(() => {
        dispatch({ type: 'UPDATE_UI', payload: { isNavbarVisible: true } });
      }, 500);

      // 延迟隐藏滚动提示
      setTimeout(() => {
        dispatch({ type: 'UPDATE_UI', payload: { isScrollHintVisible: false } });
      }, 3000);
    }
  }, [state.opening.phase, dispatch]);

  // 生成诗句
  const handleGenerateQuote = async () => {
    // 这里可以集成 API
    const quotes = [
      '琉璃瓦上凝宿雨,金水河畔映残阳。',
      '雕栏玉砌应犹在,只是朱颜改。',
      '九天阊阖开宫殿,万国衣冠拜冕旒。',
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuoteText(randomQuote);
  };

  return (
    <div className="relative min-h-screen bg-bg overflow-hidden">
      {/* 噪点层 */}
      <Grain opacity={0.05} />

      {/* 加载器 */}
      {state.opening.isLoading && (
        <Loader
          progress={state.opening.loadProgress}
          isLoading={state.opening.isLoading}
          onComplete={() => {
            console.log('Loading complete!');
          }}
        />
      )}

      {/* 导航栏 */}
      <Navbar visible={state.ui.isNavbarVisible} />

      {/* UI层 - 诗句显示 */}
      {state.opening.phase === 'complete' && (
        <UILayer visible={!state.opening.isLoading}>
          <div className="space-y-8">
            <QuoteDisplay
              quote={quoteText}
              typing={true}
              typingSpeed={100}
            />
            <div className="flex justify-center">
              <AIButton onClick={handleGenerateQuote} />
            </div>
          </div>
        </UILayer>
      )}

      {/* 滚动提示 */}
      <ScrollHint visible={state.ui.isScrollHintVisible} />

      {/* 目标页面 */}
      {state.opening.phase === 'complete' && (
        <div className="mt-[100vh]">
          <DestinationPage visible={true} />
        </div>
      )}
    </div>
  );
}

/**
 * App 根组件
 */
export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
