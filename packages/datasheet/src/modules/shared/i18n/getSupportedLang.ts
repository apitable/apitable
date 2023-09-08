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

type IOptions<T extends string> = {
  supportedLngs: T[];
  fallbackLng?: { [key: string]: T };
  defaultLng: T;
};

/**
 * read Settings in config
 */
declare const window: any;
declare const global: any;

const _global = global || window;

/**
 * Fallback language
 * @param code Language identifier 1
 * @param options Configuration items
 * @param options.supportedLngs Arrays of supported languages
 * @param options.fallbackLng Fallback mapping, optional. If the match process hits, it returns the language it refers to directly
 * @param options.defaultLng Default value, none matched, return this value
 * @example fallbackLang('zh-CN-Hans', { supportedLngs: ['zh-CN'], defaultLng: 'en-US' }) // => 'zh-CN'
 */
export const fallbackLang = <T extends string>(code: string, { supportedLngs, fallbackLng, defaultLng }: IOptions<T>) => {
  if (!code) return defaultLng;

  if (!fallbackLng) fallbackLng = {};
  const p = code.split('-');

  while (p.length > 0) {
    const subCode = p.join('-');
    if (supportedLngs.includes(subCode as T)) return subCode;
    if (subCode in fallbackLng) return fallbackLng[subCode];
    p.pop();
  }
  return defaultLng;
};

/**
 * Returns a supported language identifier
 * @param lang Language identifiers
 */
export const getSupportedLang = (lang: string) => {
  type ISupportedLngs = string;
  const languageManifest = _global.languageManifest;
  const langKeys = { zh: 'zh-CN' };
  Object.keys(languageManifest).forEach((item) => {
    const keys = item.split('-');
    if (keys.length === 2 && !langKeys[keys[0]]) {
      langKeys[keys[0]] = item;
      langKeys[keys[1]] = item;
    }
  });
  return fallbackLang<ISupportedLngs>(lang, {
    supportedLngs: Object.keys(languageManifest),
    fallbackLng: langKeys,
    defaultLng: 'en-US',
  });
};
