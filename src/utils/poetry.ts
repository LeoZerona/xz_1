/**
 * 古诗文数据类型定义
 */

// 体裁形式分类
export type PoetryFormType = 
  | 'guti-siyan'        // 古体诗-四言诗
  | 'guti-wuyan'        // 古体诗-五言古诗
  | 'guti-qiyan'        // 古体诗-七言古诗
  | 'guti-zayan'        // 古体诗-杂言诗
  | 'jinti-wujue'       // 近体诗-五言绝句
  | 'jinti-qijue'       // 近体诗-七言绝句
  | 'jinti-wulv'        // 近体诗-五言律诗
  | 'jinti-qilv'        // 近体诗-七言律诗
  | 'jinti-pailv'       // 近体诗-排律
  | 'ci'                // 词
  | 'qu'                // 曲

// 内容题材分类
export type PoetryThemeType =
  | 'shanshui'          // 山水田园诗
  | 'biansai'           // 边塞诗
  | 'yongwu'            // 咏物诗
  | 'yongshi'           // 咏史诗
  | 'songbie'           // 送别诗
  | 'sixiang'           // 思乡诗
  | 'fengyu'            // 讽喻诗
  | 'daowang'           // 悼亡诗
  | 'aiqing'            // 爱情诗
  | 'zheli'             // 哲理诗

// 历史时期分类
export type PoetryPeriodType =
  | 'xianqin'           // 先秦
  | 'hanwei'            // 汉魏六朝
  | 'tang'              // 唐
  | 'song'              // 宋
  | 'yuan'              // 元
  | 'mingqing'          // 明清

export interface Poetry {
  id: string;
  title: string;
  author: string;
  dynasty?: string;              // 朝代
  content: string;                // 诗文内容
  formType: PoetryFormType[];     // 体裁形式（可多选）
  themeType?: PoetryThemeType[];  // 内容题材（可多选）
  periodType?: PoetryPeriodType;  // 历史时期
  notes?: string;                  // 注释
  translation?: string;            // 译文
  source?: string;                 // 来源/出处
}

/**
 * 体裁形式分类配置
 */
export const FORM_TYPE_CONFIG = {
  'guti-siyan': { label: '四言诗', category: '古体诗', icon: '📜' },
  'guti-wuyan': { label: '五言古诗', category: '古体诗', icon: '📜' },
  'guti-qiyan': { label: '七言古诗', category: '古体诗', icon: '📜' },
  'guti-zayan': { label: '杂言诗', category: '古体诗', icon: '📜' },
  'jinti-wujue': { label: '五言绝句', category: '近体诗', icon: '✍️' },
  'jinti-qijue': { label: '七言绝句', category: '近体诗', icon: '✍️' },
  'jinti-wulv': { label: '五言律诗', category: '近体诗', icon: '✍️' },
  'jinti-qilv': { label: '七言律诗', category: '近体诗', icon: '✍️' },
  'jinti-pailv': { label: '排律', category: '近体诗', icon: '✍️' },
  'ci': { label: '词', category: '词', icon: '🎵' },
  'qu': { label: '曲', category: '曲', icon: '🎭' },
} as const;

/**
 * 内容题材分类配置
 */
export const THEME_TYPE_CONFIG = {
  'shanshui': { label: '山水田园', icon: '🏔️' },
  'biansai': { label: '边塞', icon: '⚔️' },
  'yongwu': { label: '咏物', icon: '🌸' },
  'yongshi': { label: '咏史', icon: '📚' },
  'songbie': { label: '送别', icon: '👋' },
  'sixiang': { label: '思乡', icon: '🏠' },
  'fengyu': { label: '讽喻', icon: '💭' },
  'daowang': { label: '悼亡', icon: '🕯️' },
  'aiqing': { label: '爱情', icon: '💕' },
  'zheli': { label: '哲理', icon: '💡' },
} as const;

/**
 * 历史时期分类配置
 */
export const PERIOD_TYPE_CONFIG = {
  'xianqin': { label: '先秦', icon: '🏛️' },
  'hanwei': { label: '汉魏六朝', icon: '🏯' },
  'tang': { label: '唐', icon: '🏰' },
  'song': { label: '宋', icon: '🏮' },
  'yuan': { label: '元', icon: '🎪' },
  'mingqing': { label: '明清', icon: '🏮' },
} as const;

/**
 * 古诗文数据（示例数据，实际可以从API或文件加载）
 */
