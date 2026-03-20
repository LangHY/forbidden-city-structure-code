# 地图坐标与文字精确对应修复 Spec

## 问题分析

**当前状态**：
- 地图标记位置（相对于地图容器）：
  - marker-0: 神武门 top: 8%
  - marker-1: 御花园 top: 26%
  - marker-2: 乾清宫 top: 44%
  - marker-3: 太和殿 top: 62%
  - marker-4: 午门 top: 80%

- locations数组：
  - index 0: 神武门
  - index 1: 御花园
  - index 2: 乾清宫
  - index 3: 太和殿
  - index 4: 午门

**核心问题**：
地图容器在滚动过程中移动，标记的视觉位置也在变化。需要计算每个标记何时出现在视口中心，并与文字内容精确对应。

## 解决方案

### 方案：基于标记位置的精确计算

计算每个标记在滚动过程中何时出现在视口中心位置：
- 地图容器高度：400vh
- 地图容器初始位置：top: 100vh（视口下方）
- 地图移动距离：72%（gsap y: '-72%'）

每个标记出现在视口中心时的progress：
- 神武门 (top: 8%): progress ≈ 0.85
- 御花园 (top: 26%): progress ≈ 0.68
- 乾清宫 (top: 44%): progress ≈ 0.51
- 太和殿 (top: 62%): progress ≈ 0.34
- 午门 (top: 80%): progress ≈ 0.17

## 修改内容

### 1. 调整滚动进度映射

根据标记位置重新计算progress区间：
```javascript
// 午门 (marker-4, top: 80%)
if (progress < 0.25) {
    activeIndex = 4;
}
// 太和殿 (marker-3, top: 62%)
else if (progress < 0.42) {
    activeIndex = 3;
}
// 乾清宫 (marker-2, top: 44%)
else if (progress < 0.59) {
    activeIndex = 2;
}
// 御花园 (marker-1, top: 26%)
else if (progress < 0.76) {
    activeIndex = 1;
}
// 神武门 (marker-0, top: 8%)
else {
    activeIndex = 0;
}
```

### 2. 调整地图容器移动距离

确保地图从午门平滑过渡到神武门：
```javascript
gsap.to(mapContainer, {
    y: '-75%',  // 调整移动距离
    scrub: 0.5
});
```

## 修改文件
- `public/axis-map.html`
