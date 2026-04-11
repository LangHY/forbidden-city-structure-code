# 运行手册

> 故宫主题沉浸式交互网站 - 开发者运维指南

---

## 一、开发环境配置

### 1.1 系统要求

| 项目      | 最低要求                                    | 推荐配置     |
| ------- | --------------------------------------- | -------- |
| 操作系统    | Windows 10 / macOS 10.15 / Ubuntu 18.04 | 最新版本     |
| Node.js | 18.0 LTS                                | 20.0 LTS |
| npm     | 9.0                                     | 10.0     |
| 内存      | 4GB                                     | 8GB+     |
| 磁盘空间    | 500MB                                   | 1GB+     |

### 1.2 Node.js 安装

#### Windows / macOS

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载 LTS 版本安装包
3. 运行安装程序，按提示完成安装

#### Linux (Ubuntu/Debian)

```bash
# 使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

### 1.3 验证安装

```bash
# 检查 Node.js 版本
node -v
# 输出示例: v20.10.0

# 检查 npm 版本
npm -v
# 输出示例: 10.2.3
```

### 1.4 IDE 配置（推荐 VS Code）

#### 推荐扩展

```
- ESLint (dbaeumer.vscode-eslint)
- Prettier (esbenp.prettier-vscode)
- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
- TypeScript Vue Plugin (Vue.volar)
```

#### settings.json 配置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## 二、安装依赖

```bash
# 进入项目目录
cd replicate-website-effect

# 安装所有依赖
npm install

# 输出示例：
# added 1245 packages in 45s
```

---

## 三、开发模式

### 3.1 启动开发服务器

```bash
npm run dev
```

**预期输出：**

```
  VITE v7.3.1  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### 3.2 访问开发服务器

打开浏览器访问：

- **本地地址：** http://localhost:5173/
- **局域网地址：** http://192.168.x.x:5173/ （其他设备访问）

### 3.3 热更新说明

开发模式下，修改源代码后会自动刷新页面：

```
修改 src/components/exhibition/index.tsx
     ↓
Vite 检测文件变化
     ↓
自动重新编译
     ↓
浏览器自动刷新
```

### 3.4 开发端口配置

如需修改默认端口，编辑 `vite.config.ts`：

```typescript
export default defineConfig({
  server: {
    port: 3000,  // 自定义端口
    open: true,  // 自动打开浏览器
  },
  // ...
});
```

---

## 四、构建部署

### 4.1 生产构建

```bash
# 执行构建
npm run build
```

**构建流程：**

```
1. TypeScript 类型检查 (tsc -b)
   ↓
2. Vite 打包编译
   ↓
3. 代码分割 (按配置)
   ↓
4. 资源优化压缩
   ↓
5. 输出到 dist/ 目录
```

**预期输出：**

```
vite v7.3.1 building for production...
✓ 1245 modules transformed.
dist/index.html                  0.46 kB │ gzip: 0.30 kB
dist/assets/index-abc123.css    45.23 kB │ gzip: 12.34 kB
dist/assets/three-def456.js    512.34 kB │ gzip: 156.78 kB
dist/assets/react-vendor-ghi789.js  145.67 kB │ gzip: 45.23 kB
dist/assets/index-jkl012.js    234.56 kB │ gzip: 78.90 kB
✓ built in 12.34s
```

### 4.2 构建产物

```
dist/
├── index.html              # 入口 HTML
├── assets/
│   ├── index-[hash].css    # 样式文件
│   ├── index-[hash].js     # 主代码
│   ├── three-[hash].js     # Three.js (代码分割)
│   ├── three-fiber-[hash].js # React Three (代码分割)
│   ├── react-vendor-[hash].js # React 生态 (代码分割)
│   └── animation-[hash].js # 动画库 (代码分割)
└── [静态资源]
```

### 4.3 预览构建结果

```bash
npm run preview
```

**预期输出：**

```
  ➜  Local:   http://localhost:4173/
  ➜  Network: http://192.168.1.100:4173/
```

### 4.4 部署到静态服务器

#### 方案一：Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/dist;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### 方案二：Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel

