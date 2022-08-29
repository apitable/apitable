import * as actions from '../action_constants';

export interface ISpace {
  spaceList: ISpaceInfo[];
  curSpaceInfo: ISpaceBasicInfo | null;
  spaceFeatures: ISpaceFeatures | null;
  reconnecting: boolean;
  connected: boolean;
  quitSpaceId: string;
  loading: boolean;
  err: ISpaceErr | null;
  screenWidth: number | null;
  sideBarVisible: boolean;
  shortcutKeyPanelVisible: boolean;
  isApiPanelOpen: boolean;
  isSideRecordOpen: boolean;
  isRecordFullScreen: boolean;
  marketplaceApps: IApp[];
  previewModalVisible: boolean;
  activeId: null | string;
  envs: IEnvs;
}

export interface IEnvs {
  weComEnv?: IWecomEnv;
}

export interface IWecomEnv {
  corpId: string;
  agentId: string;
  enabled: boolean;
}

export interface ISpaceErr {
  code: number;
  msg: string;
}

export interface ISpaceInfo {
  spaceId: string;
  name: string;
  logo: string;
  point: boolean;
  // active: boolean;
  admin: boolean;
  maxSeat: number;
  preDeleted: boolean;
  spaceDomain: string;
  social: {
    enabled: boolean;
    platform: number;
    appType: ISocialAppType;
    authMode: number;
  };
}

export interface ISpaceFeatures {
  joinable: boolean;
  invitable: boolean;
  nodeExportable: boolean; // 已废弃
  exportLevel: number; // 节点导出根据权限细粒度划分
  mobileShowable: boolean;
  watermarkEnable: boolean;
  allowCopyDataToExternal: boolean;
  allowDownloadAttachment: boolean;
  rootManageable: boolean;
  fileSharable: boolean;
  certification?: string;
  orgIsolated: boolean;
}

/**
 * 1 - 自建应用
 * 2 - 第三方应用
 */
export type ISocialAppType = 1 | 2;

export enum SocialAppType {
  SelfApp = 1,
  ThirdPartyAtt = 2
}

export interface ISpaceBasicInfo {
  spaceName: string;
  spaceLogo: string;
  creatorName: string;
  creatorAvatar: string;
  ownerName: string;
  ownerAvatar: string;
  createTime: number;
  deptNumber: number;
  delTime: number | null;
  apiRequestCountUsage: number;
  adminNums: number;
  recordNums: number;
  seats: number;
  sheetNums: number;
  capacityUsedSizes: number;
  formViewNums: number;
  fieldRoleNums: number;
  galleryViewNums: number;
  ganttViewNums: number;
  kanbanViewNums: number;
  calendarViewNums: number;
  nodeRoleNums: number;
  social: {
    enabled: boolean;
    platform: number;
    appType: ISocialAppType;
    contactSyncing: boolean;
    authMode: number;

  },
  lastUpdateTime?: number;
  isCreatorNameModified?: boolean;
  isOwnerNameModified?: boolean;
}

export interface IApp {
  appId: string;
  status: boolean;
}

export type ISocialPlatformType = 1 | 2 | 3;

export interface ISpaceListAction {
  type: typeof actions.SET_SPACE_LIST;
  payload: ISpaceInfo[];
}

export interface ISetQuitSpaceIdAction {
  type: typeof actions.SET_QUIT_SPACE_ID;
  payload: string;
}

export interface ISetSpaceErrAction {
  type: typeof actions.SET_SPACE_ERR;
  payload: {
    code: number;
    msg: string;
  };
}

export interface ISetSpaceLoadingAction {
  type: typeof actions.SET_SPACE_LOADING;
  payload: boolean;
}

export interface ISetSpaceInfoAction {
  type: typeof actions.SET_SPACE_INFO;
  payload: Partial<ISpaceBasicInfo>;
}

export interface ISetSpaceFeaturesAction {
  type: typeof actions.SET_SPACE_FEATURES;
  payload: Partial<ISpaceFeatures>;
}

export interface ISetSpaceReconnectingAction {
  type: typeof actions.SET_RECONNECTING;
  payload: boolean;
}

export interface ISetSpaceConnectedAction {
  type: typeof actions.SET_CONNECTED;
  payload: boolean;
}

export interface ISetMarketplaceAppsAction {
  type: typeof actions.SET_MARKETPLACE_APPS;
  payload: IApp[];
}

export interface ISetScreenWidth {
  type: typeof actions.SET_SCREEN_WIDTH;
  payload: number;
}

export interface ISetSideBarVisibleAction {
  type: typeof actions.SET_SIDEBAR_VISIBLE;
  payload: boolean;
}

export interface ISetPreviewModalVisibleAction {
  type: typeof actions.SET_PREVIEW_MODAL_VISIBLE;
  payload: boolean;
}

export interface ISetShortcutKeyPanelVisibleAction {
  type: typeof actions.SET_SHORTCUT_KEY_PANEL_VISIBLE;
  payload: boolean;
}

export interface IToggleApiPanelAction {
  type: typeof actions.TOGGLE_API_PANEL;
  payload: boolean;
}

export interface IToggleSideRecordPanelAction {
  type: typeof actions.TOGGLE_SIDE_RECORD_PANEL;
  payload: boolean;
}

export interface IToggleRecordFullScreen {
  type: typeof actions.TOGGLE_RECORD_PANEL_FULL_SCREEN;
  payload: boolean;
}

export interface ISetActiveSpaceIdAction {
  type: typeof actions.SET_ACTIVE_SPACE_ID;
  payload: string;
}

export interface ISetEnvs {
  type: typeof actions.SET_ENVS;
  payload: IEnvs;
}
