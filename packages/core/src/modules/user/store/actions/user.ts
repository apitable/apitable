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

import { Api } from '../../../../exports/api';
import { ISignIn } from '../../../shared/api/api.interface';
import { Dispatch } from 'redux';
import { setActiveSpaceId } from '../../../space/store/actions/space';
import { BindAccount } from '../../../shared/store/constants';
import { ConfigConstant } from '../../../../config';
import * as actions from '../../../shared/store/action_constants';
import { IHttpErr, ILocateIdMap, IReduxState, IUserInfo } from '../../../../exports/store/interfaces';

/**
 * login
 * @param username 
 * @param password 
 */

export const signIn = (data: ISignIn) => {
  return (dispatch: Dispatch) => {
    Api.signIn(data).then(res => {
      const { success, message, code } = res.data;
      if (success) {
        dispatch(getUserMe() as any);
        dispatch(setHomeErr(null));
        dispatch(setHttpErrInfo(null));
      } else {
        dispatch(setHomeErr({
          code,
          msg: message,
        }));
      }
    }, err => {
      console.log('API.signIn error', err);
    });
  };
};

/**
 * get verify code in register
 * @param phone 
 */
export const getRegisterCode = (areaCode: string, phone: string) => {
  return (dispatch: Dispatch) => {
    Api.getSmsCode(areaCode, phone, ConfigConstant.REGISTER_ACCOUNT).then(res => {
      const { code, message } = res.data;
      dispatch(setHomeErr({
        code,
        msg: message,
      }));
    }, err => {
      console.log('API.getSmsCode error', err);
    });
  };
};

/**
 * get current state of getting verify code
 * @param status current state
 */
export const setIsCode = (status: boolean) => {
  return {
    type: actions.SET_IS_CODE,
    payload: status,
  };
};

/**
 * set current register state
 * @param status 
 */
export const setRegisterStatus = (status: boolean) => {
  return {
    type: actions.SET_REGISTER_STATUS,
    payload: status,
  };
};

/**
 * set state of whether used invite award
 * @param status new state
 */
export const setUsedInviteReward = (status: boolean) => {
  return {
    type: actions.SET_USED_INVITE_REWARD,
    payload: status,
  };
};

/**
 * set error message on login
 * @param err 
 */
export const setHomeErr = (err: IHttpErr | null) => {
  return {
    type: actions.SET_HOME_ERR,
    payload: err,
  };
};

/**
 * get my user info
 */
export const getUserMe = (locateIdMap: ILocateIdMap = {}) => {
  return (dispatch: Dispatch, getState: () => IReduxState) => {
    Api.getUserMe(locateIdMap).then(res => {
      const { success, data } = res.data;
      if (success) {
        const { needCreate, needPwd } = data;
        if (needPwd || needCreate) {
          dispatch(setUserMe(data));
          return;
        }
        dispatch(setIsLogin(true));
        dispatch(setUserMe(data));
        const state = getState();
        if (!state.space.activeId) {
          dispatch(setActiveSpaceId(data.spaceId));
        }
      } else {
        dispatch(setIsLogin(false));
      }
    }, err => {
      console.log('API.getUserMe error', err);
    });
  };
};

/**
 * set my user info
 * @param user 
 */
export const setUserMe = (user: IUserInfo | null) => {
  return {
    type: actions.SET_USER_ME,
    payload: user,
  };
};

/**
 * set state of getting user info
 * @param status 
 */
export const setIsLogin = (status: boolean) => {

  return {
    type: actions.SET_IS_LOGIN,
    payload: status,
  };
};

/**
 * set loading state
 * @param status 
 */
export const setLoading = (status: boolean) => {
  return {
    type: actions.SET_LOADING,
    payload: status,
  };
};

/**
 * set nickname
 * @param nickName 
 */
export const setNickName = (nickName: string) => {
  return {
    type: actions.SET_NICKNAME,
    payload: nickName,
  };
};

/**
 * logout
 */
export const signOut = () => {
  return {
    type: actions.SIGN_OUT,
  };
};

/**
 * set user avatar
 * @param avatar avatar url
 */
export const setUserAvatar = (data: string) => {
  return {
    type: actions.SET_USER_AVATAR,
    payload: data,
  };
};

/**
 * set user avatar
 * @param avatar avatar url
 */
export const setUserAvatarColor = (data: number | null) => {
  return {
    type: actions.SET_USER_AVATAR_COLOR,
    payload: data,
  };
};

/**
 * set user timezone
 * @param data timezone
 */
export const setUserTimeZone = (data: string | null) => {
  return {
    type: actions.SET_USER_TIMEZONE,
    payload: data,
  };
};

/**
 * get verify code by email
 * @param email 
 */
export const getEmailCode = (email: string, type = 1) => {
  return (dispatch: Dispatch) => {
    Api.getEmailCode(email, type).then(res => {
      const { code, message } = res.data;
      dispatch(setHomeErr({
        code,
        msg: message,
      }));
    }, err => {
      console.log('API.getEmailCode error', err);
    });
  };
};

/**
 * set request status
 * @param status 
 */
export const setReqStatus = (status: boolean) => {
  return {
    type: actions.SET_REQ_STATUS,
    payload: status,
  };
};

/**
 * set http request error message
 * @param info 
 */
export const setHttpErrInfo = (info: IHttpErr | null) => {
  return {
    type: actions.SET_HTTP_ERR_INFO,
    payload: info,
  };
};

/**
 * update password
 */
export const updatePwd = (password: string) => {
  return (dispatch: any) => {
    Api.updatePwd(password).then(res => {
      const { success, code, message: msg } = res.data;
      if (success) {
        dispatch(getUserMe());
      } else {
        dispatch(setHomeErr({
          code,
          msg,
        }));
      }
    }, err => {
      console.log('API.updatePwd error', err);
    });
  };
};

/**
 * unbind account
 */
export const unBindAccount = (type: BindAccount) => {
  return (dispatch: any) => {
    Api.unBindAccount(type).then(res => {
      const { success, code, message: msg } = res.data;
      if (success) {
        dispatch(getUserMe());
      } else {
        dispatch(setHomeErr({
          code,
          msg,
        }));
      }
    }, err => {
      console.log('API.unbindAccount error', err);
    });
  };
};

/**
 * update user info
 */
export const updateUserInfo = (info: Partial<IUserInfo>) => {
  return {
    type: actions.UPDATE_USERINFO,
    payload: info,
  };
};
export const updateUserInfoErr = (err: IHttpErr | null) => {
  return {
    type: actions.UPDATE_USERINFO_ERR,
    payload: err,
  };
};

export const addWizardNumber = (wizardId: number) => {
  return {
    type: actions.ADD_WIZARD_NUMBER,
    payload: wizardId,
  };
};

export const setActiveRecordId = (activeRecordId: string | null) => {
  return {
    type: actions.SET_ACTIVE_RECORD_ID,
    payload: activeRecordId
  };
};
