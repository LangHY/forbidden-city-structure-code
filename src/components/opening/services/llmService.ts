/**
 * 开场页 LLM 服务 - 调用 GLM-4-Flash API 生成诗句和描述
 */

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL_NAME = 'glm-4-flash';

// API Key - 从环境变量获取
const API_KEY = import.meta.env.VITE_GLM_API_KEY || '';

// 缓存
let poemCache: PoemData | null = null;
let descriptionCache: DescriptionData | null = null;

/**
 * 诗句数据
 */
export interface PoemData {
  left: string;   // 左侧诗句（4字）
  right: string;  // 右侧诗句（3字或4字）
}

/**
 * 描述数据
 */
export interface DescriptionData {
  title: string;       // 标题
  description: string; // 描述文字
}

/**
 * 验证诗句格式是否正确（4+4 或 4+3）
 */
function validatePoemFormat(left: string, right: string): boolean {
  const leftLen = left.length;
  const rightLen = right.length;

  // 左侧必须是4字
  if (leftLen !== 4) return false;

  // 右侧必须是3字或4字
  if (rightLen !== 3 && rightLen !== 4) return false;

  // 检查是否都是汉字
  const chineseRegex = /^[\u4e00-\u9fa5]+$/;
  if (!chineseRegex.test(left) || !chineseRegex.test(right)) return false;

  return true;
}

/**
 * 生成开场页诗句
 * @param forceNew 强制生成新内容，不使用缓存
 */
export async function generatePoem(forceNew: boolean = false): Promise<PoemData> {
  if (poemCache && !forceNew) return poemCache;

  // 内部函数：调用 API 生成诗句
  async function callLLM(): Promise<{ left: string; right: string } | null> {
    const prompt = `为故宫建筑生成一句诗句。

【格式要求 - 必须严格遵守】
- 左侧：正好4个汉字
- 右侧：正好3个或4个汉字
- 总字数：7字或8字

【正确示例】
✅ {"left":"金瓦红墙","right":"辉映千古"}  // 4+4
✅ {"left":"红墙宫里","right":"万重门"}    // 4+3

【错误示例 - 绝对禁止】
❌ {"left":"金瓦红墙映","right":"辉映千古"}  // 左侧5字
❌ {"left":"金瓦红","right":"辉映千古"}      // 左侧3字
❌ {"left":"金瓦红墙","right":"辉映千古长"}  // 右侧5字

【内容要求】
1. 与故宫、红墙、宫殿、斗拱、琉璃瓦等元素相关
2. 意境优美，有古典韵味
3. 纯汉字，无标点符号

只返回JSON，不要解释：{"left":"四字","right":"三或四字"}`;

    try {
      const response = await fetch(GLM_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 100,
        }),
      });

      if (!response.ok) return null;

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || '';

      // 清理 markdown 代码块
      content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

      const parsed = JSON.parse(content);
      return {
        left: parsed.left?.trim() || '',
        right: parsed.right?.trim() || '',
      };
    } catch {
      return null;
    }
  }

  // 最多重试 3 次
  for (let attempt = 0; attempt < 3; attempt++) {
    const result = await callLLM();

    if (result && validatePoemFormat(result.left, result.right)) {
      poemCache = result;
      return poemCache;
    }

    console.warn(`诗句格式验证失败，第 ${attempt + 1} 次重试...`);
  }

  // 所有重试都失败，使用默认诗句
  console.warn('诗句生成失败，使用默认诗句');
  return getDefaultPoem();
}

/**
 * 生成开场页描述 - 故宫相关数据与简介
 * @param forceNew 强制生成新内容，不使用缓存
 */
