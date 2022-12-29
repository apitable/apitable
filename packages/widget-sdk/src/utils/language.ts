declare const window: any;

export enum LangType {
  /** Chinese */
  ZhCN = 'zh-CN',
  /** English */
  EnUS = 'en-US'
}
/**
 * Used to get the current system language
 * 
 * ## Example
 * ``` js
 * import { getLanguage, LangType } from '@apitable/widget-sdk';
 * 
 * if (getLanguage() === LangType.ZhCN) {
 *   console.log('Current system language is Chinese');
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