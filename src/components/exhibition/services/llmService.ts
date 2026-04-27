/**
 * LLM 服务 - 调用 GLM-4-Flash API 生成结构描述和数据
 */

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL_NAME = 'glm-4-flash';

// API Key - 从环境变量获取
let apiKey = import.meta.env.VITE_GLM_API_KEY || '';

// 结构信息缓存
const structureCache: Record<string, StructureInfo> = {};

// 请求超时时间（毫秒）
const REQUEST_TIMEOUT = 8000;

export function setApiKey(key: string) {
  apiKey = key;
}

export function getApiKey() {
  return apiKey;
}

/**
 * 带超时的 fetch
 */
async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 组件数据结构
 */
export interface ComponentData {
  name: string;
  nameEn: string;
  description: string;
  material: string;
  function: string;
}

/**
 * 技术参数
 */
export interface TechnicalParams {
  era: string;
  style: string;
  loadBearing: string;
  complexity: string;
}

/**
 * 完整的结构信息
 */
export interface StructureInfo {
  title: string;
  subtitle: string;
  description: string;
  historicalContext: string;
  components: ComponentData[];
  technicalParams: TechnicalParams;
  funFacts: string[];
}

/**
 * 生成斗拱结构的完整信息
 */
export async function generateStructureInfo(
  structureName: string
): Promise<StructureInfo> {
  if (!apiKey) {
    return getDefaultStructureInfo(structureName);
  }

  // 专业化的 prompt，确保生成高质量斗拱相关内容
  const prompt = `你是一位中国古代建筑研究专家，精通斗拱结构。请为"${structureName}"生成专业档案。

【身份设定】
你是故宫博物院古建筑研究员，专攻斗拱结构三十年，文风典雅严谨，善用典故。

【输出格式 - 严格 JSON】
{
  "title": "斗拱类型名称",
  "subtitle": "一句话概括其建筑地位",
  "description": "100-150字的专业描述，阐述结构特点、受力原理、艺术价值",
  "historicalContext": "80-100字的历史背景，包含年代、流行区域、代表建筑",
  "components": [
    {
      "name": "构件中文名",
      "nameEn": "拼音",
      "description": "简短描述",
      "material": "材质（如：楠木、松木、柏木）",
      "function": "结构功能（如：承重、连接、传力）"
    }
  ],
  "technicalParams": {
    "era": "流行年代（如：唐宋、明清）",
    "style": "建筑风格（如：官式、民间、园林）",
    "loadBearing": "承重等级（轻型/中型/重型）",
    "complexity": "结构复杂度（简单/中等/复杂）"
  },
  "funFacts": ["趣味知识1", "趣味知识2"]
}

【内容要求】
1. 所有内容必须与斗拱结构紧密相关，不可偏离主题
2. description 需包含：结构形式、受力特点、装饰艺术
3. historicalContext 需提及：具体年代、典型建筑实例
4. components 限 2-3 个核心构件，必须是斗拱组成部分
5. 语言典雅专业，可适当引用古籍（如《营造法式》）

【禁止事项】
- 禁止生成与斗拱无关的内容
- 禁止使用现代网络用语
- 禁止虚构历史事实

只返回 JSON，不要任何解释。`;

  try {
    const response = await fetchWithTimeout(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 400,
      }),
    }, REQUEST_TIMEOUT);

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();

    // 检查 API 返回的错误（如速率限制）
    if (data.error) {
      console.warn('LLM API 返回错误:', data.error.message);
      return getDefaultStructureInfo(structureName);
    }

    let content = data.choices?.[0]?.message?.content || '';

    // 清理 markdown 代码块
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(content);
      return validateAndFillStructure(parsed, structureName);
    } catch {
      return getDefaultStructureInfo(structureName);
    }
  } catch (error) {
    console.error('LLM API 调用失败:', error);
    return getDefaultStructureInfo(structureName);
  }
}

/**
 * 验证并填充缺失字段
 */
function validateAndFillStructure(data: any, structureName: string): StructureInfo {
  return {
    title: data.title || structureName,
    subtitle: data.subtitle || '中国传统建筑构件',
    description: data.description || `${structureName}是斗拱结构的典型形式。`,
    historicalContext: data.historicalContext || '流行于中国古代建筑中。',
    components: Array.isArray(data.components) ? data.components.slice(0, 5).map((c: any) => ({
      name: c.name || '构件',
      nameEn: c.nameEn || 'Component',
      description: c.description || '',
      material: c.material || '木材',
      function: c.function || '结构支撑',
    })) : [],
    technicalParams: {
      era: data.technicalParams?.era || '唐宋',
      style: data.technicalParams?.style || '官式',
      loadBearing: data.technicalParams?.loadBearing || '中等',
      complexity: data.technicalParams?.complexity || '中等',
    },
    funFacts: Array.isArray(data.funFacts) ? data.funFacts.slice(0, 3) : [],
  };
}

/**
 * 默认结构信息 - 专业化的斗拱数据
 */
