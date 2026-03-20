# 文本逐行上浮动画优化计划

## 问题分析
当前实现是按段落（`<p>`标签）触发动画，用户需要的是按视觉行（每一行文字）逐行浮起。

**当前效果**：
```
[标签浮起] → [标题浮起] → [副标题浮起] → [段落1整体浮起] → [段落2整体浮起]
```

**期望效果**：
```
[标签浮起] → [标题浮起] → [副标题浮起] → [段落1第1行浮起] → [段落1第2行浮起] → [段落2第1行浮起] → ...
```

## 实现方案

### 方案：使用行测量和动态拆分

**原理**：
1. 将文本渲染到容器中
2. 使用 `getClientRects()` 或行高计算检测实际渲染的行数
3. 将每行文字包装成独立的 `<span class="float-line">` 元素
4. 逐行触发动画

### 实现步骤

#### 步骤1：创建行拆分函数
```javascript
function splitTextIntoLines(element) {
    // 获取元素的文本内容
    // 使用 Range API 检测每行的边界
    // 将每行包装成独立的 span 元素
}
```

#### 步骤2：修改动画触发逻辑
```javascript
function animateTextLines(title, subtitle, content) {
    // 1. 标签、标题、副标题保持原样（单行）
    // 2. 正文内容按视觉行拆分
    // 3. 逐行触发动画，每行间隔 80-100ms
}
```

#### 步骤3：CSS样式调整
```css
.float-line {
    display: block;  /* 每行独立显示 */
    opacity: 0;
    transform: translateY(30px);
}

.float-line.animate {
    animation: floatUp 0.7s cubic-bezier(...) forwards;
}
```

## 详细修改内容

### 1. JavaScript修改

**新增函数 `wrapLinesSpans`**：
- 输入：包含文本的DOM元素
- 功能：将文本按视觉行拆分成独立的span元素
- 输出：拆分后的DOM结构

**修改函数 `animateTextLines`**：
- 正文内容先调用 `wrapLinesSpans` 拆分
- 获取所有 `.float-line` 元素
- 逐行触发动画

### 2. CSS修改

**新增样式**：
```css
.text-content .float-line {
    display: block;
    line-height: 2;
    opacity: 0;
    transform: translateY(30px);
}

.text-content .float-line.animate {
    animation: floatUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}
```

### 3. 行拆分算法

```javascript
function wrapLinesSpans(element) {
    const text = element.textContent;
    const words = text.split('');
    element.innerHTML = '';
    
    // 创建测量用的span
    const span = document.createElement('span');
    element.appendChild(span);
    
    let lines = [];
    let currentLine = '';
    let lastTop = 0;
    
    words.forEach(char => {
        span.textContent += char;
        const rect = span.getBoundingClientRect();
        
        if (rect.top > lastTop && currentLine) {
            // 检测到换行
            lines.push(currentLine);
            currentLine = char;
            lastTop = rect.top;
        } else {
            currentLine += char;
        }
    });
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    // 将每行包装成span
    element.innerHTML = lines.map(line => 
        `<span class="float-line">${line}</span>`
    ).join('');
    
    return element.querySelectorAll('.float-line');
}
```

## 修改文件
- `public/axis-map.html`

## 预期效果
- 文本按视觉行逐行浮起
- 每行间隔约80-100ms
- 动画流畅自然，模拟从水中浮现的效果
