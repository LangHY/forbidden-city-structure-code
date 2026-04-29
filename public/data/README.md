# 知识库数据目录

本目录用于存放 RAG 知识库的数据源文件。

## 支持的文件类型

| 类型 | 格式 | 说明 |
|------|------|------|
| JSON | `.json` | 结构化数据，如建筑信息、藏品数据等 |
| PDF | `.pdf` | 文本文档，自动解析并分块 |

## JSON 数据源

现有 JSON 文件：

- `dougong-types.json` - 斗拱类型定义
- `dougong-hierarchy.json` - 斗拱层级结构
- `forbidden-city-timeline.json` - 历史时间线
- `museum-collections.json` - 博物馆藏品统计
- `palace-collection-radar.json` - 宫殿收藏数据

## PDF 文件

将 PDF 文件放入本目录即可，构建脚本会自动扫描并解析。

### 命名建议

为了更好的内容分类，建议使用以下命名前缀：

- `历史-xxx.pdf` → 分类为 `history`
- `建筑-xxx.pdf` → 分类为 `building`
- `斗拱-xxx.pdf` → 分类为 `dougong`
- `藏品-xxx.pdf` → 分类为 `collection`

### PDF 处理规则

- 文本自动提取并清理空白字符
- 按 500 字符分块，块间重叠 100 字符
- 优先在句子边界处切分
- 自动推断内容类型

## 重新构建知识库

```bash
GLM_API_KEY=your_key node scripts/build-knowledge.js
```
