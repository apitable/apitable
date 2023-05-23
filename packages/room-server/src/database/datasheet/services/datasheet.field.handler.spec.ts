import { IRecordMap } from '@apitable/core';
import { DatasheetFieldHandler } from './datasheet.field.handler';
import { Logger } from 'winston';

describe('forEachRecordMap', () => {
  const mockRecordMap: IRecordMap = {
    rec1w1: {
      id: 'rec1w1',
      data: {
        fld1: ['opt1'],
        fld2: 1479827589235,
        fld3: ['rec2w1', 'rec2w2'],
        fld4: ['rec3w3', 'rec3w6', 'rec3w4'],
        fld5: ['rec2w4'],
      },
      commentCount: 0,
    },
    rec1w2: {
      id: 'rec1w2',
      data: {
        fld1: ['opt2', 'opt3'],
        fld4: ['rec3w4', 'rec3w5'],
        fld5: ['rec2w7', 'rec2w1'],
      },
      commentCount: 0,
    },
    rec1w3: {
      id: 'rec1w3',
      data: {
        fld2: 1478247898322,
        fld3: ['rec2w2'],
        fld4: ['rec3w12', 'rec3w8', 'rec3w6', 'rec3w9'],
        fld5: ['rec2w7', 'rec2w1'],
      },
      commentCount: 0,
    },
  };

  const mockLogger: Logger = ({
    info() {},
  } as any) as Logger;

  it('should return an empty object when fieldLinkDstMap is empty', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', mockRecordMap, new Map(), mockLogger);
    expect(result).toStrictEqual({});
  });

  it('should return an empty object when recordMap is empty', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', {}, new Map([['fld1', 'dst2']]), mockLogger);
    expect(result).toStrictEqual({});
  });

  test('extract linked record IDs for one link field', () => {
    const result = DatasheetFieldHandler.forEachRecordMap('dst1', mockRecordMap, new Map([['fld3', 'dst2']]), mockLogger);
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2']),
    });
  });

  test('extract linked record IDs for two link fields linking distinct datasheets', () => {
    const result = DatasheetFieldHandler.forEachRecordMap(
      'dst1',
      mockRecordMap,
      new Map([
        ['fld3', 'dst2'],
        ['fld4', 'dst3'],
      ]),
      mockLogger,
    );
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2']),
      dst3: new Set(['rec3w3', 'rec3w6', 'rec3w4', 'rec3w5', 'rec3w12', 'rec3w8', 'rec3w9']),
    });
  });

  test('extract linked record IDs for two link fields linking the same datasheet', () => {
    const result = DatasheetFieldHandler.forEachRecordMap(
      'dst1',
      mockRecordMap,
      new Map([
        ['fld3', 'dst2'],
        ['fld4', 'dst3'],
        ['fld5', 'dst2'],
      ]),
      mockLogger,
    );
    expect(result).toStrictEqual({
      dst2: new Set(['rec2w1', 'rec2w2', 'rec2w4', 'rec2w7']),
      dst3: new Set(['rec3w3', 'rec3w6', 'rec3w4', 'rec3w5', 'rec3w12', 'rec3w8', 'rec3w9']),
    });
  });
});
