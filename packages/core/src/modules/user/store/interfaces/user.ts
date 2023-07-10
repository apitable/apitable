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
import { BindAccount } from '../../../shared/store/constants';

export interface IActiveSheets {
  dtsId: string;
  nodeId: string;
  dstName: string;
  viewId?: string;
  parentId: string;
}

export type LoginType = 'password' | 'sms_code' | 'email_code';

// logout response
export interface ILogoutResult {
  needRedirect: boolean;
  redirectUri: string;
}

export interface IBindList {
  type: BindAccount;
  createTime: string;
  nickName: string;
}

export interface IUserInfo {
  activeNodeId: string;
  spaceId: string;
  activeViewId: string;
  spaceName: string;
  avatar: string;
  avatarColor: number | null;
  email: string;
  lastLoginTime: string;
  signUpTime: string;
  areaCode: string;
  mobile: string;
  needCreate: boolean;
  nickName: string;
  isNickNameModified: boolean;
  spaceLogo: string;
  uuid: string; // user global ID
  userId: string; // this is deprecated but compatible, name mistake before 
  memberId: string; // member id (user in the space as member)
  memberName: string;
  isMemberNameModified: boolean;
  isNewComer: boolean;
  isPaused: boolean;
  userLogoutStatus?: 'apply_logout' | 'cancel_logout';
  userCanLogout?: boolean;
  closeAt?: string;
  /**
   * whether the account has been deleted or logged out (`true` for the cooling period)
   */
  isDeleted?: boolean;
  isAdmin: boolean;
  isMainAdmin: boolean;
  isDelSpace: boolean;
  needPwd: boolean;
  thirdPartyInformation: IBindList[];
  /**
   * whether get award from invite code
   */
  usedInviteReward: boolean;
  apiKey: string;
  wizards: { [key: number]: number };
  unitId: string;
  inviteCode: string;
  /**
   * the domain for the space
   */
  spaceDomain: string;
  /**
   * a global switch.
   * whether permits to send subscription notification message
   */
  sendSubscriptionNotify: boolean;
  timeZone: string | null;
  locale: string | null;
}

export interface IUser {
  info: IUserInfo | null;
  isLogin: boolean;
  isRegister: boolean;
  isCreateSpace: boolean;
  loading: boolean;
  reqStatus: boolean;
  err: IHttpErr | null;
  httpErrInfo: IHttpErr | null;
  userInfoErr: IHttpErr | null;
  activeRecordId?: string | null;
}

export interface IHttpErr {
  code: number;
  msg: string;
}

export interface ISetUserMeActions {
  type: typeof actions.SET_USER_ME;
  payload: IUserInfo | null;
}

export interface ISetIsLoginActions {
  type: typeof actions.SET_IS_LOGIN;
  payload: boolean;
}

export interface ISetLoginErrAction {
  type: typeof actions.SET_HOME_ERR;
  payload: IHttpErr | null;
}

export interface ISetRegisterAction {
  type: typeof actions.SET_REGISTER_STATUS;
  payload: boolean;
}

export interface ISetUsedInviteReward {
  type: typeof actions.SET_USED_INVITE_REWARD;
  payload: boolean;
}

export interface ISetLoadingAction {
  type: typeof actions.SET_LOADING;
  payload: boolean;
}

export interface ISignOutAction {
  type: typeof actions.SIGN_OUT;
}

export interface ISetUserAvatarAction {
  type: typeof actions.SET_USER_AVATAR;
  payload: string;
}

export interface ISetUserAvatarColorAction {
  type: typeof actions.SET_USER_AVATAR_COLOR;
  payload: number | null;
}

export interface ISetUserTimezoneAction {
  type: typeof actions.SET_USER_TIMEZONE;
  payload: string | null;
}

export interface ISetReqStatusAction {
  type: typeof actions.SET_REQ_STATUS;
  payload: boolean;
}

export interface ISetHttpErrInfoAction {
  type: typeof actions.SET_HTTP_ERR_INFO;
  payload: IHttpErr | null;
}

export interface ISetNicknameAction {
  type: typeof actions.SET_NICKNAME;
  payload: string;
}

export interface IUpdateUserInfoAction {
  type: typeof actions.UPDATE_USERINFO;
  payload: Partial<IUserInfo>;
}

export interface IUpdateUserInfoErrAction {
  type: typeof actions.UPDATE_USERINFO_ERR;
  payload: IHttpErr | null;
}

export interface IAddWizardNumberAction {
  type: typeof actions.ADD_WIZARD_NUMBER;
  payload: number;
}

export interface ILocateIdMap {
  spaceId?: string | null,
  nodeId?: string | null
}

export interface ISetActiveRecordId {
  type: typeof actions.SET_ACTIVE_RECORD_ID;
  payload: string | null;
}
