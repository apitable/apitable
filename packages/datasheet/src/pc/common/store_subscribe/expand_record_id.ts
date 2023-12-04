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

import { RecordVision, StoreActions } from '@apitable/core';
import { expandRecordRoute } from 'pc/components/expand_record/expand_record.utils';
import { clearExpandModal } from 'pc/components/expand_record/utils';

import { store } from 'pc/store';

let preRecordId: string | null;

store.subscribe(function routeRecordChange() {
  const state = store.getState();
  const isLogin = state.user.isLogin;
  const { viewId, recordId, shareId, embedId } = state.pageParams;
  // Share page to expand cards even if you are not logged in
  if (!isLogin && !shareId && !embedId) {
    return;
  }

  const isSideRecordOpen = state.space.isSideRecordOpen;

  if (!recordId) {
    preRecordId && clearExpandModal();
    preRecordId = null;
    if (isSideRecordOpen) {
      store.dispatch(StoreActions.toggleSideRecord(false)); // Close the side record card when the recordId does not exist for the route
    }

    return;
  }

  // Compatible with cases where there is no viewId but there is a recordId
  if (!viewId || preRecordId === recordId) {
    return;
  }

  preRecordId = recordId;

  if (!isSideRecordOpen && state.recordVision === RecordVision.Side) {
    store.dispatch(StoreActions.toggleSideRecord(true));
  }

  expandRecordRoute({ preventOpenNewModal: true });
});
