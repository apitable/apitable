import {
  IUser, ISetUserMeActions, ISetIsLoginActions,
  ISetLoginErrAction, ISetRegisterAction, ISetLoadingAction,
  ISignOutAction, ISetUserAvatarAction, ISetReqStatusAction, ISetHttpErrInfoAction,
  ISetNicknameAction, IUpdateUserInfoAction, IUpdateUserInfoErrAction,
  IAddWizardNumberAction, ISetActiveRecordId, ISetUsedInviteReward
} from '../../../../exports/store/interfaces';
import { produce } from 'immer';
import { ActionConstants } from '../../../../exports/store';
import axios from 'axios';

type UserActions = ISetUserMeActions | ISetIsLoginActions | ISetLoginErrAction |
  ISetRegisterAction | ISetLoadingAction |
  ISignOutAction | ISetUserAvatarAction | ISetReqStatusAction | ISetHttpErrInfoAction | ISetNicknameAction |
  IUpdateUserInfoAction | IUpdateUserInfoErrAction | IAddWizardNumberAction | ISetActiveRecordId | ISetUsedInviteReward;

const initValue: IUser = {
  info: null,
  isLogin: false,
  isRegister: false,
  isCreateSpace: false,
  err: null,
  loading: false, // user me loading state
  // http request status
  reqStatus: false,
  httpErrInfo: null,
  userInfoErr: null,
  activeRecordId: null,
};

declare const window: any;
const userInfo = (
  typeof window === 'object' &&
  (window as any).__initialization_data__ &&
  (window as any).__initialization_data__.userInfo
) || null;

if (userInfo) {
  axios.defaults.headers.common['X-Space-Id'] = userInfo.spaceId;
}
const defaultValue: IUser = {
  info: userInfo,
  isLogin: Boolean(userInfo),
  isRegister: false,
  isCreateSpace: false,
  err: null,
  loading: !userInfo, // user me loading state
  // http request status
  reqStatus: false,
  httpErrInfo: null,
  userInfoErr: null,
  activeRecordId: null,
};

export const user = produce((userDraft: IUser = defaultValue, action: UserActions) => {
  switch (action.type) {
    case ActionConstants.SET_USER_ME: {
      userDraft.info = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_IS_LOGIN: {
      userDraft.isLogin = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_HOME_ERR: {
      userDraft.err = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_REGISTER_STATUS: {
      userDraft.isRegister = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_USED_INVITE_REWARD: {
      if (userDraft.info) {
        userDraft.info.usedInviteReward = action.payload;
      }
      return userDraft;
    }
    case ActionConstants.SET_LOADING: {
      userDraft.loading = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_USER_AVATAR: {
      userDraft.info!.avatar = action.payload;
      return userDraft;
    }
    case ActionConstants.SIGN_OUT: {
      return initValue;
    }
    case ActionConstants.SET_REQ_STATUS: {
      userDraft.reqStatus = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_HTTP_ERR_INFO: {
      userDraft.httpErrInfo = action.payload;
      return userDraft;
    }
    case ActionConstants.SET_NICKNAME: {
      userDraft.info!.nickName = action.payload;
      return userDraft;
    }
    case ActionConstants.UPDATE_USERINFO: {
      userDraft.info = Object.assign({}, userDraft.info, action.payload);
      return userDraft;
    }
    case ActionConstants.UPDATE_USERINFO_ERR: {
      userDraft.userInfoErr = action.payload;
      return userDraft;
    }
    case ActionConstants.ADD_WIZARD_NUMBER: {
      const wizardId = action.payload;
      if (userDraft.info && wizardId in userDraft.info.wizards) {
        userDraft.info.wizards[wizardId]++;
        return userDraft;
      }
      if (userDraft.info && !(wizardId in userDraft.info.wizards)) {
        userDraft.info.wizards[wizardId] = 1;
        return userDraft;
      }
      return userDraft;
    }
    case ActionConstants.SET_ACTIVE_RECORD_ID: {
      userDraft.activeRecordId = action.payload;
      return userDraft;
    }
    default:
      return userDraft;
  }
});
