import { Api, StoreActions } from '@vikadata/core';
import { store } from 'pc/store';

let folderId: string | undefined;
let viewId: string | undefined;
let dashboardId: string | undefined;
let mirrorId: string | undefined;

store.subscribe(function folderIdChange() {
  const previousFolderId = folderId;
  const previousViewId = viewId;
  const previousDashboard = dashboardId;
  const previousMirrorId = mirrorId;

  const state = store.getState();
  // 没加载完成 userInfo 的时候，不进行更新。
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

  if (folderId && previousFolderId !== folderId && !templateId && !shareId) {
    Api.keepTabbar({
      nodeId: folderId,
    });
    store.dispatch(StoreActions.updateUserInfo({ activeNodeId: folderId }));
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
