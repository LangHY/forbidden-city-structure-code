# Tasks

- [x] Task 1: 修改showDetailPanel实现并行动画
  - [x] SubTask 1.1: 使用GSAP timeline或并行to调用
  - [x] SubTask 1.2: 同时启动缩放和平移动画
  - [x] SubTask 1.3: 动画完成后显示面板
  - [x] SubTask 1.4: 面板显示后触发文字动画

- [x] Task 2: 修改hideDetailPanel实现并行动画
  - [x] SubTask 2.1: 先隐藏面板
  - [x] SubTask 2.2: 面板隐藏后同时启动反向平移和缩放恢复

- [x] Task 3: 创建平移动画控制函数
  - [x] SubTask 3.1: 创建setTranslateX函数
  - [x] SubTask 3.2: 使用GSAP控制平移动画
  - [x] SubTask 3.3: 支持与缩放动画并行

- [x] Task 4: 验证动画效果
  - [x] SubTask 4.1: 验证缩放和平移同时进行
  - [x] SubTask 4.2: 验证动画流畅丝滑
  - [x] SubTask 4.3: 验证总动画时间缩短

# Task Dependencies
- [Task 2] depends on [Task 3]
- [Task 1] depends on [Task 3]
- [Task 4] depends on [Task 1, Task 2]