function getDefaultStructureInfo(structureName: string): StructureInfo {
  // 根据不同斗拱类型返回专业化的默认数据
  const defaults: Record<string, StructureInfo> = {
    '重栱素方': {
      title: '重栱素方',
      subtitle: '双层拱件承托素方，结构稳重',
      description: '重栱素方由两层拱件叠加而成，下层为泥道拱，上层为令拱，共同承托素方。此种结构增强了斗拱的承载能力，常见于殿阁式建筑的柱头铺作，体现了宋《营造法式》中"重拱造"的典型做法。',
      historicalContext: '盛行于唐宋时期，多见于官式建筑。五台山佛光寺东大殿、山西应县木塔等均有实例，是古代木构建筑技术成熟的重要标志。',
      components: [
        { name: '栌斗', nameEn: 'Lu Dou', description: '坐于柱头的大斗', material: '楠木', function: '承重' },
        { name: '泥道拱', nameEn: 'Ni Dao Gong', description: '第一层横拱', material: '松木', function: '传力' },
        { name: '令拱', nameEn: 'Ling Gong', description: '第二层横拱', material: '松木', function: '承托' },
      ],
      technicalParams: { era: '唐宋', style: '官式', loadBearing: '中型', complexity: '中等' },
      funFacts: ['《营造法式》详载其制，为宋代官式标准做法', '重拱结构较单拱增加约三成承载能力'],
    },
    '带昂转角铺作': {
      title: '带昂转角铺作',
      subtitle: '转角处的复杂斗拱组合',
      description: '带昂转角铺作位于建筑转角柱头之上，因需承托两个方向的屋檐荷载，结构最为复杂。其核心特征是使用斜向伸出的昂杆，形成杠杆式的传力机制，将屋顶荷载均匀传递至柱身。',
      historicalContext: '转角铺作始见于唐代，至宋代发展成熟。故宫太和殿、山西晋祠圣母殿等古建筑中，转角铺作皆为结构精华所在，展现了古代工匠对力学原理的深刻理解。',
      components: [
        { name: '角昂', nameEn: 'Jiao Ang', description: '转角斜昂', material: '柏木', function: '杠杆传力' },
        { name: '由昂', nameEn: 'You Ang', description: '上层斜昂', material: '柏木', function: '延伸支撑' },
        { name: '角梁', nameEn: 'Jiao Liang', description: '转角大梁', material: '楠木', function: '承托屋角' },
      ],
      technicalParams: { era: '唐宋明清', style: '官式', loadBearing: '重型', complexity: '复杂' },
      funFacts: ['转角铺作构件数量可达柱头铺作的三倍', '故宫太和殿转角铺作共有七层昂杆叠涩'],
    },
  };

  // 如果有匹配的专业数据则返回，否则返回通用默认
  if (defaults[structureName]) {
    return defaults[structureName];
  }

  // 通用默认数据
  return {
    title: structureName,
    subtitle: '中国传统建筑斗拱构件',
    description: `${structureName}是中国传统建筑斗拱结构的重要组成部分。斗拱作为中国古代建筑特有的构件体系，由斗、拱、昂等组成，承担着传递荷载、承托屋檐、装饰建筑的多重功能。`,
    historicalContext: '斗拱体系发源于战国，成熟于唐宋，延续至明清。《营造法式》对其形制有详尽记载，是研究中国古代建筑技术的珍贵文献。',
    components: [
      { name: '栌斗', nameEn: 'Lu Dou', description: '方形大斗', material: '楠木', function: '承重基座' },
      { name: '华拱', nameEn: 'Hua Gong', description: '前后挑出的拱', material: '松木', function: '悬挑承重' },
      { name: '昂', nameEn: 'Ang', description: '斜向构件', material: '柏木', function: '杠杆传力' },
    ],
    technicalParams: {
      era: '唐宋',
      style: '官式',
      loadBearing: '中型',
      complexity: '中等',
    },
    funFacts: ['斗拱是中国古建筑的"灵魂构件"', '故宫太和殿使用了最复杂的斗拱体系'],
  };
}

/**
 * 兼容旧接口
 */
export async function generateStructureDescription(
  structureName: string
): Promise<{ title: string; description: string }> {
  const info = await generateStructureInfo(structureName);
  return {
    title: info.title,
    description: info.description,
  };
}

/**
 * 预加载相邻章节的结构信息
 * @param currentChapterId 当前章节 ID
 * @param chapters 所有章节数组
 */
export function preloadAdjacentStructures(
  currentChapterId: string,
  chapters: Array<{ id: string; label: string }>
) {
  const currentIndex = chapters.findIndex(c => c.id === currentChapterId);
  const toPreload: number[] = [];

  // 预加载前后各一个
  if (currentIndex > 0) toPreload.push(currentIndex - 1);
  if (currentIndex < chapters.length - 1) toPreload.push(currentIndex + 1);

  toPreload.forEach(index => {
    const chapter = chapters[index];
    if (chapter && !structureCache[chapter.id]) {
      generateStructureInfo(chapter.label).then(info => {
        structureCache[chapter.id] = info;
      });
    }
  });
}

// 导出缓存供外部使用
export { structureCache };
