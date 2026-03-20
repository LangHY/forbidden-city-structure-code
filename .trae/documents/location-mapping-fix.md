# 地点对应关系修正计划

## 问题分析

**地图标记顺序**（从上到下，北→南）：
- marker-0: 神武门 (top: 8%) - 最北
- marker-1: 御花园 (top: 26%)
- marker-2: 乾清宫 (top: 44%)
- marker-3: 太和殿 (top: 62%)
- marker-4: 午门 (top: 80%) - 最南

**locations数组顺序**：
- index 0: 神武门
- index 1: 御花园
- index 2: 乾清宫
- index 3: 太和殿
- index 4: 午门

**滚动逻辑问题**：
- `activeIndex = Math.floor(progress * 5)`
- progress=0 时，activeIndex=0（神武门）
- 但地图初始位置显示的是午门区域

**实际期望**：
- 用户从午门（南端）开始，向下滚动向北探索
- 滚动顺序：午门 → 太和殿 → 乾清宫 → 御花园 → 神武门

## 解决方案

### 方案：反转locations数组顺序

将locations数组从北→南改为南→北：
```javascript
const locations = [
    { name: '午门', ... },      // index 0 - 最南，起始点
    { name: '太和殿', ... },    // index 1
    { name: '乾清宫', ... },    // index 2
    { name: '御花园', ... },    // index 3
    { name: '神武门', ... }     // index 4 - 最北
];
```

同时需要：
1. 修改 `currentLocationIndex` 初始值为 0
2. 修改地图标记的初始active状态（marker-0改为午门，marker-4改为神武门）

### 或者方案B：修改滚动索引计算

保持locations数组不变，修改activeIndex计算：
```javascript
const activeIndex = 4 - Math.min(4, Math.floor(progress * 5));
```

这样progress=0时，activeIndex=4（午门），progress=1时，activeIndex=0（神武门）

## 选择方案B（更简单）

只需修改一处代码：
```javascript
// 修改前
const activeIndex = Math.min(4, Math.floor(progress * 5));

// 修改后
const activeIndex = 4 - Math.min(4, Math.floor(progress * 5));
```

## 修改文件
- `public/axis-map.html`

## 修改位置
- 滚动更新逻辑中的activeIndex计算（约第800行）
