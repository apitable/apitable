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

import { produce } from 'immer';
import {
  ISetActiveSpaceIdAction, ISetEnvs, ISetMarketplaceAppsAction, ISetPreviewModalVisibleAction, ISetQuitSpaceIdAction, ISetScreenWidth,
  ISetShortcutKeyPanelVisibleAction, ISetSideBarVisibleAction, ISetSpaceConnectedAction, ISetSpaceErrAction, ISetSpaceFeaturesAction,
  ISetSpaceInfoAction, ISetSpaceLoadingAction, ISetSpaceReconnectingAction, ISpace, ISpaceListAction, IToggleApiPanelAction, IToggleRecordFullScreen,
  IToggleSideRecordPanelAction
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

const defaultSpace: ISpace = {
  spaceList: [],
  curSpaceInfo: null,
  spaceFeatures: null,
  quitSpaceId: '',
  loading: false,
  reconnecting: false,
  connected: false,
  err: null,
  screenWidth: null,
  sideBarVisible: true,
  shortcutKeyPanelVisible: false,
  isApiPanelOpen: false,
  isSideRecordOpen: false,
  isRecordFullScreen: false,
  marketplaceApps: [],
  previewModalVisible: false,
  activeId: null,
  envs: {}
};

type SpaceAction = ISpaceListAction | ISetQuitSpaceIdAction | ISetSpaceErrAction |
  ISetSpaceLoadingAction | ISetSpaceInfoAction | ISetSpaceReconnectingAction |
  ISetSpaceConnectedAction | ISetScreenWidth | ISetSideBarVisibleAction | ISetShortcutKeyPanelVisibleAction
  | IToggleApiPanelAction | IToggleSideRecordPanelAction | ISetMarketplaceAppsAction | ISetPreviewModalVisibleAction | ISetActiveSpaceIdAction |
  ISetSpaceFeaturesAction | ISetEnvs | IToggleRecordFullScreen;

export const space = produce((spaceDraft: ISpace = defaultSpace, action: SpaceAction) => {
  switch (action.type) {
    case actions.SET_SPACE_LIST: {
      spaceDraft.spaceList = action.payload;
      return spaceDraft;
    }
    case actions.SET_QUIT_SPACE_ID: {
      spaceDraft.quitSpaceId = action.payload;
      return spaceDraft;
    }
    case actions.SET_SPACE_ERR: {
      spaceDraft.err = action.payload;
      return spaceDraft;
    }
    case actions.SET_SPACE_LOADING: {
      spaceDraft.loading = action.payload;
      return spaceDraft;
    }
    case actions.SET_SPACE_INFO: {
      spaceDraft.curSpaceInfo = Object.assign({}, spaceDraft.curSpaceInfo, action.payload);
      return spaceDraft;
    }
    case actions.SET_SPACE_FEATURES: {
      spaceDraft.spaceFeatures = Object.assign({}, spaceDraft.spaceFeatures, action.payload);
      return spaceDraft;
    }
    case actions.SET_RECONNECTING: {
      spaceDraft.reconnecting = action.payload;
      return spaceDraft;
    }
    case actions.SET_CONNECTED: {
      spaceDraft.connected = action.payload;
      return spaceDraft;
    }
    case actions.SET_SCREEN_WIDTH: {
      spaceDraft.screenWidth = action.payload;
      return spaceDraft;
    }
    case actions.SET_SIDEBAR_VISIBLE: {
      spaceDraft.sideBarVisible = action.payload;
      return spaceDraft;
    }
    case actions.SET_PREVIEW_MODAL_VISIBLE: {
      spaceDraft.previewModalVisible = action.payload;
      return spaceDraft;
    }
    case actions.SET_SHORTCUT_KEY_PANEL_VISIBLE: {
      spaceDraft.shortcutKeyPanelVisible = action.payload;
      return spaceDraft;
    }
    case actions.TOGGLE_API_PANEL: {
      spaceDraft.isApiPanelOpen = action.payload != null ? action.payload : !spaceDraft.isApiPanelOpen;
      return spaceDraft;
    }
    case actions.TOGGLE_SIDE_RECORD_PANEL: {
      spaceDraft.isSideRecordOpen = action.payload != null ? action.payload : !spaceDraft.isSideRecordOpen;
      return spaceDraft;
    }
    case actions.TOGGLE_RECORD_PANEL_FULL_SCREEN: {
      spaceDraft.isRecordFullScreen = action.payload != null ? action.payload : !spaceDraft.isRecordFullScreen;
      return spaceDraft;
    }
    case actions.SET_MARKETPLACE_APPS: {
      spaceDraft.marketplaceApps = action.payload;
      return spaceDraft;
    }
    case actions.SET_ACTIVE_SPACE_ID: {
      spaceDraft.activeId = action.payload;
      if (spaceDraft.curSpaceInfo) {
        spaceDraft.curSpaceInfo.lastUpdateTime = 0;
      }
      return spaceDraft;
    }
    case actions.SET_ENVS: {
      spaceDraft.envs = action.payload;
      return spaceDraft;
    }
    default:
      return spaceDraft;
  }
}, defaultSpace);
