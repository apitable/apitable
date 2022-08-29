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
