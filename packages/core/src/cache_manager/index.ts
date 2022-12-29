import { computeCache } from 'compute_manager/compute_cache_manager';
import { ExpCache } from 'formula_parser';
import { IReduxState, ISnapshot, Selectors } from '../exports/store';
import { getCurrentView, getFilterInfoBase, getFilterInfo, getFieldMap, getFieldMapIgnorePermission, getPureVisibleRows, getVisibleColumns
  , getCalendarVisibleColumns, getOrgChartVisibleColumns, getGanttVisibleColumns } from '../exports/store/selectors';
import { cache, ICellValueData } from './cache';

export { NO_CACHE } from './cache';
export { visibleRowsBaseCacheManage } from './rows_cache';

export const CacheManager = {
  calcDsCache: (state: IReduxState, snapshot: ISnapshot) => {
    const { datasheetId, recordMap, meta: { fieldMap }} = snapshot;
    if (!datasheetId) {
      return;
    }
    for (const fieldId in fieldMap) {
      for (const recordId in recordMap) {
        const cellCache = Selectors.calcCellValueAndString({
          state,
          snapshot,
          fieldId,
          recordId,
          datasheetId,
          withError: false,
          ignoreFieldPermission: true
        });
        CacheManager.setCellCache(datasheetId, fieldId, recordId, cellCache);
      }
    }
  },
  clearDsCache: (dsId: string) => {
    return cache.removeDsCache(dsId);
  },
  removeCellCache: (dsId: string, fieldId: string, recordId?: string) => {
    return cache.removeCellCache(dsId, fieldId, recordId);
  },
  removeCellCacheByRecord: (dsId: string, recordId: string) => {
    return cache.removeCellCacheByRecord(dsId, recordId);
  },
  getCellCache: (dsId: string, fieldId: string, recordId: string) => {
    return cache.getCellCache(dsId, fieldId, recordId);
  },
  setCellCache: (dsId: string, fieldId: string, recordId: string, cellCache: ICellValueData) => {
    return cache.addCellCache(dsId, fieldId, recordId, cellCache);
  },
  clear: () => {
    cache.clearCache();
  }
};

if (!(global as any).process) {
  (global as any).__cache__ = cache;
}

export const clearComputeCache = (dstId?: string) => {
  ExpCache.clearAll();
  if (dstId) {
    CacheManager.clearDsCache(dstId);
  } else {
    CacheManager.clear();
  }
  if (computeCache) {
    computeCache.clear();
  }
};

/**
 * clear cached selectors
 */
export const clearCachedSelectors = ():void => {
  getCurrentView.clearCache();
  getFilterInfoBase.clearCache();
  getFilterInfo.clearCache();
  getFieldMap.clearCache();
  getFieldMapIgnorePermission.clearCache();
  getPureVisibleRows.clearCache();
  getVisibleColumns.clearCache();
  getCalendarVisibleColumns.clearCache();
  getOrgChartVisibleColumns.clearCache();
  getGanttVisibleColumns.clearCache();
};
