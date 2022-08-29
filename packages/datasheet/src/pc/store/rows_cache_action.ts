import { ActionConstants, ICacheTemporaryView, IJOTActionPayload, Selectors, StoreActions, visibleRowsBaseCacheManage } from '@vikadata/core';

type IUpdateCacheAction = StoreActions.IUpdateFieldPermissionMapAction | ICacheTemporaryView | IJOTActionPayload;
export function rowsCacheAction({ getState }) {
  return next => (action: IUpdateCacheAction) => {
    const state = getState();
    switch(action.type) {
      // 更新 fieldPermission
      case ActionConstants.UPDATE_FIELD_PERMISSION_MAP: {
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCacheData = {
          datasheetId: action.datasheetId,
        };
      } break;
      // 更新 mirror 上的筛选条件
      case ActionConstants.CACHE_TEMPORARY_VIEW: {
        const mirrorInfo = Selectors.getMirrorSourceInfo(state, action.mirrorId);
        if (!mirrorInfo) {
          return;
        }
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCacheData = {
          datasheetId: mirrorInfo.datasheetId,
          viewIds: [mirrorInfo.viewId],
          mirrorId: action.mirrorId
        };
      } break;
      // jot action apply
      case ActionConstants.DATASHEET_JOT_ACTION: {
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCache(action, state);
      } break;
    }
    return next(action);
  };
}