export async function generateDescription(forceNew: boolean = false): Promise<DescriptionData> {
  if (descriptionCache && !forceNew) return descriptionCache;

  const prompt = `你是一位故宫文化专家。请生成一段关于故宫的数据简介，要求：

【格式要求 - 必须严格遵守】
- title: 2-4个汉字，简洁有力，作为主题标题
- description: 60-90个汉字，包含具体数据和背景介绍

【内容要求】
1. 必须包含具体数字（如：年份、数量、面积等）
2. 主题范围：建筑数量、文物收藏、建造历史、空间布局、建筑特色等
3. 语言要有文化底蕴，但数据必须准确
4. 每次生成不同主题，轮流覆盖不同方面

【正确示例】
✅ {"title":"建筑群组","description":"故宫现存建筑9371间，占地72万平方米，建筑面积15万平方米。其中太和殿最高，达35.05米，是现存最大的木结构宫殿。"}
✅ {"title":"文物珍藏","description":"故宫博物院收藏文物186万余件，涵盖青铜、玉器、书画、陶瓷等25大类。其中珍贵文物占比93.2%，居世界博物馆之首。"}
✅ {"title":"建造岁月","description":"故宫始建于明永乐四年（1406年），历时14年于1420年建成。征调工匠23万人，民夫上百万，是当时世界最大的建筑工程。"}
✅ {"title":"中轴布局","description":"故宫沿北京城中轴线对称布局，全长961米，贯穿午门、太和殿、乾清宫等核心建筑，体现天人合一的礼制思想。"}

只返回JSON格式，不要任何解释：{"title":"标题","description":"描述文字"}`;

  try {
    const response = await fetch(GLM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content || '';

    // 清理 markdown 代码块
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(content);
      descriptionCache = {
        title: parsed.title || '紫禁之城',
        description: parsed.description || '故宫，又名紫禁城，是世界上现存规模最大、保存最完整的木质结构古建筑群。',
      };
      return descriptionCache;
    } catch {
      return getDefaultDescription();
    }
  } catch (error) {
    console.error('生成描述失败:', error);
    return getDefaultDescription();
  }
}

// 默认诗句库（符合 4+4 或 4+3 格式）
const DEFAULT_POEMS: PoemData[] = [
  { left: '红墙宫里', right: '万重门' },      // 4+3
  { left: '金瓦红墙', right: '辉映千古' },    // 4+4
  { left: '斗拱飞檐', right: '承天工' },      // 4+3
  { left: '琉璃瓦上', right: '映斜阳' },      // 4+3
  { left: '朱门深院', right: '锁春秋' },      // 4+3
  { left: '龙纹凤彩', right: '显皇家' },      // 4+3
  { left: '雕梁画栋', right: '见匠心' },      // 4+3
  { left: '紫禁城中', right: '岁月长' },      // 4+3
];

/**
 * 默认诗句（随机从库中选取）
 */
function getDefaultPoem(): PoemData {
  return DEFAULT_POEMS[Math.floor(Math.random() * DEFAULT_POEMS.length)];
}

/**
 * 默认描述数据 - 故宫相关
 */
function getDefaultDescription(): DescriptionData {
  const defaults: DescriptionData[] = [
    {
      title: '建筑群组',
      description: '故宫现存建筑9371间，占地72万平方米，建筑面积15万平方米。其中太和殿最高，达35.05米，是现存最大的木结构宫殿。',
    },
    {
      title: '文物珍藏',
      description: '故宫博物院收藏文物186万余件，涵盖青铜、玉器、书画、陶瓷等25大类。其中珍贵文物占比93.2%，居世界博物馆之首。',
    },
    {
      title: '建造岁月',
      description: '故宫始建于明永乐四年（1406年），历时14年于1420年建成。征调工匠23万人，民夫上百万，是当时世界最大的建筑工程。',
    },
    {
      title: '中轴布局',
      description: '故宫沿北京城中轴线对称布局，全长961米，贯穿午门、太和殿、乾清宫等核心建筑，体现天人合一的礼制思想。',
    },
    {
      title: '琉璃瓦顶',
      description: '故宫建筑屋顶铺设黄色琉璃瓦约12万件，每件重约3公斤。黄色为皇家专用色，象征皇权至高无上。',
    },
    {
      title: '神兽守护',
      description: '太和殿屋脊排列10只脊兽，是中国古建筑中数量最多的。依次为：龙、凤、狮子、天马、海马、狻猊、押鱼、獬豸、斗牛、行什。',
    },
  ];

  return defaults[Math.floor(Math.random() * defaults.length)];
}

/**
 * 预加载开场页内容
 */
export function preloadOpeningContent() {
  generatePoem();
  generateDescription();
}
