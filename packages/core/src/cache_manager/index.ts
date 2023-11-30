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

import { computeCache } from 'compute_manager/compute_cache_manager';
import { ExpCache } from 'formula_parser/evaluate';
import type { IReduxState, ISnapshot } from 'exports/store/interfaces';
import { calcCellValueAndString } from 'modules/database/store/selectors/resource/datasheet/cell_calc';
import { getFilterInfo } from 'modules/database/store/selectors/resource/datasheet/rows_calc';
import { getCurrentView, getFieldMap, getFieldMapIgnorePermission, getVisibleColumns
  , getCalendarVisibleColumns, getOrgChartVisibleColumns, getGanttVisibleColumns } from 'modules/database/store/selectors/resource/datasheet/calc';
import { cache, ICellValueData } from './cache';

export { NO_CACHE } from './cache';

export const CacheManager = {
  calcDsCache: (state: IReduxState, snapshot: ISnapshot) => {
    const { datasheetId, recordMap, meta: { fieldMap } } = snapshot;
    if (!datasheetId) {
      return;
    }
    for (const fieldId in fieldMap) {
      for (const recordId in recordMap) {
        const cellCache = calcCellValueAndString({
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
  getFilterInfo.clearCache();
  getFieldMap.clearCache();
  getFieldMapIgnorePermission.clearCache();
  getVisibleColumns.clearCache();
  getCalendarVisibleColumns.clearCache();
  getOrgChartVisibleColumns.clearCache();
  getGanttVisibleColumns.clearCache();
};
