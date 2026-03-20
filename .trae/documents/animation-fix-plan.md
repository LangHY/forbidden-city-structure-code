# 动画修复计划

## 问题分析

当前实现存在以下问题：

1. **CSS类与JavaScript冲突**：`.map-container.zoom-out` 类使用固定的 `transform: scale(1)`，覆盖了JavaScript动态设置的transform值

2. **缩放动画不生效**：`handleMouseMove` 中动态设置的 `style.transform` 被 CSS 类的样式优先级覆盖

3. **动画不连贯**：CSS transition 和 JavaScript 动画混合使用导致冲突

## 修复方案

### Step 1: 移除CSS类中的transform冲突
- 删除 `.map-container.zoom-out` 类中的 `transform` 属性
- 让JavaScript完全控制缩放值
- CSS只负责transition过渡效果

### Step 2: 修改showDetailPanel函数
- 使用GSAP动画平滑过渡缩放
- 从初始缩放(1.15)平滑过渡到目标缩放(1.0)
- 动画时长与面板滑入动画同步(500ms)

### Step 3: 修改handleMouseMove函数
- 移除节流函数对缩放动画的影响
- 使用requestAnimationFrame优化性能
- 确保缩放与拖动距离成正比

### Step 4: 修改hideDetailPanel函数
- 使用GSAP动画平滑恢复缩放
- 从当前缩放值恢复到初始缩放(1.15)

### Step 5: 优化滚动缩放
- 确保滚动时缩放动画与GSAP ScrollTrigger协调
- 避免长按状态与滚动状态冲突

## 代码修改清单

1. **CSS修改**：
   - `.map-container` 保留transition
   - 删除 `.map-container.zoom-out` 的transform

2. **JavaScript修改**：
   - `showDetailPanel`: 使用GSAP动画缩放
   - `hideDetailPanel`: 使用GSAP动画恢复缩放
   - `handleMouseMove`: 使用requestAnimationFrame优化
   - 添加缩放状态变量管理

## 预期效果

- 长按时：地图从1.15x平滑缩小到1.0x
- 拖动时：缩放随拖动距离逐渐减小
- 松开时：地图平滑恢复到1.15x
- 所有动画保持60fps流畅度
