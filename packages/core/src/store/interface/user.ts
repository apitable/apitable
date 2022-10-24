import { BindAccount } from 'store/constants';
import * as actions from '../action_constants';

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
  // 账号是否已删除/注销 (冷静期也为 true)
  isDeleted?: boolean;
  isAdmin: boolean;
  isMainAdmin: boolean;
  isDelSpace: boolean;
  needPwd: boolean;
  thirdPartyInformation: IBindList[];
  usedInviteReward: boolean; // 是否获得填写朋友邀请码的奖励
  apiKey: string;
  wizards: { [key: number]: number };
  unitId: string;
  inviteCode: string;
  spaceDomain: string; // 空间站对应的域名
  sendSubscriptionNotify: boolean; // 是否允许发送订阅通知信息，属于全局开关
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