export const POETRY_DATA: Poetry[] = [
  {
    id: 'jingyesi',
    title: '静夜思',
    author: '李白',
    dynasty: '唐',
    content: '床前明月光，疑是地上霜。举头望明月，低头思故乡。',
    formType: ['jinti-wujue'],
    themeType: ['sixiang'],
    periodType: 'tang',
  },
  {
    id: 'wangyue',
    title: '望岳',
    author: '杜甫',
    dynasty: '唐',
    content: '岱宗夫如何？齐鲁青未了。造化钟神秀，阴阳割昏晓。荡胸生曾云，决眦入归鸟。会当凌绝顶，一览众山小。',
    formType: ['guti-wuyan'],
    themeType: ['shanshui'],
    periodType: 'tang',
  },
  {
    id: 'chunwang',
    title: '春望',
    author: '杜甫',
    dynasty: '唐',
    content: '国破山河在，城春草木深。感时花溅泪，恨别鸟惊心。烽火连三月，家书抵万金。白头搔更短，浑欲不胜簪。',
    formType: ['jinti-wulv'],
    themeType: ['yongshi'],
    periodType: 'tang',
  },
  {
    id: 'jiangxue',
    title: '江雪',
    author: '柳宗元',
    dynasty: '唐',
    content: '千山鸟飞绝，万径人踪灭。孤舟蓑笠翁，独钓寒江雪。',
    formType: ['jinti-wujue'],
    themeType: ['shanshui'],
    periodType: 'tang',
  },
  {
    id: 'zaofabaidi',
    title: '早发白帝城',
    author: '李白',
    dynasty: '唐',
    content: '朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。',
    formType: ['jinti-qijue'],
    themeType: ['shanshui'],
    periodType: 'tang',
  },
  {
    id: 'denggao',
    title: '登高',
    author: '杜甫',
    dynasty: '唐',
    content: '风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽长江滚滚来。万里悲秋常作客，百年多病独登台。艰难苦恨繁霜鬓，潦倒新停浊酒杯。',
    formType: ['jinti-qilv'],
    themeType: ['sixiang'],
    periodType: 'tang',
  },
  {
    id: 'shuidaogesong',
    title: '水调歌头·明月几时有',
    author: '苏轼',
    dynasty: '宋',
    content: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
    formType: ['ci'],
    themeType: ['sixiang', 'zheli'],
    periodType: 'song',
  },
  {
    id: 'niannujiao',
    title: '念奴娇·赤壁怀古',
    author: '苏轼',
    dynasty: '宋',
    content: '大江东去，浪淘尽，千古风流人物。故垒西边，人道是，三国周郎赤壁。乱石穿空，惊涛拍岸，卷起千堆雪。江山如画，一时多少豪杰。遥想公瑾当年，小乔初嫁了，雄姿英发。羽扇纶巾，谈笑间，樯橹灰飞烟灭。故国神游，多情应笑我，早生华发。人生如梦，一尊还酹江月。',
    formType: ['ci'],
    themeType: ['yongshi'],
    periodType: 'song',
  },
  {
    id: 'tianjingsha',
    title: '天净沙·秋思',
    author: '马致远',
    dynasty: '元',
    content: '枯藤老树昏鸦，小桥流水人家，古道西风瘦马。夕阳西下，断肠人在天涯。',
    formType: ['qu'],
    themeType: ['sixiang'],
    periodType: 'yuan',
  },
  {
    id: 'yinshi',
    title: '饮酒·其五',
    author: '陶渊明',
    dynasty: '晋',
    content: '结庐在人境，而无车马喧。问君何能尔？心远地自偏。采菊东篱下，悠然见南山。山气日夕佳，飞鸟相与还。此中有真意，欲辨已忘言。',
    formType: ['guti-wuyan'],
    themeType: ['shanshui', 'zheli'],
    periodType: 'hanwei',
  },
];

/**
 * 根据筛选条件过滤古诗文
 */
export function filterPoetry(
  poetryList: Poetry[],
  filters: {
    formType?: PoetryFormType[];
    themeType?: PoetryThemeType[];
    periodType?: PoetryPeriodType[];
    author?: string;
    keyword?: string;
  }
): Poetry[] {
  return poetryList.filter((poetry) => {
    // 体裁形式筛选
    if (filters.formType && filters.formType.length > 0) {
      const hasMatch = filters.formType.some((type) =>
        poetry.formType.includes(type)
      );
      if (!hasMatch) return false;
    }

    // 内容题材筛选
    if (filters.themeType && filters.themeType.length > 0) {
      const hasMatch = filters.themeType.some((type) =>
        poetry.themeType?.includes(type)
      );
      if (!hasMatch) return false;
    }

    // 历史时期筛选
    if (filters.periodType && filters.periodType.length > 0) {
      if (!poetry.periodType || !filters.periodType.includes(poetry.periodType)) {
        return false;
      }
    }

    // 作者筛选
    if (filters.author) {
      if (!poetry.author.includes(filters.author)) {
        return false;
      }
    }

    // 关键词筛选（标题、内容）
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      const matchTitle = poetry.title.toLowerCase().includes(keyword);
      const matchContent = poetry.content.includes(filters.keyword);
      const matchAuthor = poetry.author.includes(filters.keyword);
      if (!matchTitle && !matchContent && !matchAuthor) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 将 Poetry 转换为 Article 格式（用于兼容现有组件）
 */
export function poetryToArticle(poetry: Poetry): {
  id: string;
  title: string;
  author?: string;
  source: string;
  category?: string;
} {
  return {
    id: poetry.id,
    title: poetry.title,
    author: poetry.author,
    source: `/poetry/${poetry.id}.txt`,
    category: poetry.formType.map((t) => FORM_TYPE_CONFIG[t].label).join('、'),
  };
}

