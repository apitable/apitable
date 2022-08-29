import LRU from 'lru-cache';

/**
 * 缓存的数据结构为树形结构，这样在移除或者改变列时可以大大减少遍历
 * 获取的性能理论上也会有提升, 以数表资源 id 为key，每个资源下，存储资源用到的缓存。
 * 数表包含：
 * + 单元格计算缓存
 * + 分组缓存
 * + 搜索缓存
{
  dsId: {
    cellValues: {
      fieldId: {
        recordId: { cellValue, cellStr }
      }
    }
  }
}
 */

export interface ICellValueData {
  cellValue: any,
  cellStr?: string | null
}

type TFieldCache = Map<string, ICellValueData>;

interface IDsCache {
  cellValues: Map<string, TFieldCache>,
}

export const NO_CACHE = Symbol('NO_CACHE');

class Cache {

  dsMap: LRU<string, IDsCache | null>;

  constructor() {
    this.dsMap = new LRU<string, IDsCache>(50);
  }

  // private stringifyKey(options: ICellValueKeyOptions) {
  //   const { dsId, fieldId, recordId } = options;
  //   return `${dsId}-${fieldId}-${recordId}`;
  // }

  // private parseKey(key: string) {
  //   const ids = key.split('-');
  //   return {
  //     dsId: ids[0],
  //     fieldId: ids[1],
  //     recordId: ids[2]
  //   };
  // }

  private getDsCache(dsId: string) {
    return this.dsMap.get(dsId);
  }

  private getDsFields(dsId: string) {
    const ds = this.getDsCache(dsId);
    if (!ds) {
      return null;
    }
    const fields = [] as string[];
    for (const [key] of ds.cellValues) {
      fields.push(key);
    }
    return fields;
  }

  addCellCache(dsId: string, fieldId: string, recordId: string, value: ICellValueData) {
    // 检查数表缓存是否存在
    let dsCache = this.getDsCache(dsId);
    if (!dsCache) {
      dsCache = {
        cellValues: new Map(),
      };
      this.dsMap.set(dsId, dsCache);
    }
    // 检查列缓存是否存在
    let fieldCache = dsCache.cellValues.get(fieldId);
    if (!fieldCache) {
      fieldCache = new Map();
      dsCache.cellValues.set(fieldId, fieldCache);
    }
    fieldCache.set(recordId, value);
  }

  removeCellCache(dsId: string, fieldId: string, recordId?: string) {
    const ds = this.getDsCache(dsId);
    if (!ds) {
      return false;
    }
    if (!recordId) {
      ds.cellValues.delete(fieldId);
      return true;
    }
    const field = ds.cellValues.get(fieldId);
    if (!field) {
      return false;
    }
    return field.delete(recordId);
  }

  removeCellCacheByRecord(dsId: string, recordId: string) {
    const fields = this.getDsFields(dsId);
    if (!fields) {
      return false;
    }
    return fields.some((fieldId: string) => {
      return this.removeCellCache(dsId, fieldId, recordId);
    });
  }

  removeDsCache(dsId: string) {
    this.dsMap.set(dsId, null);
  }

  getCellCache(dsId: string, fieldId: string, recordId: string) {
    const ds = this.getDsCache(dsId);
    if (!ds) {
      return NO_CACHE;
    }
    const field = ds.cellValues.get(fieldId);
    if (!field) {
      return NO_CACHE;
    }
    return field.get(recordId) || NO_CACHE;
  }

  clearCache() {
    this.dsMap.reset();
  }
}

export const cache = new Cache();