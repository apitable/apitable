import { getLanguage } from 'iframe_message/utils';

export interface IString {
  /** Chinese */
  zh_CN?: string;
  /** English */
  en_US?: string;
}

const ERROR_STR = '[ERROR STR]';

/**
 * @hidden
 * t function for solving the internationalization scheme of the widget.
 *
 * @param string String object.
 * @returns String
 *
 * ## Example
 * ``` js
 * import { t } from '@vikadata/widget-sdk';
 *
 * const strings = {
 *   total: {
 *     en_US: 'Total'
 *   }
 * };
 *
 * // The current system is English, then the console output "Total".
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
