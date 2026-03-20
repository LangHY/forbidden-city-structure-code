# Tasks

- [x] Task 1: 重构缩放状态管理
  - [x] SubTask 1.1: 创建统一的缩放状态变量
  - [x] SubTask 1.2: 添加长按状态标志位
  - [x] SubTask 1.3: 创建缩放动画控制函数

- [x] Task 2: 修复ScrollTrigger与长按冲突
  - [x] SubTask 2.1: 在ScrollTrigger onUpdate中检查长按状态
  - [x] SubTask 2.2: 长按时暂停ScrollTrigger缩放
  - [x] SubTask 2.3: 松开后恢复ScrollTrigger缩放

- [x] Task 3: 修复拖动缩放逻辑
  - [x] SubTask 3.1: 记录拖动开始时的缩放值
  - [x] SubTask 3.2: 基于当前值计算缩放变化
  - [x] SubTask 3.3: 使用GSAP平滑更新缩放

- [x] Task 4: 协调面板与缩放动画时序
  - [x] SubTask 4.1: 使用GSAP timeline组织动画序列
  - [x] SubTask 4.2: 确保缩放动画先于文字动画
  - [x] SubTask 4.3: 面板隐藏时同步缩放恢复

- [x] Task 5: 验证动画流畅性
  - [x] SubTask 5.1: 验证长按时缩放平滑
  - [x] SubTask 5.2: 验证拖动时无抖动
  - [x] SubTask 5.3: 验证松开后恢复平滑

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
- [Task 5] depends on [Task 4]
