# Tasks

- [x] Task 1: 创建HTML页面基础结构
  - [x] SubTask 1.1: 创建 `public/axis-map.html` 文件，设置基本HTML结构
  - [x] SubTask 1.2: 引入GSAP、ScrollTrigger和Tailwind CSS
  - [x] SubTask 1.3: 定义CSS变量，保持与opening.html一致的设计风格

- [x] Task 2: 实现页面布局
  - [x] SubTask 2.1: 创建左右分栏布局容器（左侧1/3文字区，右侧2/3地图区）
  - [x] SubTask 2.2: 实现响应式布局适配（桌面、平板、移动端）
  - [x] SubTask 2.3: 设置页面滚动容器和高度

- [x] Task 3: 设计地图网格和中轴线
  - [x] SubTask 3.1: 使用SVG绘制网格背景
  - [x] SubTask 3.2: 绘制中轴线（红色实线）
  - [x] SubTask 3.3: 添加装饰性元素（建筑轮廓示意）

- [x] Task 4: 实现地点标记
  - [x] SubTask 4.1: 在中轴线上放置5个地点圆圈标记
  - [x] SubTask 4.2: 为每个标记添加名称标签
  - [x] SubTask 4.3: 实现标记的脉动动画效果

- [x] Task 5: 实现视差滚动效果
  - [x] SubTask 5.1: 使用GSAP ScrollTrigger设置视差滚动
  - [x] SubTask 5.2: 实现滚动时地点标记的激活状态切换
  - [x] SubTask 5.3: 实现左侧文字区域的内容切换

- [x] Task 6: 添加交互细节和优化
  - [x] SubTask 6.1: 添加地点标记的hover效果
  - [x] SubTask 6.2: 实现平滑的过渡动画
  - [x] SubTask 6.3: 添加进度指示器

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
- [Task 6] depends on [Task 5]
