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

import { INetworking, IReduxState } from '../../../../../exports/store/interfaces';
import { getDatasheetParentId } from 'modules/database/store/selectors/resource/datasheet/base';

export const getMirror = (state: IReduxState, mirrorId?: string) => {
  mirrorId = mirrorId || state.pageParams.mirrorId!;
  return state.mirrorMap[mirrorId]?.mirror;
};

export const getMirrorPack = (state: IReduxState, id: string) => {
  if (!id) {
    return;
  }

  return state.mirrorMap[id];
};

export const getMirrorNetworking = (state: IReduxState, id: string): INetworking | undefined => {
  const datasheetPack = getMirrorPack(state, id);
  if (!datasheetPack) {
    return;
  }
  return {
    loading: datasheetPack.loading,
    connected: datasheetPack.connected,
    syncing: datasheetPack.syncing,
    errorCode: datasheetPack.errorCode,
  };
};

export const getMirrorLoading = (state: IReduxState, id: string) => {
  return getMirrorNetworking(state, id)?.loading;
};

export const getMirrorSourceInfo = (state: IReduxState, id: string) => {
  const mirror = getMirror(state, id);
  return mirror?.sourceInfo;
};

export const getMirrorCollaborator = (state: IReduxState, id: string) => {
  const mirrorPack = getMirrorPack(state, id);
  return mirrorPack?.client.collaborators;
};

export const getMirrorErrorCode = (state: IReduxState, id: string) => {
  const mirrorPack = getMirrorPack(state, id);
  return mirrorPack?.errorCode;
};

export const getMirrorPermission = (state: IReduxState, id: string) => {
  const mirror = getMirror(state, id)!;
  return mirror.permissions;
};

export const getNodeParentFolderPermission = (state: IReduxState) => {
  const folderId = getDatasheetParentId(state);
  return state.catalogTree.treeNodesMap[folderId!]?.permissions || {};
};

export const getMirrorSnapshot = (state: IReduxState, id: string) => {
  const mirror = getMirror(state, id)!;
  return mirror.snapshot;
};

export const getWidgetPanelsWithMirror = (state: IReduxState, mirrorId: string) => {
  const snapshot = getMirrorSnapshot(state, mirrorId);
  return snapshot && snapshot.widgetPanels;
};

export const getWidgetPanelStatusWithMirror = (state: IReduxState, mirrorId: string) => {
  const mirrorPack = getMirrorPack(state, mirrorId);
  return mirrorPack?.client?.widgetPanelStatus;
};

