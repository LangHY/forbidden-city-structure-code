# Tasks

- [x] Task 1: 定义上浮动画CSS关键帧
  - [x] SubTask 1.1: 创建 `@keyframes floatUp` 动画定义
  - [x] SubTask 1.2: 设置动画起始状态（translateY: 30px, opacity: 0）
  - [x] SubTask 1.3: 设置动画结束状态（translateY: 0, opacity: 1）
  - [x] SubTask 1.4: 配置缓动函数（cubic-bezier）

- [x] Task 2: 实现文本行拆分逻辑
  - [x] SubTask 2.1: 创建文本行拆分函数，将段落拆分为独立行元素
  - [x] SubTask 2.2: 为每行文本添加独立的DOM元素包装
  - [x] SubTask 2.3: 保留原始文本的语义结构

- [x] Task 3: 实现顺序动画触发器
  - [x] SubTask 3.1: 创建动画队列管理器
  - [x] SubTask 3.2: 实现固定时间间隔的动画触发（120ms）
  - [x] SubTask 3.3: 添加动画完成回调

- [x] Task 4: 集成到地点切换逻辑
  - [x] SubTask 4.1: 在地点切换时触发文本上浮动画
  - [x] SubTask 4.2: 实现旧文本淡出效果
  - [x] SubTask 4.3: 确保动画期间文本内容正确更新

- [x] Task 5: 添加浏览器兼容性处理
  - [x] SubTask 5.1: 添加CSS前缀（-webkit-）
  - [x] SubTask 5.2: 添加降级方案（不支持动画时直接显示）
  - [x] SubTask 5.3: 测试主流浏览器兼容性

# Task Dependencies
- [Task 2] depends on [Task 1]
- [Task 3] depends on [Task 2]
- [Task 4] depends on [Task 3]
- [Task 5] depends on [Task 4]
