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

// import pako from 'pako';
// import { Buffer } from 'buffer';

/**
 * JSON conversion, performance is much faster than lodash cloneDeep.
 * Note that circular references will throw Error
 */
export function fastCloneDeep<T>(obj: T): T {
  if (obj == null) {
    return obj;
  }
  if (typeof obj !== 'object') {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
}

// /**
//  * @param gzipBase64Str must be base64 encoded
//  */
// export function unBase64Gzip<T = any>(gzipBase64Str: string): T {
//   return JSON.parse(pako.ungzip(Buffer.from(gzipBase64Str, 'base64'), { to: 'string' }));
// }

// export function gzipBase64(data: {}): string {
//   return Buffer.from(pako.gzip(JSON.stringify(data), { level: 9 })).toString('base64');
// }
