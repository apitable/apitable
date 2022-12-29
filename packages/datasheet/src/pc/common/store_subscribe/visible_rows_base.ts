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

import { store } from 'pc/store';
import { Selectors, visibleRowsBaseCacheManage } from '@apitable/core';
import { mainWidgetMessage } from '@apitable/widget-sdk';
import { getDependenceDstIds } from 'pc/utils/dependence_dst';

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
   * All viewId's that may be updated
   * If a viewId is passed in, it means that the view is specified to be updated, otherwise all views need to be updated
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
