declare const window: any;

export enum LangType {
  /** 中文 */
  ZhCN = 'zh-CN',
  /** 英文 */
  EnUS = 'en-US'
}
/**
 * 用于获取当前系统语言
 * 
 * ## 示例
 * ``` js
 * import { getLanguage, LangType } from '@vikadata/widget-sdk';
 * 
 * if (getLanguage() === LangType.ZhCN) {
 *   console.log('当前系统语言为中文');
 * }
 * 
 * ```
 */
export function getLanguage(): LangType {
  const language = typeof window == 'object' &&
    window.__initialization_data__ &&
    window.__initialization_data__.lang;
  return language || LangType.ZhCN;
}