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
  const defaultLang = window.__initialization_data__?.envVars?.IS_APITABLE ? LangType.EnUS : LangType.ZhCN;
  const language = typeof window == 'object' &&
    window.__initialization_data__ &&
    window.__initialization_data__.lang;
  return language || defaultLang;
}