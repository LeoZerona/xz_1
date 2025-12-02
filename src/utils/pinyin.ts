import { pinyin } from "pinyin-pro";

/**
 * 判断字符是否为汉字
 * @param char 字符
 * @returns 是否为汉字
 */
export function isChinese(char: string): boolean {
  return /[\u4e00-\u9fa5]/.test(char);
}

/**
 * 获取单个汉字的拼音（带声调）
 * @param char 汉字
 * @returns 拼音，如果不是汉字则返回空字符串
 */
export function getPinyin(char: string): string {
  // 判断是否为汉字
  if (!isChinese(char)) {
    return "";
  }

  // 使用 pinyin-pro 获取带声调的拼音
  return pinyin(char, { toneType: "symbol" });
}

/**
 * 获取文本的拼音映射
 * @param text 文本内容
 * @returns 索引到拼音的映射对象
 */
export function getPinyinMap(text: string): Record<number, string> {
  const map: Record<number, string> = {};
  Array.from(text).forEach((char, index) => {
    // 只处理汉字，跳过标点符号、空格等
    if (isChinese(char)) {
      const pinyinStr = getPinyin(char);
      if (pinyinStr) {
        map[index] = pinyinStr;
      }
    }
  });
  return map;
}
