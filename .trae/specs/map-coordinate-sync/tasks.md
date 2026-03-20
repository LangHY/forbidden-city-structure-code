# Tasks

- [x] Task 1: 优化滚动进度与地点索引的映射逻辑
  - [x] SubTask 1.1: 修改activeIndex计算，使用区间映射而非简单除法
  - [x] SubTask 1.2: 确保progress 0%-20%对应午门，20%-40%对应太和殿，依此类推

- [x] Task 2: 优化地图容器滚动动画
  - [x] SubTask 2.1: 调整GSAP ScrollTrigger的scrub值，确保平滑跟随
  - [x] SubTask 2.2: 优化地图容器移动距离，确保从午门到神武门完整展示

- [x] Task 3: 确保视觉反馈同步
  - [x] SubTask 3.1: 验证地点标记激活状态与文字内容切换同步
  - [x] SubTask 3.2: 验证进度条与滚动进度同步
  - [x] SubTask 3.3: 验证导航圆点与当前地点同步

- [x] Task 4: 测试滚动联动效果
  - [x] SubTask 4.1: 测试从南向北滚动，验证地点顺序正确
  - [x] SubTask 4.2: 测试滚动动画平滑度，确保无卡顿
  - [x] SubTask 4.3: 测试响应式布局下的滚动联动

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
