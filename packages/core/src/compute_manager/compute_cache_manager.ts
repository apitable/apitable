import { difference } from 'lodash';

/**
 * 1. getCellValue 过程发现需要补救的数据
 * 2. 将需要获取的数据搜集到 helper 中管理。
 * 3. UI 中定时批量补救数据
 */
class DataSelfHelper {
  // dstId-fieldId: Set(recordId1, recordId2, ....)
  dataMap: Map<string, Set<string>>;
  constructor() {
    this.dataMap = new Map<string, Set<string>>();
  }

  clear() {
    this.dataMap.clear();
  }

  addRecord(dstId: string, recordId: string, fieldId: string) {
    const key = `${dstId}-${fieldId}`;
    if (!this.dataMap.has(key)) {
      this.dataMap.set(key, new Set([recordId]));
    } else {
      const dstRecordIdSet = this.dataMap.get(key);
      dstRecordIdSet?.add(recordId);
    }
  }

  // 补救数据成功后确认一下
  confirm(key: string, recordIds: string[]) {
    const dstRecordIdSet = this.dataMap.get(key);
    if (dstRecordIdSet) {
      // 补救过程中，可能加入了新的需要补救的记录，求差集。
      const restRecordIds = difference(Array.from(dstRecordIdSet), recordIds);
      if (restRecordIds.length) {
        this.dataMap.set(key, new Set(restRecordIds));
      } else {
        this.dataMap.delete(key);
      }
    }
  }

  get needHelper() {
    return this.dataMap.size > 0;
  }
}

// 因为脏数据导致的数据丢失问题，实现自救措施。保证数据在 UI 上能正常显示。
export const dataSelfHelper = new DataSelfHelper();

// 用于存放计算缓存的 Map
export const computeCache = new Map<string, any>();
