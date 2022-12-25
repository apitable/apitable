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

/**
  * move the array
  * @export
  * @template T
  * @param {T[]} array
  * @param {number} from original subscript of mobile data
  * @param {number} to target index of mobile data
  * @returns {(T[] | boolean)}
  */
export function moveArrayElement<T>(array: T[], from: number, to: number): boolean {
  const length = array.length;

  if (from < 0 || from >= length || to < 0 || to >= length || from === to) {
    return false;
  }

  const fromItem = array[from]!;

  array.splice(from, 1);
  array.splice(to, 0, fromItem);

  return true;
}

/**
 * Check if array1 and array2 are the same set
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function isSameSet<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  if (set1.size !== set2.size) {
    return false;
  }
  for (const ele of set1) {
    if (!set2.has(ele)) {
      return false;
    }
  }
  return true;
}

/**
 * Check if array1 is a subset of array2
 *
 * @export
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function isSubSet<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);
  if (set1.size > set2.size) {
    return false;
  }
  for (const ele of set1) {
    if (!set2.has(ele)) {
      return false;
    }
  }
  return true;
}

/**
 * Is the intersection empty
 *
 * @export
 * @template T
 * @param {T[]} array1
 * @param {T[]} array2
 * @returns
 */
export function hasIntersect<T extends number | string>(array1: T[], array2: T[]) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }
  const set1 = new Set(array1);
  const set2 = new Set(array2);

  for (const ele of set1) {
    if (set2.has(ele)) {
      return true;
    }
  }
  return false;
}

export function array2Map<T>(arr: T[], key: string) {
  return arr.reduce((obj: {}, element: T) => {
    obj[element[key]] = element;
    return obj;
  }, {});
}

/**
  * Get the previous index or the next index of the array, when the index reaches the boundary, start from the beginning.
  * @param length array length
  * @param index current index
  * @param plusOrNot +1 or -1
  */
export const getArrayLoopIndex = (length: number, index: number, plusOrNot: number) => {
  if (index == null || length <= 0) return 0;
  const newIndex = index + plusOrNot;
  if (newIndex < 0) {
    return (length + newIndex) % length;
  }
  return newIndex % length;
};

/**
 * @description adds an anchorIndex to each item in the object array to be sorted, where anchorIndex is the order of the unsorted array
 * @param sortList 
 */
export const addExtraAnchorIndex = <T>(sortList: T[]): (T & { anchorIndex: number })[] => {
  return sortList.map((item, index) => {
    return {
      ...item,
      anchorIndex: index,
    };
  });
};

/**
 * @description Combined with the anchorIndex added above, 
 * when the results of the custom sorting function are consistent, compare whether the anchorIndex of the two items are consistent to sort
 * @param sortFunc 
 * @param sortList 
 */
export const sortByExtraAnchorIndex =
  <T, S extends (T & { anchorIndex: number }) = (T & { anchorIndex: number })>(sortFunc: (a: S, b: S) => number, sortList: S[]): S[] => {
    return sortList.sort((a, b) => {
      return sortFunc(a, b) || a.anchorIndex - b.anchorIndex;
    });
  };

/**
 * the complement of a with respect to b
 * a = [1,2,3]
 * b = [2,3,4]
 * setComplement(a,b) => [4]
 * @param a array
 * @param b array
 */
export const setComplement = (a: any[], b: any[]) => {
  const setA = new Set(a);
  return b.filter(itemB => !setA.has(itemB));
};