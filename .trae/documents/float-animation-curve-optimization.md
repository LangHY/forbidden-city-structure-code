# 文字浮现动画曲线优化计划

## 当前状态分析

**当前动画参数**：
- 动画时长：0.7s
- 缓动曲线：`cubic-bezier(0.23, 1, 0.32, 1)` (easeOutExpo风格)
- 位移距离：30px
- 仅包含透明度和位移变化

**当前问题**：
- 动画曲线较为简单，缺乏层次感
- "浮现"效果不够明显，像简单的淡入上移

## 优化方案

### 方案：多阶段缓动 + 微缩放效果

**优化思路**：
1. 添加中间关键帧，创造"加速-减速"的自然浮起感
2. 加入轻微的缩放变化，模拟从水中浮现的"膨胀"效果
3. 调整缓动曲线，使动画更流畅优雅

### 具体修改

#### 1. 优化关键帧动画

**修改前**：
```css
@keyframes floatUp {
    0% {
        opacity: 0;
        transform: translateY(30px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**修改后**：
```css
@keyframes floatUp {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.95);
    }
    40% {
        opacity: 0.6;
        transform: translateY(12px) scale(0.98);
    }
    70% {
        opacity: 0.9;
        transform: translateY(3px) scale(1.01);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

#### 2. 调整缓动曲线

**修改前**：`cubic-bezier(0.23, 1, 0.32, 1)`

**修改后**：`cubic-bezier(0.22, 0.61, 0.36, 1)` 
- 这是一个更平滑的ease-out曲线
- 开始时有轻微的加速感，结束时更加柔和

#### 3. 调整动画时长

**修改前**：0.7s

**修改后**：0.8s
- 稍微延长时间，让动画更从容优雅

### 动画效果对比

| 阶段 | 修改前 | 修改后 |
|------|--------|--------|
| 起始 | opacity:0, translateY(30px) | opacity:0, translateY(30px), scale(0.95) |
| 40% | - | opacity:0.6, translateY(12px), scale(0.98) |
| 70% | - | opacity:0.9, translateY(3px), scale(1.01) |
| 结束 | opacity:1, translateY(0) | opacity:1, translateY(0), scale(1) |

### 视觉效果预期

1. **起始阶段**：文字从下方30px处开始，略微缩小，完全透明
2. **加速阶段**（0-40%）：快速向上移动，同时轻微放大，透明度增加
3. **减速阶段**（40-70%）：移动速度减慢，轻微"过冲"放大效果
4. **稳定阶段**（70-100%）：缓慢回到最终位置，透明度完全显示

## 修改文件
- `public/axis-map.html`

## 修改位置
- CSS `@keyframes floatUp` 定义（约第280行）
- CSS `.float-line.animate` 动画属性（约第310行）
- CSS `.text-label.animate` 等动画属性（约第320行）
- CSS `.text-content .text-line.animate` 动画属性（约第340行）
