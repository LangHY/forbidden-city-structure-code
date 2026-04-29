/**
 * Axis LLM 服务 - 调用 GLM-4.7-Flash API 生成故宫建筑描述
 */

const GLM_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const MODEL_NAME = 'glm-4-flash'; // 使用 glm-4-flash 避免速率限制

// API Key - 从环境变量获取
let apiKey = import.meta.env.VITE_GLM_API_KEY || '';

// 建筑信息缓存
const buildingCache: Record<string, BuildingInfo> = {};

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
 * 建筑信息结构
 */
export interface BuildingInfo {
  title: string;
  subtitle: string;
  description: string;
  historicalContext: string;
  components: Array<{
    name: string;
    nameEn: string;
    description: string;
    material: string;
    function: string;
  }>;
  technicalParams: {
    era: string;
    style: string;
    loadBearing: string;
    complexity: string;
  };
  funFacts: string[];
}

/**
 * 生成故宫建筑的完整信息
 */
export async function generateBuildingInfo(
  buildingName: string,
  buildingData?: {
    location?: string;
    form?: string;
  }
): Promise<BuildingInfo> {
  if (!apiKey) {
    return getDefaultBuildingInfo(buildingName, buildingData);
  }

  // 检查缓存
  if (buildingCache[buildingName]) {
    return buildingCache[buildingName];
  }

  const prompt = `你是一位故宫博物院资深研究员，精通明清宫廷建筑。请为"${buildingName}"生成专业档案。

【身份设定】
你是故宫博物院古建筑研究专家，专攻明清宫廷建筑三十年，文风典雅严谨，善引典籍。

【已知信息】
- 建筑名称：${buildingName}
${buildingData?.location ? `- 方位：${buildingData.location}` : ''}
${buildingData?.form ? `- 形制：${buildingData.form}` : ''}

【输出格式 - 严格 JSON】
{
  "title": "建筑名称",
  "subtitle": "一句话概括其地位（如：紫禁城正门、皇帝寝宫）",
  "description": "150-200字的建筑描述，包含：建筑规模、空间布局、使用功能、文化意义",
  "historicalContext": "100-150字的历史背景，包含：建造年代、历史变迁、重要事件、历史人物",
  "components": [
    {
      "name": "建筑元素中文名（如：屋顶、台基、彩画）",
      "nameEn": "拼音",
      "description": "简短描述",
      "material": "材质（如：楠木、汉白玉、琉璃瓦）",
      "function": "功能（如：承重、装饰、排水）"
    }
  ],
  "technicalParams": {
    "era": "建造/重建年代（如：明永乐十八年、清康熙年间）",
    "style": "建筑风格（如：官式、皇家）",
    "loadBearing": "建筑等级（最高等级/高等/中等）",
    "complexity": "结构复杂度（复杂/中等/简单）"
  },
  "funFacts": ["趣味知识或历史轶事1", "趣味知识或历史轶事2"]
}

【内容要求】
1. 所有内容必须与${buildingName}紧密相关，准确无误
2. description 需体现建筑的独特性和历史价值
3. historicalContext 需包含具体年代和历史事件
4. components 限 2-4 个核心建筑元素
5. 语言典雅专业，可引用《明实录》《清宫史》等典籍
6. funFacts 可以是历史轶事、建筑奇闻或文化典故

【禁止事项】
- 禁止虚构历史事实
- 禁止使用现代网络用语
- 禁止生成与故宫无关的内容

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
        temperature: 0.6,
        max_tokens: 600,
      }),
    }, REQUEST_TIMEOUT);

    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();

    // 检查 API 返回的错误（如速率限制）
    if (data.error) {
      console.warn('LLM API 返回错误:', data.error.message);
      return getDefaultBuildingInfo(buildingName, buildingData);
    }

    let content = data.choices?.[0]?.message?.content || '';

    // 清理 markdown 代码块
    content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    try {
      const parsed = JSON.parse(content);
      const info = validateAndFillBuilding(parsed, buildingName);
      buildingCache[buildingName] = info;
      return info;
    } catch {
      return getDefaultBuildingInfo(buildingName, buildingData);
    }
  } catch (error) {
    console.error('LLM API 调用失败:', error);
    return getDefaultBuildingInfo(buildingName, buildingData);
  }
}

/**
 * 验证并填充缺失字段
 */
function validateAndFillBuilding(data: any, buildingName: string): BuildingInfo {
  return {
    title: data.title || buildingName,
    subtitle: data.subtitle || '故宫建筑',
    description: data.description || `${buildingName}是故宫中轴线上的重要建筑。`,
    historicalContext: data.historicalContext || '始建于明清时期，具有重要的历史价值。',
    components: Array.isArray(data.components) ? data.components.slice(0, 4).map((c: any) => ({
      name: c.name || '建筑元素',
      nameEn: c.nameEn || 'Element',
      description: c.description || '',
      material: c.material || '木质结构',
      function: c.function || '建筑功能',
    })) : [],
    technicalParams: {
      era: data.technicalParams?.era || '明清',
      style: data.technicalParams?.style || '官式',
      loadBearing: data.technicalParams?.loadBearing || '高等',
      complexity: data.technicalParams?.complexity || '中等',
    },
    funFacts: Array.isArray(data.funFacts) ? data.funFacts.slice(0, 3) : [],
  };
}

/**
 * 默认建筑信息 - 专业的故宫建筑数据
 */
function getDefaultBuildingInfo(
  buildingName: string,
  buildingData?: { location?: string; form?: string }
): BuildingInfo {
  const defaults: Record<string, BuildingInfo> = {
    '午门': {
      title: '午门',
      subtitle: '紫禁城正门，皇权象征',
      description: '午门是紫禁城的正门，位于中轴线南端，因"居中向阳，位当子午"而得名。建筑呈"凹"字形，两侧向前伸出，形成独特的阙门形式。城台高12米，正中开三门，两侧各有一掖门，共五门，象征"明堂辟雍"之制。门楼重檐庑殿顶，面阔九间，是皇帝颁发诏书、举行受俘礼的场所。',
      historicalContext: '始建于明永乐十八年（1420年），历经明清两代修缮。明代在此举行"廷杖"，清代改为颁发诏书之所。每年冬至，皇帝在此颁发来年年历。午门前的广场也是举行重大典礼的场所。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐庑殿顶，等级最高', material: '黄色琉璃瓦', function: '彰显皇权' },
        { name: '阙楼', nameEn: 'Watchtower', description: '两侧向前伸出', material: '砖石砌筑', function: '防御守卫' },
        { name: '门洞', nameEn: 'Gate Passage', description: '五门并列', material: '汉白玉门框', function: '通行规制' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '最高等级', complexity: '复杂' },
      funFacts: ['午门又称"五凤楼"，因五个门洞如凤凰展翅', '皇帝专用中门，皇后大婚时可走一次，状元可走一次'],
    },
    '太和门': {
      title: '太和门',
      subtitle: '外朝正门，御门听政',
      description: '太和门是外朝宫殿的正门，面阔九间，进深三间，重檐歇山顶。门前有金水河蜿蜒流过，五座汉白玉桥横跨其上。门前一对铜狮为明代遗物，造型威猛，栩栩如生。这里是明代皇帝"御门听政"之处，清代改为举行大典的前奏场所。',
      historicalContext: '始建于明永乐十八年（1420年），原名奉天门，后改称皇极门，清顺治二年改称太和门。光绪十四年（1888年）因火灾焚毁，次年重建。门前铜狮铸造于明代，是故宫最大的铜狮。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐歇山顶', material: '黄色琉璃瓦', function: '等级标识' },
        { name: '铜狮', nameEn: 'Bronze Lions', description: '一对镇门铜狮', material: '青铜鎏金', function: '威严象征' },
        { name: '金水桥', nameEn: 'Golden Water Bridge', description: '五座汉白玉桥', material: '汉白玉', function: '礼仪通道' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '高等', complexity: '中等' },
      funFacts: ['门前铜狮耳朵竖立，象征"兼听则明"', '明代皇帝在此"御门听政"，是最高规格的朝议形式'],
    },
    '太和殿': {
      title: '太和殿',
      subtitle: '金銮殿，至高无上',
      description: '太和殿是紫禁城内规模最大的殿宇，俗称金銮殿。面阔十一间，进深五间，建筑面积2377平方米。殿内金漆雕龙宝座，藻井金蟠龙，极尽奢华。殿前设有日晷、嘉量、铜龟、铜鹤，象征皇权永固。这里是皇帝举行重大典礼的场所，如登基、大婚、册封等。',
      historicalContext: '始建于明永乐十八年（1420年），初名奉天殿，后改称皇极殿，清顺治二年改称太和殿。现存建筑为康熙三十四年（1695年）重建，是中国现存最大的木结构宫殿。历史上曾四次焚毁，屡毁屡建。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐庑殿顶，十件脊兽', material: '黄色琉璃瓦', function: '最高等级' },
        { name: '宝座', nameEn: 'Throne', description: '金漆雕龙宝座', material: '楠木髹金', function: '皇权象征' },
        { name: '藻井', nameEn: 'Caisson', description: '金蟠龙藻井', material: '金箔彩绘', function: '装饰威严' },
      ],
      technicalParams: { era: '清康熙三十四年', style: '官式', loadBearing: '最高等级', complexity: '复杂' },
      funFacts: ['屋脊上的走兽共有十件，全国唯一，第十件为"行什"', '殿内金砖产于苏州，每块价值一两黄金'],
    },
    '中和殿': {
      title: '中和殿',
      subtitle: '皇帝休憩，典礼前奏',
      description: '中和殿位于太和殿与保和殿之间，是皇帝大典前的休憩处。方形平面，单檐四角攒尖顶，鎏金宝顶，是三大殿中最小的一座。殿内设有宝座，皇帝在此接受执事官员朝拜，审阅祝文、诏书。',
      historicalContext: '始建于明永乐十八年（1420年），初名华盖殿，后改称中极殿，清顺治二年改称中和殿。殿名取自《中庸》"致中和，天地位焉，万物育焉"，体现儒家中庸之道。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '单檐四角攒尖顶', material: '黄色琉璃瓦', function: '建筑形式' },
        { name: '宝顶', nameEn: 'Finial', description: '鎏金宝顶', material: '铜鎏金', function: '装饰标志' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '中等', complexity: '简单' },
      funFacts: ['殿内宝座两侧设有皇帝临时休息的"宝座床"', '祭祀前皇帝在此审阅祝文，确保典礼无误'],
    },
    '保和殿': {
      title: '保和殿',
      subtitle: '殿试考场，科举圣殿',
      description: '保和殿是外朝三大殿之一，重檐歇山顶，面阔九间。殿后有紫禁城最大的云龙石雕，长16.57米，宽3.07米，重约二百余吨。清代作为殿试考场和皇帝赐宴之所，见证了无数科举盛事。',
      historicalContext: '始建于明永乐十八年（1420年），初名谨身殿，后改称建极殿，清顺治二年改称保和殿。殿名取自《周易》"保合太和，乃利贞"。清代每年除夕、正月十五在此赐宴蒙古王公。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐歇山顶', material: '黄色琉璃瓦', function: '建筑等级' },
        { name: '云龙石雕', nameEn: 'Cloud Dragon Carving', description: '最大石雕', material: '艾叶青石', function: '装饰艺术' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '高等', complexity: '中等' },
      funFacts: ['殿后云龙石雕采自房山，冬季泼水成冰道运入紫禁城', '清代殿试在此举行，状元、榜眼、探花由此产生'],
    },
    '乾清门': {
      title: '乾清门',
      subtitle: '内廷正门，政务中枢',
      description: '乾清门是内廷后三宫的正门，单檐歇山顶，门前有鎏金铜狮一对。门内即为乾清宫，门外是处理政务的场所。清代在此设"御门听政"，是皇帝日常办公的重要场所。',
      historicalContext: '始建于明永乐十八年（1420年），是外朝与内廷的分界线。清代皇帝在此举行"御门听政"，每月数次，是日常政务处理的主要形式。门前铜狮耳下垂，示"不听谗言"之意。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '单檐歇山顶', material: '黄色琉璃瓦', function: '建筑形制' },
        { name: '铜狮', nameEn: 'Bronze Lions', description: '鎏金铜狮', material: '铜鎏金', function: '警示装饰' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '中等', complexity: '简单' },
      funFacts: ['门前铜狮耳下垂，象征"兼听则明"，不听谗言', '御门听政时，皇帝坐于门内，大臣立于门外奏事'],
    },
    '乾清宫': {
      title: '乾清宫',
      subtitle: '皇帝寝宫，正大光明',
      description: '乾清宫是内廷后三宫之首，重檐庑殿顶，面阔九间。殿内正中悬挂"正大光明"匾，是清代密建皇储制度的核心场所。明代至清初为皇帝寝宫，雍正后改为皇帝处理政务之处。',
      historicalContext: '始建于明永乐十八年（1420年），明代为皇帝寝宫。清代康熙帝崩逝于此，雍正帝迁居养心殿，乾清宫成为政务场所。雍正创立密建皇储制度，储君名字藏于"正大光明"匾后。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐庑殿顶', material: '黄色琉璃瓦', function: '建筑等级' },
        { name: '匾额', nameEn: 'Plaque', description: '正大光明匾', material: '木制髹漆', function: '政治象征' },
        { name: '宝座', nameEn: 'Throne', description: '皇帝御座', material: '楠木髹金', function: '皇权象征' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '高等', complexity: '中等' },
      funFacts: ['"正大光明"匾后曾藏有雍正创立的密诏，决定皇位继承', '康熙帝在此驾崩，雍正帝即位后迁居养心殿'],
    },
    '交泰殿': {
      title: '交泰殿',
      subtitle: '玉玺珍藏，天地交泰',
      description: '交泰殿位于乾清宫与坤宁宫之间，方形平面，单檐四角攒尖顶。殿内存放清代二十五方皇帝宝玺，具有重要政治意义。殿内悬有乾隆御笔"无为"匾，是皇后千秋节受贺之处。',
      historicalContext: '始建于明永乐十八年（1420年），殿名取自《周易》"天地交泰"，寓意天地和谐、阴阳和合。清代在此存放二十五方宝玺，乾隆帝定"二十五宝"之制，象征皇权永固。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '单檐四角攒尖顶', material: '黄色琉璃瓦', function: '建筑形式' },
        { name: '宝玺', nameEn: 'Imperial Seals', description: '二十五方宝玺', material: '玉、金、檀木', function: '皇权信物' },
        { name: '匾额', nameEn: 'Plaque', description: '无为匾', material: '木制髹漆', function: '治国理念' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '中等', complexity: '简单' },
      funFacts: ['二十五方宝玺各有用途，如"皇帝之宝"用于颁发诏书', '皇后千秋节（生日）在此接受妃嫔、公主朝贺'],
    },
    '坤宁宫': {
      title: '坤宁宫',
      subtitle: '皇后寝宫，萨满祭所',
      description: '坤宁宫是内廷后三宫之末，重檐庑殿顶，面阔九间。明代为皇后寝宫，清代改建为萨满祭祀场所。西暖阁设大婚洞房，东暖阁为祭神之所，是清代宫廷萨满信仰的中心。',
      historicalContext: '始建于明永乐十八年（1420年），明代为皇后寝宫。清顺治十二年改建，设萨满祭祀场所。康熙、同治、光绪、宣统四帝大婚时均在此设洞房，是清代皇帝大婚的固定场所。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐庑殿顶', material: '黄色琉璃瓦', function: '建筑等级' },
        { name: '洞房', nameEn: 'Bridal Chamber', description: '皇帝大婚洞房', material: '楠木髹红', function: '婚庆场所' },
        { name: '祭坛', nameEn: 'Altar', description: '萨满祭祀神坛', material: '木制', function: '宗教祭祀' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '高等', complexity: '中等' },
      funFacts: ['清代每天在此举行萨满祭祀，用猪祭神', '皇帝大婚时在此居住三天，然后迁回养心殿'],
    },
    '御花园': {
      title: '御花园',
      subtitle: '皇室园林，天人合一',
      description: '御花园位于紫禁城中轴线北端，面积约一万二千平方米，是皇室休憩的园林。园内奇石罗布，古木参天，有堆秀山、钦安殿、养性斋等建筑。园中古柏多为明代遗物，见证了六百年历史。',
      historicalContext: '始建于明永乐十八年（1420年），原名宫后苑，清代改称御花园。园内堆秀山为人工堆筑，山顶有御景亭，是重阳节登高之处。钦安殿供奉玄武大帝，是宫中道教祭祀中心。',
      components: [
        { name: '堆秀山', nameEn: 'Duixiu Hill', description: '人工堆筑假山', material: '太湖石', function: '园林造景' },
        { name: '钦安殿', nameEn: 'Qin\'an Hall', description: '供奉玄武大帝', material: '木石结构', function: '宗教祭祀' },
        { name: '古柏', nameEn: 'Ancient Cypresses', description: '明代古柏', material: '柏木', function: '景观绿化' },
      ],
      technicalParams: { era: '明永乐十八年', style: '皇家园林', loadBearing: '中等', complexity: '中等' },
      funFacts: ['园内古柏多为明代种植，树龄超过四百年', '堆秀山上的御景亭是皇帝重阳节登高之处'],
    },
    '神武门': {
      title: '神武门',
      subtitle: '紫禁城北门，钟鼓报时',
      description: '神武门是紫禁城的北门，原名玄武门，后避康熙帝玄烨讳改称神武门。重檐庑殿顶，门楼设有钟鼓楼。清代黄昏鸣钟一百零八声，是宫女选秀和皇帝后妃出入之门。',
      historicalContext: '始建于明永乐十八年（1420年），原名玄武门，取自四神兽之北方玄武。清康熙年间避讳改称神武门。门楼上悬钟鼓，黄昏鸣钟一百零八声，称为"暮鼓晨钟"。',
      components: [
        { name: '屋顶', nameEn: 'Roof', description: '重檐庑殿顶', material: '黄色琉璃瓦', function: '建筑等级' },
        { name: '钟鼓楼', nameEn: 'Bell Tower', description: '报时钟鼓', material: '铜钟木鼓', function: '计时报时' },
        { name: '城台', nameEn: 'City Platform', description: '高大的城台', material: '砖石砌筑', function: '防御守卫' },
      ],
      technicalParams: { era: '明永乐十八年', style: '官式', loadBearing: '高等', complexity: '中等' },
      funFacts: ['黄昏鸣钟一百零八声，象征一百零八种烦恼', '1925年故宫博物院成立，神武门成为参观入口'],
    },
  };

  if (defaults[buildingName]) {
    return defaults[buildingName];
  }

  // 通用默认数据
  return {
    title: buildingName,
    subtitle: '故宫建筑',
    description: `${buildingName}是故宫中轴线上的重要建筑，承载着深厚的历史文化价值。`,
    historicalContext: '始建于明清时期，历经数百年风雨，见证了王朝兴衰。',
    components: [
      { name: '方位', nameEn: 'Location', description: buildingData?.location || '故宫中轴', material: '-', function: '建筑定位' },
      { name: '形制', nameEn: 'Form', description: buildingData?.form || '传统建筑', material: '-', function: '建筑形制' },
    ],
    technicalParams: {
      era: '明清',
      style: '官式',
      loadBearing: '高等',
      complexity: '中等',
    },
    funFacts: ['故宫是世界上现存规模最大、保存最完整的木结构宫殿建筑群'],
  };
}

/**
 * 预加载相邻建筑的信息
 */
export function preloadAdjacentBuildings(
  currentBuildingName: string,
  buildingNames: string[]
) {
  const currentIndex = buildingNames.indexOf(currentBuildingName);
  const toPreload: number[] = [];

  if (currentIndex > 0) toPreload.push(currentIndex - 1);
  if (currentIndex < buildingNames.length - 1) toPreload.push(currentIndex + 1);

  toPreload.forEach(index => {
    const name = buildingNames[index];
    if (name && !buildingCache[name] && apiKey) {
      generateBuildingInfo(name);
    }
  });
}

export { buildingCache };
