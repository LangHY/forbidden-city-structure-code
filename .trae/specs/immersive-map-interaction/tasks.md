# Tasks

- [x] Task 1: 修改初始布局状态
  - [x] SubTask 1.1: 添加沉浸模式CSS类和变量
  - [x] SubTask 1.2: 设置初始状态下地图面板width: 100%
  - [x] SubTask 1.3: 设置初始状态下文字面板opacity: 0, visibility: hidden
  - [x] SubTask 1.4: 调整进度条初始位置为left: 0, width: 100%

- [x] Task 2: 实现长按检测逻辑
  - [x] SubTask 2.1: 创建长按状态变量和定时器
  - [x] SubTask 2.2: 监听mousedown事件启动定时器
  - [x] SubTask 2.3: 监听mouseup事件清除定时器
  - [x] SubTask 2.4: 设置长按阈值300ms

- [x] Task 3: 实现面板显示/隐藏动画
  - [x] SubTask 3.1: 创建切换沉浸/详情模式的函数
  - [x] SubTask 3.2: 添加CSS transition属性实现平滑过渡
  - [x] SubTask 3.3: 实现文字面板渐入动画（500ms ease-in-out）
  - [x] SubTask 3.4: 实现地图面板宽度过渡动画
  - [x] SubTask 3.5: 实现进度条位置过渡动画

- [x] Task 4: 实现长按期间地点切换
  - [x] SubTask 4.1: 记录长按开始时的鼠标Y坐标
  - [x] SubTask 4.2: 监听mousemove事件计算Y轴偏移
  - [x] SubTask 4.3: 根据偏移量计算目标地点索引
  - [x] SubTask 4.4: 使用节流函数优化mousemove处理
  - [x] SubTask 4.5: 触发地点切换和文字更新

- [x] Task 5: 添加视觉反馈和光标样式
  - [x] SubTask 5.1: 添加长按时的光标反馈样式
  - [x] SubTask 5.2: 添加过渡期间的视觉提示
  - [x] SubTask 5.3: 确保交互区域的交互性明确

- [x] Task 6: 验证交互效果
  - [x] SubTask 6.1: 验证初始沉浸式状态正确
  - [x] SubTask 6.2: 验证长按检测准确（<100ms响应）
  - [x] SubTask 6.3: 验证动画流畅（60fps）
  - [x] SubTask 6.4: 验证地点切换响应准确
  - [x] SubTask 6.5: 验证松开后正确恢复沉浸式状态

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 3]
- [Task 6] depends on [Task 4, Task 5]
