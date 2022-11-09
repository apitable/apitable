import { produce } from 'immer';
import {
  ISpace, ISpaceListAction, ISetQuitSpaceIdAction,
  ISetSpaceLoadingAction, ISetSpaceErrAction, ISetSpaceInfoAction, ISetShortcutKeyPanelVisibleAction,
  ISetSpaceReconnectingAction, ISetSpaceConnectedAction, ISetScreenWidth, ISetSideBarVisibleAction, IToggleApiPanelAction,
  ISetMarketplaceAppsAction,ISetSpaceFeaturesAction,
  ISetPreviewModalVisibleAction, ISetActiveSpaceIdAction, ISetEnvs, IToggleSideRecordPanelAction, IToggleRecordFullScreen
} from '../../../../store/interfaces';
import * as actions from '../../../shared/store/action_constants';

const defaultSpace = {
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
});
