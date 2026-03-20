# 文字浮现动画修复计划

## 问题分析

**当前问题**：动画出现"抽搐"效果

**原因分析**：
1. 多个关键帧（0%, 40%, 70%, 100%）之间的过渡不够平滑
2. scale变化（0.95 → 0.98 → 1.01 → 1）导致文字"抖动"
3. 缓动曲线与关键帧配合不当

## 解决方案

### 方案：简化关键帧 + 优雅缓动

**核心思路**：
- 移除中间关键帧，只保留起始和结束状态
- 移除scale变化，避免抖动
- 使用更优雅的缓动曲线来控制动画节奏

### 具体修改

#### 修改关键帧动画

**修改前**（导致抽搐）：
```css
@keyframes floatUp {
    0%   { opacity: 0; transform: translateY(30px) scale(0.95); }
    40%  { opacity: 0.6; transform: translateY(12px) scale(0.98); }
    70%  { opacity: 0.9; transform: translateY(3px) scale(1.01); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}
```

**修改后**（平滑优雅）：
```css
@keyframes floatUp {
    0% {
        opacity: 0;
        transform: translateY(25px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
```

#### 调整缓动曲线

使用 `ease-out` 或自定义平滑曲线：
```css
animation: floatUp 0.6s ease-out forwards;
```

或者使用更自然的缓动：
```css
animation: floatUp 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
```

### 参数调整

| 项目 | 修改前 | 修改后 |
|------|--------|--------|
| 关键帧数量 | 4个 | 2个 |
| scale变化 | 有 | 无 |
| 位移距离 | 30px | 25px |
| 动画时长 | 0.8s | 0.6s |
| 缓动曲线 | cubic-bezier(0.22, 0.61, 0.36, 1) | ease-out |

## 修改文件
- `public/axis-map.html`

## 修改位置
- CSS `@keyframes floatUp` 定义
- CSS `@-webkit-keyframes floatUp` 定义
- 所有使用动画的样式规则
