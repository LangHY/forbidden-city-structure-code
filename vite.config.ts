import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM 模块中 __dirname 的替代方案
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/extracted': path.resolve(__dirname, './extracted'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Three.js 核心 (~500KB)
          'three': ['three'],
          // React Three 生态 (~300KB)
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          // React 核心 (~150KB)
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // 动画库 (~200KB)
          'animation': ['framer-motion', 'gsap'],
        },
      },
    },
  },
})
