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

import { moveArrayElement } from '..';

describe('test move array element', () => {
  it('should return false while index out of bounds of array', () => {
    const arr = [1, 2, 3];
    expect(moveArrayElement(arr, -1, 1)).toBe(false);
    expect(moveArrayElement(arr, 1, 3)).toBe(false);
    expect(moveArrayElement(arr, 1, -1)).toBe(false);
    expect(moveArrayElement(arr, 3, 1)).toBe(false);
  });

  it('should return false while index to equals index from', () => {
    const arr = [1, 2, 3];
    expect(moveArrayElement(arr, 1, 1)).toBe(false);
  });

  it('should move element correctly', () => {
    let arr = [1, 2, 3, 4, 5, 6];
    let res = moveArrayElement(arr, 0, 5);
    expect(arr).toEqual([2, 3, 4, 5, 6, 1]);
    expect(res).toBe(true);

    // 从前往后插入到target之后
    arr = [1, 2, 3, 4, 5, 6];
    res = moveArrayElement(arr, 2, 4);
    expect(arr).toEqual([1, 2, 4, 5, 3, 6]);
    expect(res).toBe(true);

    // 从后往前插入到target之前
    arr = [1, 2, 3, 4, 5, 6];
    res = moveArrayElement(arr, 4, 2);
    expect(arr).toEqual([1, 2, 5, 3, 4, 6]);
    expect(res).toBe(true);
  });
});
