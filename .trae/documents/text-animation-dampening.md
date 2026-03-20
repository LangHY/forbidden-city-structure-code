# 文字动画阻尼感增强计划

## 问题分析

当前文字动画使用 `ease-out` 缓动曲线，缺乏明显的阻尼感。需要与地图动画的 `power4.inOut` 风格保持一致。

## 当前状态

```css
.text-label.animate, .text-title.animate, .text-subtitle.animate {
    animation: floatUp 0.6s ease-out forwards;
}
```

**问题：**
- `ease-out` 缓动曲线阻尼感不足
- 与地图动画的 `power4.inOut` 风格不一致
- 动画时长较短（0.6s）

## 解决方案

### 方案：使用CSS贝塞尔曲线模拟power4.inOut

**推荐贝塞尔曲线：**
```css
cubic-bezier(0.65, 0, 0.35, 1)
```

这个曲线特点：
- 开始缓慢加速
- 中间匀速
- 结束缓慢减速
- 有明显的阻尼感

### 配置

| 元素 | 时长 | 缓动曲线 |
|------|------|----------|
| text-label | 0.7s | cubic-bezier(0.65, 0, 0.35, 1) |
| text-title | 0.7s | cubic-bezier(0.65, 0, 0.35, 1) |
| text-subtitle | 0.7s | cubic-bezier(0.65, 0, 0.35, 1) |

## 实施步骤

### Step 1: 更新CSS动画缓动曲线
- 将 `ease-out` 改为 `cubic-bezier(0.65, 0, 0.35, 1)`
- 将动画时长从 0.6s 改为 0.7s

### Step 2: 更新floatUp关键帧动画
- 调整动画参数配合新缓动曲线

### Step 3: 验证效果
- 确认文字动画有阻尼感
- 确认与地图动画风格一致

## 预期效果

- 文字上浮时有明显的加速过程
- 结束时有明显的减速阻尼感
- 与地图动画风格统一
- 整体动画更加流畅自然
