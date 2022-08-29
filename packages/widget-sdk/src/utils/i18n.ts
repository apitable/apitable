import { getLanguage } from 'iframe_message/utils';

export interface IString {
  /** 中文 */
  zh_CN?: string;
  /** 英文 */
  en_US?: string;
}

const ERROR_STR = '[ERROR STR]';

/**
 * @hidden
 * t 函数，用于解决小程序国际化方案的方法
 *
 * @param string string对象
 * @returns string
 *
 * ## 示例
 * ``` js
 * import { t } from '@vikadata/widget-sdk';
 *
 * const strings = {
 *   total: {
 *     zh_CN: '总计',
 *     en_US: 'Total'
 *   }
 * };
 *
 * // 当前系统是中文，则控制台输出 "总计"
 * console.log(t(strings.total));
 *
 * ```
 */
export function t(string: IString) {
  if (!string) {
    console.log(1231231);
    return ERROR_STR;
  }
  const lang = getLanguage().replace(/-/g, '_');
  const text = lang in string ? string[lang] : string['zh_CN'] || ERROR_STR;
  return text;
}
