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
  supportedLngs: T[],
  fallbackLng?: { [key: string]: T },
  defaultLng: T,
};
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
  type ISupportedLngs= 'zh-CN' | 'en-US';

  return fallbackLang<ISupportedLngs>(
    lang,
    {
      supportedLngs: ['zh-CN', 'en-US'],
      fallbackLng: {
        zh: 'zh-CN',
        en: 'en-US'
      },
      defaultLng: 'en-US'
    }
  );
};

