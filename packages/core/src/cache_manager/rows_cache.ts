import { IAnyAction } from 'engine';
import { isString } from 'lodash';
import { IJOTActionPayload, IReduxState, IViewRow, Selectors, PREVIEW_DATASHEET_ID } from 'store';
import { isServer } from 'utils/env';
import { cache } from './cache';

declare const self: any;

type IViewRowsCache = Map<string, {[vieId: string]: IViewRow[]}>;

// used to store getVisibleRowsBase cache
class VisibleRowsBaseCache {
  private visibleRowsBaseCache: IViewRowsCache = new Map();
  // mirror view cache
  private mirrorVisibleRowsBaseCache = new Map<string, { datasheetId: string, viewId: string, cache: IViewRow[] }>();
  /** apply action needs to update visibleRowsBase cached data for store subscription */
  private _updateVisibleRowsBaseCacheData: { datasheetId: string; viewIds?: string[], mirrorId?: string } | null = null;

  /**
   * Accessor for private property _updateVisibleRowsBaseCacheData
   * Because _updateVisibleRowsBaseCacheData is a one-time identifier, it will be deleted after getting it once
   */
  get updateVisibleRowsBaseCacheData() {
    const updateVisibleRowsBaseCacheData = this._updateVisibleRowsBaseCacheData;
    this.updateVisibleRowsBaseCacheData = null;
    return updateVisibleRowsBaseCacheData;
  }

  set updateVisibleRowsBaseCacheData(updateVisibleRowsBaseCacheData) {
    this._updateVisibleRowsBaseCacheData = updateVisibleRowsBaseCacheData;
  }

  set(datasheetId: string, viewId: string, cache: IViewRow[], mirrorId?: string) {
    // If it is a server-side environment, do not cache
    if (isServer()) {
      return;
    }
    // If it is a worker, do not cache
    if (self.name === 'store_worker') {
      return;
    }
    if (!datasheetId || !viewId || !cache || datasheetId === PREVIEW_DATASHEET_ID) {
      return;
    }
    this.visibleRowsBaseCache.set(datasheetId, {
      ...this.visibleRowsBaseCache.get(datasheetId),
      [viewId]: cache
    });
  }

  get(datasheetId: string, viewId: string, mirrorId?: string) {
    if (mirrorId) {
      return this.mirrorVisibleRowsBaseCache.get(mirrorId)?.cache;
    }
    return this.visibleRowsBaseCache.get(datasheetId)?.[viewId];
  }

  setMirror(mirrorId: string, datasheetId: string, viewId: string, cache: IViewRow[]) {
    // If it is a server-side environment, do not cache
    if (isServer()) {
      return;
    }
    // If it is a worker, do not cache
    if (self.name === 'store_worker') {
      return;
    }
    this.mirrorVisibleRowsBaseCache.set(mirrorId, {
      datasheetId,
      viewId,
      cache
    });
  }

  getMirror(mirrorId: string) {
    return this.mirrorVisibleRowsBaseCache.get(mirrorId)?.cache;
  }

  clearMirror(mirrorId: string) {
    if (!this.mirrorVisibleRowsBaseCache.has(mirrorId)) {
      return;
    }
    this.mirrorVisibleRowsBaseCache.delete(mirrorId);
  }

  clearMirrorByViewId(datasheetId?: string, viewId?: string) {
    this.mirrorVisibleRowsBaseCache.forEach((value, key) => {
      if ((datasheetId && value.datasheetId === datasheetId) || (viewId && value.viewId === viewId)) {
        this.clearMirror(key);
      }
    });
  }

  clear(datasheetId: string, viewId?: string) {
    this.clearMirrorByViewId(datasheetId, viewId);
    const datasheetCache = this.visibleRowsBaseCache.get(datasheetId);
    if (datasheetId && viewId && datasheetCache) {
      delete datasheetCache[viewId];
    }
    if (datasheetId && !viewId) {
      this.visibleRowsBaseCache.delete(datasheetId);
    }
  }

  clearAll() {
    this.visibleRowsBaseCache.clear();
    this.mirrorVisibleRowsBaseCache.clear();
  }

  updateVisibleRowsBaseCache = (action: IJOTActionPayload & {
    datasheetId: string;
  }, state: IReduxState) => {
    const changeUpdatePath = ['recordMap', 'fieldMap', 'columns', 'rows', 'filterInfo', 'groupInfo', 'sortInfo', 'hiddenGroupMap'];
    const payload = action.payload;
    const datasheetId = action.datasheetId;
    const viewIndexSet = new Set<number>();
    let shouldUpdateAction = false;
    payload.operations.forEach(operation => {
      operation.actions.forEach(action => {
        const path = action.p;
        const isDeleteView = path.length === 3 && path[0] === 'meta' && path[1] === 'views' && typeof path[2] === 'number';
        const shouldUpdate = path.some(p => changeUpdatePath.includes(p as string)) || isDeleteView;
        if (shouldUpdate) {
          // The timing of the calculation is before the event triggers the cell cache to clear, 
          // so it needs to be cleared here, otherwise it will affect the calculation
          removeCellValueCacheIfNeed(action, datasheetId);
          shouldUpdateAction = true;
        }
        if (shouldUpdate) {
          const index = path[0] === 'meta' && path[1] === 'views' && typeof path[2] === 'number' ? path[2] : -1;
          index >= 0 && viewIndexSet.add(index);
        }
      });
    });
    if (shouldUpdateAction) {
      const viewIds = Array.from(viewIndexSet).map(viewIndex => Selectors.getViewsList(state, action.datasheetId)?.[viewIndex]?.id).filter(Boolean);
      this.updateVisibleRowsBaseCacheData = {
        datasheetId,
        viewIds
      };
    }
  };
}

const removeCellValueCacheIfNeed = (action: IAnyAction, datasheetId: string) => {
  const updateRecordMetaPath = ['recordMap', ':rec', 'recordMeta'];
  const isUpdateRecordMetaAction = action.p.every((v, i) => {
    const p = updateRecordMetaPath[i] || '';
    const isTem = p.startsWith(':');
    const pre = isTem && p.split(':')?.[1];
    return isTem ? isString(v) && pre && v.startsWith(pre) : v === p;
  });
  if (!isUpdateRecordMetaAction) {
    return;
  }
  const recordId = action.p[1];
  cache.removeCellCacheByRecord(datasheetId, recordId);
};

export const visibleRowsBaseCacheManage = new VisibleRowsBaseCache();
