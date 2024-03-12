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

import { Api } from 'exports/api';
import axios from 'axios';
import { getCustomConfig } from 'config';
import * as ActionConstants from 'modules/shared/store/action_constants';
import { IApp, IEnvs, IReduxState, ISpaceBasicInfo, ISpaceErr, ISpaceFeatures, ISpaceInfo } from 'exports/store/interfaces';
import { initCatalogTree } from './catalog_tree';
import { getUserMe } from '../../../user/store/actions/user';
import { setLabs, updateSpaceResource } from 'exports/store/actions';

/**
 * Get Space List
 */
export const spaceList = (): any => {
  return (dispatch: any) => {
    Api.spaceList().then((res) => {
      const { success, data } = res.data;
      if (success) {
        dispatch(setSpaceList(data));
      }
    }, err => {
      console.error('API.spaceList error', err);
    });
  };
};

/**
 * Set Space List
 */
export const setSpaceList = (data: ISpaceInfo[]) => {
  return {
    type: ActionConstants.SET_SPACE_LIST,
    payload: data,
  };
};

/**
 * set the space id will quite
 * @param spaceId
 */
export const setQuitSpaceId = (spaceId: string) => {
  return {
    type: ActionConstants.SET_QUIT_SPACE_ID,
    payload: spaceId,
  };
};

/**
 * quit space
 * @param spaceId space ID
 */
export const quitSpace = (spaceId: string) => {
  return (dispatch: any) => {
    Api.quitSpace(spaceId).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(setQuitSpaceId(''));
        dispatch(initCatalogTree());
        dispatch(getUserMe());
      }
    }, err => {
      console.log('API.quitSpace error', err);
    });
  };
};

/**
 * set space error info
 * @param err error info
 */
export const setSpaceErr = (err: ISpaceErr | null) => {
  return {
    type: ActionConstants.SET_SPACE_ERR,
    payload: err,
  };
};

/**
 * set current loading state
 *
 * @param status current state
 */
export const setSpaceLoading = (statu: boolean) => {
  return {
    type: ActionConstants.SET_SPACE_LOADING,
    payload: statu,
  };
};

/**
 * set current space info
 * @param spaceInfo
 */
export const setSpaceInfo = (spaceInfo: Partial<ISpaceBasicInfo>) => {
  return {
    type: ActionConstants.SET_SPACE_INFO,
    payload: spaceInfo,
  };
};
/**
 * set space features
 * @param spaceInfo
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

/**
 * get space info
 * @param spaceId
 * @param ignoreTimeLimit
 * @returns
 */
export const getSpaceInfo = (spaceId: string, ignoreTimeLimit: boolean = false) => {
  return (dispatch: any, getState: () => IReduxState) => {
    const curSpace = getState().space;
    const lastUpdateTime = curSpace?.curSpaceInfo?.lastUpdateTime || 0;

    // prevent too many requests.
    // after last call > 1 min
    if (!ignoreTimeLimit && (Date.now() - lastUpdateTime < 1000 * 60)) {
      return;
    }

    Api.spaceInfo(spaceId).then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(setSpaceInfo({ ...data, lastUpdateTime: Date.now() }));
        dispatch(setSpaceFeatures(data.feature));
        dispatch(updateSpaceResource(data.userResource));
        dispatch(setLabs(data.labsKeys));
      }
    }, err => {
      console.log('API.spaceInfo error', err);
    });
  };
};

/**
 * get workbench settings info
 * @returns
 */
export const getSpaceFeatures = () => {
  return (dispatch: any) => {
    Api.getSpaceFeatures().then((res) => {
      const { data, success } = res.data;
      if (success) {
        dispatch(setSpaceFeatures(data));
      }
    }, err => {
      console.log('API.getSpaceFeatures error', err);
    });
  };
};

export const setMarketPlaceApps = (apps: IApp[]) => {
  return {
    type: ActionConstants.SET_MARKETPLACE_APPS,
    payload: apps,
  };
};

/**
 * get space's 3rd apps list
 * @param spaceId
 * @returns
 */
export const fetchMarketplaceApps = (spaceId: string) => {
  return (dispatch: any) => {
    if (!getCustomConfig().SPACE_INTEGRATION_PAGE_VISIBLE) {
      dispatch(setMarketPlaceApps([]));
      return;
    }

    Api.getMarketplaceApps(spaceId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        dispatch(setMarketPlaceApps(data));
      }
    }, err => {
      console.log('API.getMarketplaceApps error', err);
    });
  };
};

export const setActiveSpaceId = (spaceId: string) => {
  if (spaceId) {
    axios.defaults.headers.common['X-Space-Id'] = spaceId;
  }
  return {
    type: ActionConstants.SET_ACTIVE_SPACE_ID,
    payload: spaceId,
  };
};

export const setEnvs = (envs: IEnvs) => {
  return {
    type: ActionConstants.SET_ENVS,
    payload: envs,
  };
};

