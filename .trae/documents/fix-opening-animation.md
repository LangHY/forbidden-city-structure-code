# 修复开场动画丢失问题

## 问题分析

在视频加载优化过程中，第 1333 行引用了 `frameLoadProgress` 变量：

```javascript
const combinedProgress = Math.max(n, frameLoadProgress);
gsap.set(loaderBar, { scaleX: combinedProgress / 100 });
```

**但是这个变量从未被定义**，导致 JavaScript 运行时错误，阻止了整个开场动画的执行。

## 修复方案

### Step 1: 添加 frameLoadProgress 变量定义
在变量声明区域（约第 1440 行附近）添加：
```javascript
let frameLoadProgress = 0;
```

### Step 2: 在 FrameLoader 的 onProgress 回调中更新 frameLoadProgress
修改第 2003-2013 行的 onProgress 回调：
```javascript
onProgress: (info) => {
    console.log('[FrameLoader] Progress:', info);
    
    if (info.phase === 'keyframes') {
        const pct = Math.round((info.current / info.total) * 100);
        loaderTag.innerText = `LOADING KEYFRAMES ${pct}%`;
        frameLoadProgress = pct;  // 更新进度
    } else if (info.phase === 'idle') {
        const pct = Math.round((info.current / info.total) * 100);
        loaderTag.innerText = `FRAMES ${pct}%`;
        frameLoadProgress = pct;  // 更新进度
    }
}
```

### Step 3: 在 onKeyFramesReady 和 onAllFramesReady 中更新进度
```javascript
onKeyFramesReady: () => {
    console.log('[FrameLoader] Key frames ready!');
    loaderTag.innerText = "KEYFRAMES READY";
    frameLoadProgress = 100;  // 关键帧加载完成
    videoReady = true;
    clearTimeout(videoTimeoutId);
    frameLoader.startIdleExtraction();
},
onAllFramesReady: () => {
    console.log('[FrameLoader] All frames loaded!');
    loaderTag.innerText = "READY";
    frameLoadProgress = 100;  // 全部帧加载完成
}
```

## 影响范围
- 仅修改 `public/opening.html` 文件
- 不影响其他功能
- 修复后开场动画将正常执行