# 生产部署
vercel --prod
```

#### 方案三：Netlify

1. 上传项目文件或连接代码仓库
2. 构建命令：`npm run build`
3. 输出目录：`dist`
4. 发布

### 4.5 环境变量配置

创建 `.env.production` 文件：

```env
VITE_GLM_API_KEY=your_production_api_key
VITE_API_BASE_URL=https://api.example.com
```

在代码中使用：

```typescript
const apiKey = import.meta.env.VITE_GLM_API_KEY;
```

---

## 五、代码质量

### 5.1 ESLint 检查

```bash
# 运行 lint 检查
npm run lint

# 预期输出（无错误）：
# ✖ 0 problems (0 errors, 0 warnings)
```

### 5.2 Prettier 格式化

```bash
# 格式化所有代码
npm run format

# 检查格式（不修改）
npm run format:check
```

### 5.3 TypeScript 类型检查

```bash
# 类型检查（构建时自动执行）
npx tsc --noEmit
```

---

## 六、资源管理

### 6.1 3D 模型资源

#### 模型文件位置

```
public/models/structures/
├── R1L1.glb  # 重栱素方
├── R1L2.glb  # 带昂转角铺作
├── ...
└── R5L5.glb  # 塔刹基座
```

#### 模型格式要求

- **格式：** GLB (Binary glTF)
- **大小：** 单个文件 < 10MB（推荐）
- **顶点数：** < 50,000（推荐）
- **材质：** PBR 材质

#### 添加新模型

1. 将 `.glb` 文件放入 `public/models/structures/`
2. 在 `src/components/exhibition/config.ts` 中添加映射：

```typescript
export const chapterModelMap: Record<string, string> = {
  // ...
  'new-chapter-id': 'R6L1',  // 新模型文件名（不含扩展名）
};
```

### 6.2 视频资源

#### 视频文件位置

```
public/
├── gugong_reverse.mp4    # 开场视频（反向）
├── gugong.mp4           # 故宫视频
└── arctecture_growth.mp4 # 建筑生长视频
```

#### 视频格式要求

- **格式：** MP4 (H.264)
- **分辨率：** 1920x1080 或更高
- **帧率：** 30fps 或 60fps
- **大小：** < 50MB（推荐）

### 6.3 字体资源

#### 自定义字体位置

```
public/fonts/
└── 权衡度量体.ttf  # 中文装饰字体
```

#### 字体引入方式

```css
@font-face {
  font-family: 'QuanHeng';
  src: url('/fonts/权衡度量体.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;  /* 优化加载 */
}
```

---

## 七、API 配置

### 7.1 GLM-4.7-Flash API

#### 获取 API Key

1. 访问 [智谱 AI 开放平台](https://open.bigmodel.cn/)
2. 注册并登录
3. 创建应用获取 API Key

#### 配置 API Key

**开发环境：**

```typescript
// src/components/exhibition/services/llmService.ts
let apiKey = 'your_api_key_here';
```

**生产环境（推荐）：**

```env
# .env.production
VITE_GLM_API_KEY=your_production_api_key
```

```typescript
// 代码中读取环境变量
const apiKey = import.meta.env.VITE_GLM_API_KEY;
```

### 7.2 API 请求配置

```typescript
const response = await fetch(GLM_API_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  },
  body: JSON.stringify({
    model: 'glm-4-flash',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,      // 创造性 (0-1)
    max_tokens: 400,       // 最大输出长度
  }),
});
```

### 7.3 API 错误处理

```typescript
try {
  const data = await response.json();
  return parseResponse(data);
} catch (error) {
  console.error('API 调用失败:', error);
  // 返回默认数据
  return getDefaultData();
}
```

---

## 八、性能优化

### 8.1 构建优化

#### 代码分割配置

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'three-fiber': ['@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation': ['framer-motion', 'gsap'],
        },
      },
    },
    // 提高 chunk 大小警告阈值
    chunkSizeWarningLimit: 600,
  },
});
```

#### 压缩配置

```typescript
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true,  // 移除 console
      drop_debugger: true, // 移除 debugger
    },
  },
}
```

### 8.2 资源优化

#### 图片压缩

```bash
# 使用 imagemin 压缩图片
npx imagemin public/*.jpg --out-dir=public/compressed
```

#### 视频压缩

```bash
# 使用 ffmpeg 压缩视频
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac output.mp4
```

### 8.3 加载优化

#### 懒加载配置

```typescript
// src/main.tsx
import { lazy, Suspense } from 'react';

// 懒加载大型组件
const Exhibition = lazy(() => import('./pages/Exhibition.tsx'));
const Opening = lazy(() => import('./pages/Opening.tsx'));
```

