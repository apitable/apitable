import { ISnapshot } from 'core';
/**
 * Mock Field
 * fieldType, fieldId, fieldProperty
 */

export function createMockSnapshot(): ISnapshot {
  return {
    meta: {
      fieldMap: {},
      views: [],
    },
    recordMap: {},
    datasheetId: 'dstMock'
  };
}
