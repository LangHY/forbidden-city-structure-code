import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './styles/globals.css'
import ErrorBoundary from './components/ui/ErrorBoundary'

// 懒加载 Exhibition 页面（包含 Three.js，单独打包）
const Exhibition = lazy(() => import('./pages/Exhibition.tsx'))

// 懒加载 Opening 页面
const Opening = lazy(() => import('./pages/Opening.tsx'))

// 懒加载 Router 页面
const Router = lazy(() => import('./pages/Router.tsx'))

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
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
