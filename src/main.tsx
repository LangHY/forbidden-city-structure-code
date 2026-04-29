import { StrictMode, lazy, Suspense, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './styles/globals.css'
import ErrorBoundary from './components/ui/ErrorBoundary'
import AIChatWidget from './components/chat/AIChatWidget'

// 懒加载 Exhibition 页面（包含 Three.js，单独打包）
const Exhibition = lazy(() => import('./pages/Exhibition.tsx'))

// 懒加载 Opening 页面
const Opening = lazy(() => import('./pages/Opening.tsx'))

// 懒加载 Router 页面
const Router = lazy(() => import('./pages/Router.tsx'))

// 懒加载 Axis 页面
const Axis = lazy(() => import('./pages/Axis.tsx'))

// 懒加载 Charts 页面
const Charts = lazy(() => import('./pages/Charts.tsx'))

// 加载中占位组件
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="text-lg text-white animate-pulse">加载中...</div>
    </div>
  )
}

// 条件渲染 AI 聊天组件：开场页(/)不显示，其余页面均显示
function ConditionalAIChat() {
  const location = useLocation()
  const [theme] = useState<'light' | 'dark'>('light')

  if (location.pathname === '/') return null
  return <AIChatWidget theme={theme} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Opening />
            </Suspense>
          }
        />
        <Route
          path="/router"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Router />
            </Suspense>
          }
        />
        <Route
          path="/exhibition"
          element={
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <Exhibition />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route
          path="/charts"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Charts />
            </Suspense>
          }
        />
        <Route
          path="/axis"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Axis />
            </Suspense>
          }
        />
      </Routes>

      {/* AI 知识库问答助手（开场页不显示） */}
      <ConditionalAIChat />
    </BrowserRouter>
  </StrictMode>,
)
