/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { getLanguage } from './language';

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
 * import { t } from '@apitable/widget-sdk';
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
    return ERROR_STR;
  }
  const lang = getLanguage().replace(/-/g, '_');
  const defaultLang = window.__initialization_data__?.envVars?.IS_APITABLE ? 'en_US' : 'zh_CN';
  const text = lang in string ? string[lang] : string[defaultLang] || ERROR_STR;
  return text;
}
