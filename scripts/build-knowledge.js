/**
 * 知识库构建脚本
 *
 * 将 public/data/*.json 和 public/data/*.pdf 数据转换为文本块，并生成向量索引
 *
 * 使用方法：
 *   node scripts/build-knowledge.js
 *
 * 需要设置环境变量 GLM_API_KEY
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { PDFParse } from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// PDF 文本分块配置
const CHUNK_SIZE = 500;      // 每个块的最大字符数
const CHUNK_OVERLAP = 100;   // 相邻块的重叠字符数

// 配置
const GLM_API_KEY = process.env.GLM_API_KEY;
const EMBEDDING_URL = 'https://open.bigmodel.cn/api/paas/v4/embeddings';

if (!GLM_API_KEY) {
  console.error('Error: GLM_API_KEY not set');
  console.error('Please set environment variable: GLM_API_KEY=your_key');
  process.exit(1);
}

// ============================================
// 文本块生成函数
// ============================================

/**
 * 从斗拱类型数据生成文本块
 */
function generateDougongChunks(data) {
  return data.map(item => ({
    source: 'dougong-types.json',
    type: 'dougong',
    content: `${item.name}是${item.category}类型的斗拱。${item.description}。编号${item.modelId}。`,
    keywords: [item.name, item.category, '斗拱']
  }));
}

/**
 * 从斗拱层级数据生成文本块
 */
function generateHierarchyChunks(data) {
  return data.map(item => {
    const parentInfo = item.parent ? `属于${item.parent}类。` : '';
    const materialInfo = item.material ? `材质为${item.material}。` : '';
    const functionInfo = item.function ? `功能是${item.function}。` : '';

    return {
      source: 'dougong-hierarchy.json',
      type: 'dougong',
      content: `${item.name}${parentInfo}${item.description || ''}${materialInfo}${functionInfo}`,
      keywords: [item.name, item.parent || '斗拱', item.material || '', item.function || '']
    };
  });
}

/**
 * 从历史时间线数据生成文本块
 */
function generateTimelineChunks(data) {
  return data.map(item => {
    const detailsStr = item.details
      ? Object.entries(item.details).map(([k, v]) => `${k}：${v}`).join('，')
      : '';

    return {
      source: 'forbidden-city-timeline.json',
      type: 'history',
      content: `${item.year}年（${item.eraGroup}），${item.title}。${item.description}${detailsStr ? '，' + detailsStr : ''}。`,
      keywords: [item.year.toString(), item.eraGroup, item.category, item.event]
    };
  });
}

/**
 * 从藏品数据生成文本块
 */
function generateCollectionChunks(data) {
  if (!data.categories) return [];

  return data.categories.map(item => ({
    source: 'museum-collections.json',
    type: 'collection',
    content: `故宫博物院${item.name}藏品共${item.count}件，占比${item.percentage}%。${item.description}。代表性藏品包括：${item.highlights?.join('、') || '多种精品'}。`,
    keywords: [item.name, '藏品', '故宫博物院', ...item.highlights || []]
  }));
}

/**
 * 从宫殿收藏雷达数据生成文本块
 */
function generatePalaceChunks(data) {
  if (!data.palaces) return [];

  return data.palaces.map(item => ({
    source: 'palace-collection-radar.json',
    type: 'building',
    content: `${item.name}是故宫的重要宫殿。收藏特点：${item.features?.join('、') || '多样化藏品'}。`,
    keywords: [item.name, '宫殿', '故宫']
  }));
}

// ============================================
// PDF 解析与分块
// ============================================

/**
 * 将长文本按固定大小分块，支持重叠
 * @param {string} text - 待分块的文本
 * @param {string} source - 来源文件名
 * @param {string} type - 内容类型
 * @returns {Array} 文本块数组
 */
