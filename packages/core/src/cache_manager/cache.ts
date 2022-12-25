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

import LRU from 'lru-cache';

/**
 * The cached data structure is a tree structure, which can greatly reduce traversal when removing or changing columns
 * The obtained performance will also be improved in theory. 
 * The resource id of the data table is used as the key, and under each resource, the cache used by the storage resource is stored.
 * The table contains:
 * + cell calculation cache
 * + group cache
 * + search cache
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
    // Check if the table cache exists
    let dsCache = this.getDsCache(dsId);
    if (!dsCache) {
      dsCache = {
        cellValues: new Map(),
      };
      this.dsMap.set(dsId, dsCache);
    }
    // Check if the column cache exists
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
    return fields.every((fieldId: string) => {
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