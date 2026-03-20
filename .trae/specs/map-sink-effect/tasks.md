# Tasks

- [x] Task 1: 修改showDetailPanel函数实现下沉效果
  - [x] SubTask 1.1: 先执行缩放下沉动画(500ms)
  - [x] SubTask 1.2: 下沉动画完成后再移除immersive-mode类
  - [x] SubTask 1.3: 布局变化后500ms触发文字动画

- [x] Task 2: 修改hideDetailPanel函数实现恢复顺序
  - [x] SubTask 2.1: 先添加immersive-mode类隐藏面板
  - [x] SubTask 2.2: 等待面板隐藏动画完成(500ms)
  - [x] SubTask 2.3: 面板隐藏后执行缩放恢复动画

- [x] Task 3: 调整动画时序参数
  - [x] SubTask 3.1: 下沉动画使用ease-out缓动
  - [x] SubTask 3.2: 恢复动画使用ease-in缓动
  - [x] SubTask 3.3: 确保动画衔接平滑

- [x] Task 4: 验证下沉效果
  - [x] SubTask 4.1: 验证长按时先下沉再显示面板
  - [x] SubTask 4.2: 验证松开时先隐藏面板再恢复
  - [x] SubTask 4.3: 验证动画层次清晰

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 1]
- [Task 4] depends on [Task 2, Task 3]
