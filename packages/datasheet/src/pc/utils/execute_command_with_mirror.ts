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

import { has, isEqual } from 'lodash';
import { Events, ITemporaryView, IViewProperty, Player, Selectors, StoreActions, ViewPropertyFilter } from '@apitable/core';
import { browser } from 'modules/shared/browser';
import { showViewManualSaveInMobile } from 'pc/components/tab_bar/view_sync_switch/show_view_manual_save_in_mobile';
import { store } from 'pc/store';

export const executeCommandWithMirror = (commandFunc: Function, viewProperty: Partial<IViewProperty>, cb?: () => void) => {
  const state = store.getState();
  const { mirrorId, viewId, datasheetId, embedId } = state.pageParams;

  if (!mirrorId) {
    const snapshot = Selectors.getSnapshot(state)!;
    const view = Selectors.getCurrentViewBase(snapshot, viewId, datasheetId);
    if (
      (!state.labs.includes('view_manual_save') && !state.share.featureViewManualSave && !state.embedInfo.viewManualSave) ||
      Boolean(view?.autoSave)
    ) {
      return commandFunc();
    }

    if (browser?.is('mobile')) {
      showViewManualSaveInMobile();
    } else {
      if (!embedId) {
        Player.doTrigger(Events.view_notice_view_auto_false);
      }
    }
    store.dispatch(StoreActions.activeOperateViewId(viewId!, datasheetId!));
    return commandFunc();
  }

  const mirror = Selectors.getMirror(state, mirrorId)!;

  if (mirror.temporaryView) {
    // Mirror manual date changes, e.g. 2022/02/16 to 2022/02/1 will result in duplicate dispatch,
    // determine if there are no values to update without dispatch
    if (has(viewProperty, 'filterInfo') && isEqual(mirror.temporaryView.filterInfo, viewProperty.filterInfo)) {
      return;
    }
    store.dispatch(StoreActions.cacheTemporaryView(viewProperty, mirrorId));
    return cb && cb();
  }

  const snapshot = Selectors.getSnapshot(state, mirror?.sourceInfo.datasheetId)!;
  const view = Selectors.getViewById(snapshot, mirror?.sourceInfo.viewId)!;
  const _view: ITemporaryView = {};

  for (const [key, value] of Object.entries(view)) {
    if ([...ViewPropertyFilter.ignoreViewProperty, 'autoSave'].includes(key)) {
      continue;
    }
    _view[key] = value;
  }

  store.dispatch(StoreActions.cacheTemporaryView({ ..._view, ...viewProperty }, mirrorId));

  return cb && cb();
};
