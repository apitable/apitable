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

import { StoreActions, Selectors, compensator } from '@apitable/core';
import { changeView } from 'pc/hooks/use_change_view';
import { store } from 'pc/store';
import { StorageName, getStorage, setStorage } from 'pc/utils/storage/storage';
import { dispatch } from 'pc/worker/store';

let viewId: string | undefined;
let datasheetActiveViewId: string | undefined;
let mirrorId: string | undefined;
let datasheetId: string | undefined;

const restoreGroupExpanding = () => {
  // Recovering grouped expanded information in localStorage
  const datasheetId = Selectors.getActiveDatasheetId(store.getState())!;
  const storageGroupCollapse = getStorage(StorageName.GroupCollapse);
  const key = `${datasheetId},${viewId}`;
  if (!storageGroupCollapse || !storageGroupCollapse[key] || !Array.isArray(storageGroupCollapse[key])) {
    return;
  }
  dispatch(StoreActions.setGroupingCollapse(datasheetId, storageGroupCollapse[key]));
};

store.subscribe(() => {
  const state = store.getState();
  const snapshot = Selectors.getSnapshot(state);
  const previousViewId = viewId;
  const previousMirrorId = mirrorId;
  let previousDatasheetActiveViewId = datasheetActiveViewId;
  const previousDatasheetId = datasheetId;
  datasheetId = state.pageParams.datasheetId;
  viewId = state.pageParams.viewId;
  mirrorId = state.pageParams.mirrorId;
  datasheetActiveViewId = Selectors.getActiveViewId(state);

  // Handling a special case, namely:
  // 1. There are two different nodes with the same default viewId for their respective views;
  // 2. When switching from one node to another, due to the identical default viewId,
  // routing will not automatically locate the default view after the node switch.
  if (!mirrorId && previousDatasheetId !== datasheetId && datasheetActiveViewId === previousDatasheetActiveViewId) {
    previousDatasheetActiveViewId = undefined;
  }

  // Wait until the datasheet is loaded before starting the later checks
  if (!snapshot || !datasheetActiveViewId) {
    return;
  }

  const spaceId = state.space.activeId;
  const uniqueId = `${spaceId},${datasheetId}`;

  if (viewId && previousViewId !== viewId) {
    /**
     * Because the conditional judgement above already filters out most changes,
     * the necessary traversal comparisons are only made when the view changes
     * */
    if (snapshot.meta.views.find((view) => view.id === viewId)) {
      dispatch(StoreActions.switchView(datasheetId!, viewId));
      setStorage(StorageName.DatasheetView, { [uniqueId]: viewId });
    } else {
      if (mirrorId) {
        return;
      }
      // If the viewId does not exist in the datasheet, the URL needs to be corrected.
      changeView(snapshot.meta.views[0].id);
    }
    restoreGroupExpanding();
    dispatch(StoreActions.setDatasheetComputed({}, datasheetId!));
    compensator.clearAll();
  }
  /**
   * Purpose: If there is no viewId, then jump to the currently active view, i.e. the first view
   * 1. when viewId == null, although the intention is to jump to a particular view,
   * the redux will be triggered frequently during the jump, resulting in multiple calls to changeView.
   * In the context of the above, the previousDatasheetActiveViewId ! == datasheetActiveViewId to reduce the number of changeView calls
   * 2. The reason is that the mirror and the original table share a copy of the data,
   * and when jumping from the mirror to the original table, the previousDatasheetActiveViewId must be equal to
   * datasheetActiveViewId。So a new previousMirrorId && !mirrorId is added to determine
   * if the current route is leaving from a mirror when the previous condition is false
   * (PS: In addition to the above idea, there is another way to update the data in the pageParams immediately,
   * the reason for this problem is that the routing changes do not update the pageParams immediately,
   * so as long as the pageParams are updated in time, this problem can also be avoided.
   * (However, in the current project, pageParams are modified via the usePageParams hook,
   * so this solution is not used in order not to break the logic)
   */
  if (!viewId && (previousDatasheetActiveViewId !== datasheetActiveViewId || (previousMirrorId && !mirrorId))) {
    const nextViewId = getStorage(StorageName.DatasheetView)?.[uniqueId] || datasheetActiveViewId;
    changeView(nextViewId);
    return;
  }

  return;
});
