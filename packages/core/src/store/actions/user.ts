import { Api } from 'api';
import { ISignIn } from 'api/api.interface';
import { Dispatch } from 'redux';
import { setActiveSpaceId } from 'store/actions/space';
import { BindAccount, QrAction } from 'store/constants';
import { ConfigConstant } from '../../config';
import * as actions from '../action_constants';
import { IHttpErr, ILocateIdMap, IReduxState, IUserInfo } from '../interface';

/**
 * 登录
 * @param username 用户名
 * @param password 密码
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
    });
  };
};

/**
 * 获取注册验证码
 * @param phone 手机号
 */
export const getRegisterCode = (areaCode: string, phone: string) => {
  return (dispatch: Dispatch) => {
    Api.getSmsCode(areaCode, phone, ConfigConstant.REGISTER_ACCOUNT).then(res => {
      const { code, message } = res.data;
      dispatch(setHomeErr({
        code,
        msg: message,
      }));
    });
  };
};

/**
 * @description 小程序扫码轮询接口
 * @param {(0 | 1 | 2)} type
 * 0：web扫码登录
 * 1：web帐号绑定
 * 2：小程序等待进入工作台
 * @param {string} mark  二维码识别ID
 * @returns
 */
export const poll = (type: QrAction, mark: string) => {
  return (dispatch: Dispatch) => {
    Api.poll(type, mark).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(getUserMe() as any);
      }
    });
  };
};

/**
 * 设置当前获取验证码的状态
 * @param status 当前状态
 */
export const setIsCode = (status: boolean) => {
  return {
    type: actions.SET_IS_CODE,
    payload: status,
  };
};

/**
 * 设置注册状态
 * @param status 当前状态
 */
export const setRegisterStatus = (status: boolean) => {
  return {
    type: actions.SET_REGISTER_STATUS,
    payload: status,
  };
};

/**
 * 设置是否使用过邀请奖励状态
 * @param status 新状态
 */
export const setUsedInviteReward = (status: boolean) => {
  return {
    type: actions.SET_USED_INVITE_REWARD,
    payload: status,
  };
};

/**
 * 设置登录时的错误信息
 * @param err 错误信息
 */
export const setHomeErr = (err: IHttpErr | null) => {
  return {
    type: actions.SET_HOME_ERR,
    payload: err,
  };
};

/**
 * 获取用户信息
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
    });
  };
};

export const formatOpenedSheet = (openedSheets, spaceId) => {
  return openedSheets.map(item => {
    item.type = ConfigConstant.NodeType.DATASHEET;
    item.spaceId = spaceId;
    item.children = [];
    return item;
  });
};

/**
 * 设置用户信息
 * @param user 用户信息
 */
export const setUserMe = (user: IUserInfo | null) => {
  return {
    type: actions.SET_USER_ME,
    payload: user,
  };
};

/**
 * 设置用户信息获取状态
 * @param status 当前状态
 */
export const setIsLogin = (status: boolean) => {

  return {
    type: actions.SET_IS_LOGIN,
    payload: status,
  };
};

/**
 * 设置加载状态
 * @param status 当前状态
 */
export const setLoading = (status: boolean) => {
  return {
    type: actions.SET_LOADING,
    payload: status,
  };
};

/**
 * 设置用户昵称
 * @param nickName 昵称
 */
export const setNickName = (nickName: string) => {
  return {
    type: actions.SET_NICKNAME,
    payload: nickName,
  };
};

/**
 * 登出
 */
export const signOut = () => {
  return {
    type: actions.SIGN_OUT,
  };
};

/**
 * 上传头像
 * @param formData 头像
 */
export const uploadAvatar = (formData: any) => {
  return dispatch => {
    Api.uploadAttach(formData).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(setUserAvatar(data.token));
      }
    });
  };
};

/**
 * 设置用户头像
 * @param avatar 头像Url
 */
export const setUserAvatar = (data: string) => {
  return {
    type: actions.SET_USER_AVATAR,
    payload: data,
  };
};

/**
 * 获取邮箱验证码
 * @param email 邮箱
 */
export const getEmailCode = (email: string, type = 1) => {
  return (dispatch: Dispatch) => {
    Api.getEmailCode(email, type).then(res => {
      const { code, message } = res.data;
      dispatch(setHomeErr({
        code,
        msg: message,
      }));
    });
  };
};

/**
 * 设置请求的状态
 * @param status 当前状态
 */
export const setReqStatus = (status: boolean) => {
  return {
    type: actions.SET_REQ_STATUS,
    payload: status,
  };
};

/**
 *  设置http请求错误信息
 * @param info 错误信息
 */
export const setHttpErrInfo = (info: IHttpErr | null) => {
  return {
    type: actions.SET_HTTP_ERR_INFO,
    payload: info,
  };
};

/**
 * 更新密码
 */
export const updatePwd = password => {
  return dispatch => {
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
    });
  };
};

/**
 * 解除账户绑定
 */
export const unBindAccount = (type: BindAccount) => {
  return dispatch => {
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
    });
  };
};

/**
 * 更新userinfo中的部分值
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
