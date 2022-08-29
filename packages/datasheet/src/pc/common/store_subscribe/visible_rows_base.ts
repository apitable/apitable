import { store } from 'pc/store';
import { Selectors, visibleRowsBaseCacheManage } from '@vikadata/core';
import { mainWidgetMessage } from '@vikadata/widget-sdk';
import { getDependenceDstIds } from 'pc/common/billing';

store.subscribe(function visibleRowsBase() {
  const state = store.getState();
  const { datasheetId, viewIds, mirrorId } = visibleRowsBaseCacheManage.updateVisibleRowsBaseCacheData || {};
  if (!datasheetId) {
    return;
  }
  if (mirrorId) {
    viewIds?.length && updateMirrorCache(mirrorId, datasheetId, viewIds[0]);
    return;
  }
  if (datasheetId && !viewIds?.length) {
    const dstIds = Array.from(new Set([...getDependenceDstIds(state, datasheetId), datasheetId]));
    dstIds.forEach(datasheetId => updateCache(datasheetId));
    return;
  }
  updateCache(datasheetId, viewIds);
});

export function updateCache(datasheetId: string, viewIds?: string[]) {
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state, datasheetId);
  if(!snapshot) {
    return;
  }
  const views = Selectors.getViewsList(state, datasheetId);
  /**
   * 所有可能会更新的 viewId
   * 如果传入了 viewId 说明是指定视图更新，否则需要更新所有视图
   */
  const updateViewIds: string[] = viewIds ? viewIds : views.map(view => view.id);
  updateViewIds.forEach(updateViewId => {
    visibleRowsBaseCacheManage.clear(datasheetId, updateViewId);
    mainWidgetMessage.calcExpire(datasheetId, updateViewId);
  });
}

function updateMirrorCache(mirrorId: string, datasheetId: string, viewId: string) {
  visibleRowsBaseCacheManage.clearMirror(mirrorId);
  mainWidgetMessage.calcExpire(datasheetId, viewId);
}
