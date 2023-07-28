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

import { Api, StoreActions } from '@apitable/core';
import { store } from 'pc/store';

let folderId: string | undefined;
let viewId: string | undefined;
let dashboardId: string | undefined;
let mirrorId: string | undefined;
let aiId: string | undefined;

store.subscribe(function folderIdChange() {
  const previousFolderId = folderId;
  const previousViewId = viewId;
  const previousDashboard = dashboardId;
  const previousMirrorId = mirrorId;
  const previousAIId = aiId;

  const state = store.getState();
  // The userInfo is not updated until it is loaded.
  if (!state.user.info) {
    return;
  }

  const datasheetId = state.pageParams.datasheetId;
  const templateId = state.pageParams.templateId;
  const shareId = state.pageParams.shareId;

  folderId = state.pageParams.folderId;
  viewId = state.pageParams.viewId;
  mirrorId = state.pageParams.mirrorId;
  dashboardId = state.pageParams.dashboardId;
  aiId = state.pageParams.aiId;

  if (folderId && previousFolderId !== folderId && !templateId && !shareId) {
    Api.keepTabbar({
      nodeId: folderId,
    });
    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: folderId }));
    return;
  }

  if (aiId && previousAIId !== aiId && !templateId && !shareId) {
    Api.keepTabbar({
      nodeId: aiId,
    });
    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: aiId }));
    return;
  }

  if (dashboardId && dashboardId !== previousDashboard && !templateId && !shareId) {
    Api.keepTabbar({
      nodeId: dashboardId,
    });
    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: dashboardId }));
    return;
  }

  if (mirrorId && mirrorId !== previousMirrorId && !templateId && !shareId) {
    Api.keepTabbar({
      nodeId: mirrorId,
    });
    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: mirrorId }));
    return;
  }

  if (viewId && viewId !== previousViewId && !templateId && !shareId && !mirrorId) {
    Api.keepTabbar({
      nodeId: datasheetId,
      viewId,
    });

    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: datasheetId, activeViewId: viewId }));
    return;
  }
});
