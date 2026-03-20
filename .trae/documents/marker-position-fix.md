# 地点标记圆点位置修复计划

## 问题分析

**当前HTML结构**：
```html
<div class="location-marker" style="top: 8%;">
    <span class="marker-label left">午门</span>
    <div class="marker-circle"></div>
    <span class="marker-label right" style="opacity: 0;"></span>
</div>
```

**当前CSS**：
```css
.location-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 2rem;
}
```

**问题根源**：
`.location-marker` 使用 `display: flex` 布局，包含三个子元素（左标签、圆圈、右标签）。`transform: translateX(-50%)` 是将整个flex容器居中，而不是将圆圈居中在中轴线上。

由于左侧有标签，圆圈实际上偏右了，不在中轴线上。

## 解决方案

### 方案：改变布局结构

将圆圈独立定位，使其始终在中轴线上：

```css
.location-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    display: flex;
    justify-content: center;
}

.marker-circle {
    position: relative;
    /* 圆圈始终在容器中心 */
}

.marker-label {
    position: absolute;
    left: auto;
    right: calc(50% + 20px);  /* 左侧标签在圆圈左边 */
}

.marker-label.right {
    left: calc(50% + 20px);   /* 右侧标签在圆圈右边 */
    right: auto;
}
```

### 简化方案：只显示圆圈在中轴线上

修改CSS让圆圈始终居中：

```css
.location-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
}

.marker-circle {
    order: 1;  /* 圆圈在中间 */
}

.marker-label.left {
    order: 0;  /* 标签在上方 */
    margin-bottom: 0.5rem;
}
```

## 推荐方案

修改 `.location-marker` 为相对定位容器，圆圈使用绝对定位居中：

```css
.location-marker {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;  /* 固定宽度 */
    height: 24px;
    display: flex;
    justify-content: center;
}

.marker-circle {
    width: 24px;
    height: 24px;
    /* 圆圈在容器中心 */
}

.marker-label.left {
    position: absolute;
    right: 100%;
    margin-right: 1rem;
    white-space: nowrap;
}
```

## 修改文件
- `public/axis-map.html`
