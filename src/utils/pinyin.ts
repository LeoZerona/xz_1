// 简单的汉字到拼音映射表（常用字）
// 这是一个简化版本，实际项目中可以使用专业的拼音库如 pinyin-pro
const pinyinMap: Record<string, string> = {
  '一': 'yī', '二': 'èr', '三': 'sān', '四': 'sì', '五': 'wǔ',
  '六': 'liù', '七': 'qī', '八': 'bā', '九': 'jiǔ', '十': 'shí',
  '天': 'tiān', '地': 'dì', '人': 'rén', '水': 'shuǐ', '火': 'huǒ',
  '山': 'shān', '海': 'hǎi', '日': 'rì', '月': 'yuè', '星': 'xīng',
  '风': 'fēng', '雨': 'yǔ', '云': 'yún', '雪': 'xuě', '雷': 'léi',
  '春': 'chūn', '夏': 'xià', '秋': 'qiū', '冬': 'dōng',
  '东': 'dōng', '南': 'nán', '西': 'xī', '北': 'běi',
  '上': 'shàng', '下': 'xià', '左': 'zuǒ', '右': 'yòu',
  '大': 'dà', '小': 'xiǎo', '多': 'duō', '少': 'shǎo',
  '高': 'gāo', '低': 'dī', '长': 'cháng', '短': 'duǎn',
  '新': 'xīn', '旧': 'jiù', '好': 'hǎo', '坏': 'huài',
  '豫': 'yù', '章': 'zhāng', '故': 'gù', '郡': 'jùn',
  '洪': 'hóng', '都': 'dū', '新': 'xīn', '府': 'fǔ',
  '星': 'xīng', '分': 'fēn', '翼': 'yì', '轸': 'zhěn',
  '地': 'dì', '接': 'jiē', '衡': 'héng', '庐': 'lú',
  '襟': 'jīn', '三': 'sān', '江': 'jiāng', '而': 'ér',
  '带': 'dài', '五': 'wǔ', '湖': 'hú', '控': 'kòng',
  '蛮': 'mán', '荆': 'jīng', '引': 'yǐn', '瓯': 'ōu',
  '越': 'yuè', '物': 'wù', '华': 'huá', '天': 'tiān',
  '宝': 'bǎo', '龙': 'lóng', '光': 'guāng', '射': 'shè',
  '牛': 'niú', '斗': 'dòu', '之': 'zhī', '墟': 'xū',
  '人': 'rén', '杰': 'jié', '地': 'dì', '灵': 'líng',
  '徐': 'xú', '孺': 'rú', '下': 'xià', '陈': 'chén',
  '蕃': 'fān', '之': 'zhī', '榻': 'tà', '雄': 'xióng',
  '州': 'zhōu', '雾': 'wù', '列': 'liè', '俊': 'jùn',
  '采': 'cǎi', '驰': 'chí', '骤': 'zhòu', '台': 'tái',
  '隍': 'huáng', '枕': 'zhěn', '夷': 'yí', '夏': 'xià',
  '交': 'jiāo', '宾': 'bīn', '主': 'zhǔ', '尽': 'jìn',
  '东': 'dōng', '南': 'nán', '之': 'zhī', '美': 'měi',
  // 可以继续添加更多常用字
};

/**
 * 获取单个汉字的拼音
 * @param char 汉字
 * @returns 拼音，如果找不到则返回空字符串
 */
export function getPinyin(char: string): string {
  return pinyinMap[char] || '';
}

/**
 * 获取文本的拼音映射
 * @param text 文本内容
 * @returns 索引到拼音的映射对象
 */
export function getPinyinMap(text: string): Record<number, string> {
  const map: Record<number, string> = {};
  Array.from(text).forEach((char, index) => {
    const pinyin = getPinyin(char);
    if (pinyin) {
      map[index] = pinyin;
    }
  });
  return map;
}

/**
 * 判断字符是否为汉字
 * @param char 字符
 * @returns 是否为汉字
 */
export function isChinese(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char);
}