function splitTextIntoChunks(text, source, type = 'document') {
  const chunks = [];
  const cleanText = text.replace(/\s+/g, ' ').trim();

  if (cleanText.length <= CHUNK_SIZE) {
    return [{
      source,
      type,
      content: cleanText,
      keywords: [type, source.replace(/\.pdf$/, '')]
    }];
  }

  // 按 CHARTER_SIZE 分块，保留重叠
  let start = 0;
  let chunkIndex = 0;

  while (start < cleanText.length) {
    let end = start + CHUNK_SIZE;

    // 尝试在句子边界处切分
    if (end < cleanText.length) {
      const searchStart = Math.max(start + CHUNK_SIZE - 100, start);
      const searchText = cleanText.slice(searchStart, end);

      // 查找最后一个句号、问号或感叹号
      const lastPunctuation = Math.max(
        searchText.lastIndexOf('。'),
        searchText.lastIndexOf('？'),
        searchText.lastIndexOf('！'),
        searchText.lastIndexOf('.'),
        searchText.lastIndexOf('?'),
        searchText.lastIndexOf('!')
      );

      if (lastPunctuation > 0) {
        end = searchStart + lastPunctuation + 1;
      }
    }

    const chunkContent = cleanText.slice(start, end).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        source,
        type,
        content: chunkContent,
        chunkIndex,
        keywords: [type, source.replace(/\.pdf$/, '')]
      });
      chunkIndex++;
    }

    // 下一块起始位置，考虑重叠
    start = end - CHUNK_OVERLAP;
    if (start <= chunks[chunks.length - 1]?.content.length) {
      start = end;
    }
  }

  return chunks;
}

/**
 * 解析 PDF 文件提取文本
 * @param {string} filePath - PDF 文件路径
 * @returns {Promise<string>} 提取的文本内容
 */
async function parsePdf(filePath) {
  const dataBuffer = fs.readFileSync(filePath);
  // 转换为 Uint8Array
  const uint8Array = new Uint8Array(dataBuffer);

  try {
    const parser = new PDFParse(uint8Array);
    await parser.load();
    const result = await parser.getText();

    // getText 返回 { pages, text, total } 对象
    if (result && typeof result === 'object') {
      // 使用 text 属性或合并所有页面
      if (result.text) {
        return result.text;
      } else if (Array.isArray(result.pages)) {
        return result.pages.join('\n');
      }
    } else if (typeof result === 'string') {
      return result;
    }
    return '';
  } catch (error) {
    console.error(`[PDF] Error parsing ${filePath}:`, error.message);
    return '';
  }
}

/**
 * 从 PDF 文件生成文本块
 * @param {string} filePath - PDF 文件路径
 * @param {string} filename - 文件名
 * @returns {Promise<Array>} 文本块数组
 */
async function generatePdfChunks(filePath, filename) {
  console.log(`  [PDF] Parsing ${filename}...`);

  const text = await parsePdf(filePath);

  if (!text || text.trim().length === 0) {
    console.warn(`  [PDF] No text extracted from ${filename}`);
    return [];
  }

  // 推断内容类型
  let type = 'document';
  const lowerName = filename.toLowerCase();

  if (lowerName.includes('历史') || lowerName.includes('history')) {
    type = 'history';
  } else if (lowerName.includes('建筑') || lowerName.includes('building')) {
    type = 'building';
  } else if (lowerName.includes('斗拱') || lowerName.includes('dougong')) {
    type = 'dougong';
  } else if (lowerName.includes('藏品') || lowerName.includes('collection')) {
    type = 'collection';
  }

  const chunks = splitTextIntoChunks(text, filename, type);
  console.log(`  [PDF] ${filename}: ${chunks.length} chunks (${text.length} chars)`);

  return chunks;
}

// ============================================
// Embedding API 调用
// ============================================

