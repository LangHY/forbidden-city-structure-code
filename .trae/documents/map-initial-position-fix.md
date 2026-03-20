# 地图初始位置修复计划

## 问题分析

**当前状态**：
- `.map-container` 初始位置：`top: 100vh`（视口下方）
- 地图容器高度：`400vh`
- GSAP动画：`y: '-72%'`

**问题根源**：
当 progress=0 时：
- 地图容器在 `top: 100vh`（完全在视口下方）
- 午门标记在地图容器内的 `top: 8%` = 32vh
- 午门标记的绝对位置 = 100vh + 32vh = 132vh
- 视口范围是 0-100vh，所以用户看不到任何地图内容！

## 解决方案

### 修改地图容器初始位置

将地图容器初始位置从 `top: 100vh` 改为 `top: 0`：

```css
.map-container {
    position: absolute;
    width: 100%;
    height: 400vh;
    top: 0;  /* 从 100vh 改为 0 */
    will-change: transform;
}
```

### 调整GSAP动画

当地图容器从 `top: 0` 开始时：
- 午门标记（top: 8%）在 32vh 位置，接近视口中心偏上
- 神武门标记（top: 80%）在 320vh 位置

需要移动的距离：让神武门标记最终出现在视口中心
- 神武门标记位置：400vh * 0.8 = 320vh
- 目标位置：50vh（视口中心）
- 移动距离：320vh - 50vh = 270vh
- 移动百分比：270vh / 400vh = 67.5%

```javascript
gsap.to(mapContainer, {
    y: '-67.5%',  /* 调整移动距离 */
    ease: 'none',
    scrollTrigger: {
        trigger: '.page-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5
    }
});
```

## 预期效果

| progress | 地图容器位置 | 可见标记 |
|----------|-------------|---------|
| 0 | top: 0 | 午门 (32vh) |
| 0.2 | top: -54vh | 太和殿 |
| 0.4 | top: -108vh | 乾清宫 |
| 0.6 | top: -162vh | 御花园 |
| 1 | top: -270vh | 神武门 (50vh) |

## 修改文件
- `public/axis-map.html`
