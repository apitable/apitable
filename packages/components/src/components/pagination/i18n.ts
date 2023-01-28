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

interface IConfigLang {
  zh: string;
  en: string;
}

const pattern = /\{.+?\}/g;

export const t = (obj: IConfigLang, lang: string, values?: any[]) => {
  const str = obj[lang || 'zh'] as string;
  if (!values) {
    return str;
  }
  const matches = str.match(pattern);
  if (!matches || matches.length !== values.length) {
    console.error('cannot match i18n text');
    return str;
  }
  let res = str;
  for (let i = 0; i < matches.length; i++) {
    res = res.replace(matches[i]!, values[i]);
  }
  return res;
};