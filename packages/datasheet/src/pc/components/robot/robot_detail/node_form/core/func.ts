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

export function isObject(thing: object | null) {
  if (typeof File !== 'undefined' && thing instanceof File) {
    return false;
  }
  return typeof thing === 'object' && thing !== null && !Array.isArray(thing);
}

export function mergeObjects(obj1: object, obj2: object, concatArrays = false) {
  // Recursively merge deeply nested objects.
  const acc = Object.assign({}, obj1); // Prevent mutation of source object.
  return Object.keys(obj2).reduce((acc, key) => {
    const left = obj1 ? obj1[key] : {},
          right = obj2[key];
    if (obj1 && obj1.hasOwnProperty(key) && isObject(right)) {
      acc[key] = mergeObjects(left, right, concatArrays);
    } else if (concatArrays && Array.isArray(left) && Array.isArray(right)) {
      acc[key] = left.concat(right);
    } else {
      acc[key] = right;
    }
    return acc;
  }, acc);
}
