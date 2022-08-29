import { Api } from 'api';
import axios from 'axios';
import { getCustomConfig } from 'config';
import { ActionConstants } from 'store';
import { IApp, IEnvs, ISpaceBasicInfo, ISpaceErr, ISpaceFeatures, ISpaceInfo } from '../interface';
import { initCatalogTree } from './catalog_tree';
import { getUserMe } from './user';

/**
 * 获取空间列表
 */
export const spaceList = (): any => {
  return (dispatch) => {
    Api.spaceList().then((res) => {
      const { success, data } = res.data;
      if (success) {
        dispatch(setSpaceList(data));
      }
    });
  };
};

/**
 * 设置空间列表
 */
export const setSpaceList = (data: ISpaceInfo[]) => {
  return {
    type: ActionConstants.SET_SPACE_LIST,
    payload: data,
  };
};

/**
 * 移除空间的小红点
 * @param spaceId 空间ID
 */
export const removeRedPoint = (spaceId: string) => {
  return (dispatch) => {
    Api.removeSpaceRedPoint(spaceId).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(spaceList());
      }
    });
  };
};

/**
 * 设置要退出的空间ID
 * @param spaceId
 */
export const setQuitSpaceId = (spaceId: string) => {
  return {
    type: ActionConstants.SET_QUIT_SPACE_ID,
    payload: spaceId,
  };
};

/**
 * 退出空间
 * @param spaceId 空间ID
 */
export const quitSpace = (spaceId: string) => {
  return (dispatch) => {
    Api.quitSpace(spaceId).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(setQuitSpaceId(''));
        dispatch(initCatalogTree());
        dispatch(getUserMe());
      }
    });
  };
};

/**
 * 设置错误信息
 * @param err 错误信息
 */
export const setSpaceErr = (err: ISpaceErr | null) => {
  return {
    type: ActionConstants.SET_SPACE_ERR,
    payload: err,
  };
};

/**
 * 设置当前是否是加载状态
 * @param statu 当前状态
 */
export const setSpaceLoading = (statu: boolean) => {
  return {
    type: ActionConstants.SET_SPACE_LOADING,
    payload: statu,
  };
};

/**
 *  设置当前空间的基本信息
 * @param spaceInfo 空间信息
 */
export const setSpaceInfo = (spaceInfo: Partial<ISpaceBasicInfo>) => {
  return {
    type: ActionConstants.SET_SPACE_INFO,
    payload: spaceInfo,
  };
};
/**
 *  设置当前空间的基本信息
 * @param spaceInfo 空间信息
 */
export const setSpaceFeatures = (data: Partial<ISpaceFeatures>) => {
  return {
    type: ActionConstants.SET_SPACE_FEATURES,
    payload: data,
  };
};
export const setReconnecting = (reconnecting: boolean) => {
  return {
    type: ActionConstants.SET_RECONNECTING,
    payload: reconnecting,
  };
};

export const setConnected = (connected: boolean) => {
  return {
    type: ActionConstants.SET_CONNECTED,
    payload: connected,
  };
};

export const setScreenWidth = (screenWidth: number) => {
  return {
    type: ActionConstants.SET_SCREEN_WIDTH,
    payload: screenWidth,
  };
};

export const setSideBarVisible = (status: boolean) => {
  return {
    type: ActionConstants.SET_SIDEBAR_VISIBLE,
    payload: status,
  };
};

export const setPreviewModalVisible = (status: boolean) => {
  return {
    type: ActionConstants.SET_PREVIEW_MODAL_VISIBLE,
    payload: status,
  };
};

export const setShortcutKeyPanelVisible = (status: boolean) => {
  return {
    type: ActionConstants.SET_SHORTCUT_KEY_PANEL_VISIBLE,
    payload: status,
  };
};

export const toggleApiPanel = (status?: boolean) => {
  return {
    type: ActionConstants.TOGGLE_API_PANEL,
    payload: status,
  };
};

export const toggleSideRecord = (status?: boolean) => {
  return {
    type: ActionConstants.TOGGLE_SIDE_RECORD_PANEL,
    payload: status,
  };
};

export const toggleRecordFullScreen = (status?: boolean) => {
  return {
    type: ActionConstants.TOGGLE_RECORD_PANEL_FULL_SCREEN,
    payload: status,
  };
};

// 获取空间信息
export const getSpaceInfo = (spaceId: string) => {
  return (dispatch, getState) => {
    const curSpace = getState().space;
    const lastUpdateTime = curSpace?.curSpaceInfo?.lastUpdateTime || 0;
    // 距离上一次获取超过一分钟才重新获取
    if ((Date.now() - lastUpdateTime < 1000 * 60)) {
      return;
    }

    Api.spaceInfo(spaceId).then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(setSpaceInfo({ ...data, lastUpdateTime: Date.now() }));
      }
    });
  };
};
// 获取工作台设置信息
export const getSpaceFeatures = () => {
  return (dispatch) => {
    Api.getSpaceFeatures().then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(setSpaceFeatures(data));
      }
    });
  };
};

export const setMarketPlaceApps = (apps: IApp[]) => {
  return {
    type: ActionConstants.SET_MARKETPLACE_APPS,
    payload: apps,
  };
};

// 获取空间三方应用列表
export const fetchMarketplaceApps = (spaceId: string) => {
  return (dispatch) => {
    if (getCustomConfig().marketplaceDisable) {
      dispatch(setMarketPlaceApps([]));
      return;
    }

    Api.getMarketplaceApps(spaceId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        dispatch(setMarketPlaceApps(data));
      }
    });
  };
};

export const setActiveSpaceId = (spaceId: string) => {
  if (spaceId) {
    axios.defaults.headers.common['X-Space-Id'] = spaceId;
  }
  return {
    type: ActionConstants.SET_ACTIVE_SPACE_ID,
    payload: spaceId
  };
};

export const setEnvs = (envs: IEnvs) => {
  return {
    type: ActionConstants.SET_ENVS,
    payload: envs
  };
};