async function getEmbedding(text) {
  try {
    const response = await axios.post(EMBEDDING_URL, {
      model: 'embedding-3',
      input: text
    }, {
      headers: {
        'Authorization': `Bearer ${GLM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data?.data?.[0]?.embedding || null;
  } catch (error) {
    console.error(`[Embedding] Error for "${text.substring(0, 50)}...":`, error.message);
    return null;
  }
}

// ============================================
// 主构建流程
// ============================================

async function buildKnowledgeBase() {
  console.log('========================================');
  console.log('Building RAG Knowledge Base');
  console.log('========================================\n');

  // 1. 读取 JSON 数据源
  console.log('[Step 1] Loading JSON data sources...');

  const dataSources = {
    'dougong-types.json': { path: 'public/data/dougong-types.json', generator: generateDougongChunks },
    'dougong-hierarchy.json': { path: 'public/data/dougong-hierarchy.json', generator: generateHierarchyChunks },
    'forbidden-city-timeline.json': { path: 'public/data/forbidden-city-timeline.json', generator: generateTimelineChunks },
    'museum-collections.json': { path: 'public/data/museum-collections.json', generator: generateCollectionChunks },
    'palace-collection-radar.json': { path: 'public/data/palace-collection-radar.json', generator: generatePalaceChunks }
  };

  let allChunks = [];

  // 处理 JSON 文件
  for (const [filename, config] of Object.entries(dataSources)) {
    const filePath = path.join(projectRoot, config.path);

    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        const chunks = config.generator(data);
        allChunks.push(...chunks);
        console.log(`  - ${filename}: ${chunks.length} chunks`);
      } catch (error) {
        console.warn(`  - ${filename}: Failed to parse (${error.message})`);
      }
    } else {
      console.warn(`  - ${filename}: File not found`);
    }
  }

  // 2. 扫描并处理 PDF 文件
  console.log('\n[Step 1.5] Scanning PDF files...');

  const dataDir = path.join(projectRoot, 'public/data');

  if (fs.existsSync(dataDir)) {
    const files = fs.readdirSync(dataDir);
    const pdfFiles = files.filter(f => f.toLowerCase().endsWith('.pdf'));

    if (pdfFiles.length > 0) {
      console.log(`  Found ${pdfFiles.length} PDF file(s)`);

      for (const pdfFile of pdfFiles) {
        const pdfPath = path.join(dataDir, pdfFile);

        try {
          const pdfChunks = await generatePdfChunks(pdfPath, pdfFile);
          allChunks.push(...pdfChunks);
        } catch (error) {
          console.warn(`  - ${pdfFile}: Failed to process (${error.message})`);
        }
      }
    } else {
      console.log('  No PDF files found in public/data/');
    }
  }

  console.log(`\nTotal chunks: ${allChunks.length}\n`);

  // 2. 生成向量嵌入
  console.log('[Step 2] Generating embeddings...');
  console.log('This may take a few minutes...\n');

  const embeddings = [];
  const validChunks = [];

  for (let i = 0; i < allChunks.length; i++) {
    const chunk = allChunks[i];
    const embedding = await getEmbedding(chunk.content);

    if (embedding) {
      embeddings.push(embedding);
      validChunks.push(chunk);
    }

    // 进度显示
    if ((i + 1) % 5 === 0 || i === allChunks.length - 1) {
      console.log(`  Progress: ${i + 1}/${allChunks.length} (${((i + 1) / allChunks.length * 100).toFixed(1)}%)`);
    }

    // 避免请求过快
    if (i < allChunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log(`\nValid embeddings: ${embeddings.length}\n`);

  // 3. 保存索引文件
  console.log('[Step 3] Saving index files...');

  const knowledgeDir = path.join(projectRoot, 'backend/knowledge');

  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
  }

  // 保存文本块
  fs.writeFileSync(
    path.join(knowledgeDir, 'chunks.json'),
    JSON.stringify(validChunks, null, 2)
  );

  // 保存向量嵌入
  fs.writeFileSync(
    path.join(knowledgeDir, 'embeddings.json'),
    JSON.stringify(embeddings)
  );

  // 保存元数据
  const metadata = {
    totalChunks: validChunks.length,
    embeddingDimension: embeddings[0]?.length || 0,
    sources: Object.keys(dataSources),
    pdfSupport: true,
    chunkConfig: {
      chunkSize: CHUNK_SIZE,
      chunkOverlap: CHUNK_OVERLAP
    },
    buildTime: new Date().toISOString()
  };

  fs.writeFileSync(
    path.join(knowledgeDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  );

  console.log(`  - chunks.json: ${validChunks.length} chunks`);
  console.log(`  - embeddings.json: ${embeddings.length} vectors`);
  console.log(`  - metadata.json: build info`);

  console.log('\n========================================');
  console.log('Knowledge base build complete!');
  console.log('========================================\n');

  console.log('Next steps:');
  console.log('  1. Copy .env.example to .env and set GLM_API_KEY');
  console.log('  2. Run: cd backend && npm install && npm start');
  console.log('  3. Test: curl http://localhost:3000/api/chat/status');
}

// 执行构建
buildKnowledgeBase().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});