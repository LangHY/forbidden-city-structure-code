# Tasks

- [x] Task 1: 根据标记位置精确计算滚动进度映射
  - [x] SubTask 1.1: 修正地图标记顺序（午门在上方先进入视口）
  - [x] SubTask 1.2: 修正locations数组顺序（午门index 0，神武门index 4）
  - [x] SubTask 1.3: 更新activeIndex计算逻辑

- [x] Task 2: 验证地图容器移动参数
  - [x] SubTask 2.1: 确保地图移动距离正确
  - [x] SubTask 2.2: 确保scrub值提供平滑跟随

- [x] Task 3: 测试验证
  - [x] SubTask 3.1: 测试滚动时地图标记与文字内容对应
  - [x] SubTask 3.2: 测试从午门到神武门的完整滚动体验

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
