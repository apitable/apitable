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

import * as actions from '../../../shared/store/action_constants';
import { ISpaceResource } from 'exports/store/interfaces';

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
  recordNums: number;
  calendarViewNums: number;
  ganttViewNums: number;
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
  nodeExportable: boolean; // deprecated

  /**
   * node export level based on permission
   */
  exportLevel: number;
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
 * 1 - self-created app
 * 2 - 3rd party app
 */
export type ISocialAppType = 1 | 2;

export enum SocialAppType {
  SelfApp = 1,
  ThirdPartyAtt = 2,
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
  currentBundleCapacityUsedSizes: number;
  giftCapacityUsedSizes: number;
  feature: ISpaceFeatures;
  formViewNums: number;
  fieldRoleNums: number;
  galleryViewNums: number;
  ganttViewNums: number;
  kanbanViewNums: number;
  labsKeys: string[];
  calendarViewNums: number;
  mirrorNums: number;
  nodeRoleNums: number;
  social: {
    enabled: boolean;
    platform: number;
    appType: ISocialAppType;
    contactSyncing: boolean;
    authMode: number;
  };
  isEnableChatbot: boolean;
  lastUpdateTime?: number;
  isCreatorNameModified?: boolean;
  isOwnerNameModified?: boolean;
  usedCredit: number;
  userResource:ISpaceResource;
  seatUsage: {
    total: number;
    chatBotCount: number;
    memberCount: number;
  };
  automationRunsNums: number;
  widgetNums: number;
}

export interface IApp {
  appId: string;
  status: boolean;
}

export type ISocialPlatformType = 1 | 2 | 3 | 10;

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