#### 预加载策略

```typescript
// 预加载相邻章节资源
export function preloadAdjacentModels(currentChapterId: string) {
  const currentIndex = chapters.findIndex(c => c.id === currentChapterId);

  // 预加载前后各一个
  if (currentIndex > 0) preloadModel(chapters[currentIndex - 1]);
  if (currentIndex < chapters.length - 1) preloadModel(chapters[currentIndex + 1]);
}
```

### 8.4 性能监控

#### Lighthouse 审计

```bash
# 安装 Lighthouse
npm install -g lighthouse

# 运行审计
lighthouse http://localhost:5173 --view
```

#### Chrome DevTools

```
1. 打开开发者工具 (F12)
2. 切换到 Performance 面板
3. 点击录制
4. 操作页面
5. 分析性能数据
```

---

## 九、故障排查

### 9.1 常见错误

#### Error: Cannot find module 'xxx'

```bash
# 解决方案：重新安装依赖
rm -rf node_modules
rm package-lock.json
npm install
```

#### Error: Port 5173 is already in use

```bash
# 查找占用端口的进程
lsof -i :5173

# 终止进程
kill -9 <PID>

# 或使用其他端口
npm run dev -- --port 3000
```

#### TypeError: Cannot read properties of undefined

```bash
# 检查导入路径
# 确保使用正确的别名
import { Component } from '@/components/Component';  # 正确
import { Component } from 'src/components/Component'; # 错误
```

#### WebGL context lost

```
解决方案：
1. 更新显卡驱动
2. 关闭其他占用 GPU 的应用
3. 检查模型复杂度（减少顶点数）
```

### 9.2 调试技巧

#### React DevTools

```
1. 安装 React DevTools 浏览器扩展
2. 打开开发者工具
3. 切换到 Components 或 Profiler 面板
```

#### Three.js 调试

```typescript
// 在 Canvas 中添加调试信息
<Canvas>
  {/* 显示帧率 */}
  <Stats />

  {/* 显示坐标轴 */}
  <axesHelper args={[5]} />

  {/* 显示网格 */}
  <gridHelper args={[10, 10]} />
</Canvas>
```

#### 网络请求调试

```typescript
// 添加请求日志
fetch(url, options)
  .then(response => {
    console.log('Response:', response);
    return response.json();
  })
  .then(data => console.log('Data:', data))
  .catch(error => console.error('Error:', error));
```

---

## 十、备份与恢复

### 10.1 数据备份

```bash
# 备份整个项目
tar -czf project-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  replicate-website-effect/

# 备份关键配置
cp package.json package.json.bak
cp vite.config.ts vite.config.ts.bak
```

### 10.2 版本控制

```bash
# 查看当前状态
git status

# 创建备份分支
git checkout -b backup-$(date +%Y%m%d)

# 提交更改
git add .
git commit -m "backup: $(date +%Y%m%d)"
```

---

## 十一、监控与日志

### 11.1 错误监控

```typescript
// src/components/ui/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 记录错误到日志服务
    console.error('Error caught:', error, errorInfo);

    // 可选：发送到错误追踪服务
    // trackError(error, errorInfo);
  }
}
```

### 11.2 性能监控

```typescript
// 使用 Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## 十二、安全检查清单

- [ ] API Key 不硬编码在代码中（使用环境变量）
- [ ] 依赖包无已知漏洞（`npm audit`）
- [ ] 输入验证（防止 XSS）
- [ ] HTTPS 部署
- [ ] CSP 配置
- [ ] 敏感信息不暴露在客户端

---

## 十三、更新与维护

### 13.1 依赖更新

```bash
# 检查过时的依赖
npm outdated

# 更新依赖
npm update

# 更新主版本
npm install package@latest
```

### 13.2 Node.js 更新

```bash
# 使用 nvm 更新 Node.js
nvm install --lts
nvm use --lts
```

### 13.3 定期维护任务

| 任务 | 频率 | 命令 |
|------|------|------|
| 依赖安全检查 | 每周 | `npm audit` |
| 依赖更新 | 每月 | `npm update` |
| 代码格式化 | 每次 commit | `npm run format` |
| Lint 检查 | 每次 commit | `npm run lint` |

---

*文档版本：1.0*
*最后更新：2026年4月*
