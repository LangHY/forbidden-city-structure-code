# 动画曲线优化计划

## 当前问题分析

当前动画使用的缓动函数：
- CSS transition: `ease-in-out` - 通用但不够精致
- GSAP缩放: `power2.out` - 较为基础

这些曲线虽然功能正常，但缺乏专业级的流畅感和优雅感。

## 优化方案

### 1. CSS动画曲线优化

**面板滑入/滑出动画**
- 当前: `ease-in-out`
- 优化为: `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design标准缓动)
- 效果: 更自然的进出感，开始和结束都有适当的加速/减速

**地图平移动画**
- 当前: `ease-in-out`
- 优化为: `cubic-bezier(0.25, 0.1, 0.25, 1)` (标准ease)
- 效果: 更平滑的平移过渡

### 2. GSAP动画曲线优化

**缩放下沉动画**
- 当前: `power2.out`
- 优化为: `power3.out` 或 `expo.out`
- 效果: 更优雅的下沉感，结束时有更好的减速

**缩放恢复动画**
- 当前: `power2.out`
- 优化为: `power3.out`
- 效果: 更平滑的恢复效果

### 3. 动画时长微调

考虑微调动画时长以配合新的缓动曲线：
- 缩放动画: 500ms → 600ms (更从容)
- 平移动画: 500ms (保持)
- 面板动画: 500ms (保持)

## 实施步骤

### Step 1: 更新CSS变量
```css
--transition-easing: cubic-bezier(0.4, 0, 0.2, 1);
--transition-easing-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
```

### Step 2: 更新GSAP缓动
```javascript
// 缩放动画
ease: 'power3.out'
```

### Step 3: 调整动画时长
- 缩放动画从500ms调整为600ms

## 预期效果

- 动画开始时有适当的加速
- 动画结束时有优雅的减速
- 整体感觉更流畅、更专业
- 视觉层次更清晰
