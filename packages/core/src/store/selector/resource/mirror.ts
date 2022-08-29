import { INetworking, IReduxState } from 'store/interface';
import { getDatasheetParentId } from 'store/selector/resource/datasheet';

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

