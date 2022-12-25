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

import {
  IDPrefix,
  NamePrefix,
  NamePrefixString,
  getNewId,
  getNewIds,
  getUniqName,
} from '..';

import { generateRandomString } from '../string';

function testPrefix(id: string, prefix: IDPrefix | NamePrefixString): boolean {
  return id.startsWith(prefix);
}

function testDuplicates(id: string, ids: string[]): boolean {
  return !ids.includes(id);
}

describe('test get new id', () => {
  it('should get new id correctly', () => {
    const prefix = IDPrefix.Table;
    const ids = Array(10000).fill('').map(_ => `${prefix}${generateRandomString(7)}`);
    const id = getNewId(prefix, ids);
    expect(testPrefix(id, prefix)).toBe(true);
    expect(testDuplicates(id, ids)).toBe(true);
  });

  it('should be ok while old ids not applied', () => {
    const prefix = IDPrefix.Table;
    const id = getNewId(prefix);
    expect(testPrefix(id, prefix)).toBe(true);
  });
});

describe('test get new ids', () => {
  it('should get new ids correctly', () => {
    const prefix = IDPrefix.Table;
    const ids = Array(10000).fill('').map(_ => `${prefix}${generateRandomString(7)}`);
    getNewIds(prefix, 10000, ids).forEach(id => {
      expect(testPrefix(id, prefix)).toBe(true);
      expect(testDuplicates(id, ids)).toBe(true);
      ids.push(id);
    });
  });

  it('should be ok while old ids not applied', () => {
    const prefix = IDPrefix.Table;
    const ids = new Array<string>();
    getNewIds(prefix, 10000).forEach(id => {
      expect(testPrefix(id, prefix)).toBe(true);
      expect(testDuplicates(id, ids)).toBe(true);
      ids.push(id);
    });
  });

  it('should get empty array while num <= 0', () => {
    expect(getNewIds(IDPrefix.Table, 0, []).length).toBe(0);
    expect(getNewIds(IDPrefix.Table, -1, []).length).toBe(0);
  });
});

describe('test get default name', () => {
  it('should get default name correctly', () => {
    const prefix = NamePrefix.Field;
    const names = Array(100).fill('').map((_, i) => `${prefix} ${i * 2}`);
    const name = getUniqName(prefix, names);
    expect(testPrefix(name, prefix)).toBe(true);
    expect(testDuplicates(name, names)).toBe(true);
  });
});
