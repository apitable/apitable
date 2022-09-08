import { Api, ApiInterface, ConfigConstant, IReduxState, IUnitValue, Navigation, StatusCode, StoreActions, Strings, t } from '@vikadata/core';
import { uploadAttachToS3, UploadType } from '@vikadata/widget-sdk';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { openSliderVerificationModal } from 'pc/components/common/slider_verification';
import { useLinkInvite } from 'pc/components/invite/use_invite';
import { Method, useNavigation } from 'pc/components/route_manager/use_navigation';
import { useDispatch } from 'pc/hooks/use_dispatch';
import { secondStepVerify } from 'pc/hooks/utils';
import { NotificationStore } from 'pc/notification_store';
import { store } from 'pc/store';
import { getSearchParams } from 'pc/utils';
import { isLocalSite } from 'pc/utils/catalog';
import { useSelector } from 'react-redux';
import { batchActions } from 'redux-batched-actions';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

/**
 * 该hook封装了用户请求处理相关的逻辑,
 */
export const useUserRequest = () => {
  const dispatch = useDispatch();
  const navigationTo = useNavigation();
  const urlParams = getSearchParams();
  const reference = urlParams.get('reference') || undefined;
  const activeSpaceId = useSelector(state => state.space.activeId);
  const userInfo = useSelector((state: IReduxState) => state.user.info);
  const inviteEmailInfo = useSelector(
    (state: IReduxState) => state.invite.inviteEmailInfo
  );
  const { join } = useLinkInvite();
  /**
   * 获取登录状态，如果已经登录，则将获取到的用户信息更新到redux中的userMe中
   * @param {{spaceId?: string | null, nodeId?: string | null}} locateIdMap
   * @param {boolean} filter
   * @returns {Promise<import("axios").AxiosResponse<IApiWrapper & {data: IUserInfo}>>}
   */
  const getLoginStatusReq =
    (locateIdMap: { spaceId?: string | null; nodeId?: string | null } = { spaceId: '', nodeId: '' }, filter = false) => {
      return Api.getUserMe(locateIdMap, filter).then((res) => {
        const { data, success, code, message } = res.data;
        if (success) {
          dispatch(
            batchActions(
              [
                StoreActions.setIsLogin(true),
                StoreActions.setUserMe(data),
                StoreActions.setLoading(false),
                StoreActions.updateUserInfoErr(null),
              ],
              LOGIN_SUCCESS
            )
          );
          if (!activeSpaceId) {
            dispatch(StoreActions.setActiveSpaceId(data.spaceId));
          }
          if (locateIdMap.spaceId) {
            NotificationStore.joinSpace(locateIdMap.spaceId);
          }
          return data;
        }
        if (code === StatusCode.INVALID_SPACE) {
          Modal.error({
            title: t(Strings.get_verification_code_err_title),
            content: t(Strings.enter_unactive_space_err_message),
            okText: t(Strings.submit),
            onOk: () => {
              navigationTo({ path: Navigation.HOME });
            },
          });
          return;
        }
        dispatch(StoreActions.setLoading(false));
        dispatch(
          StoreActions.updateUserInfoErr({
            code,
            msg: message,
          })
        );
        return;
      });

    };

  /**
   * 直接登录/注册
   */
  const loginOrRegisterReq = (loginData: ApiInterface.ISignIn, loginType?: ConfigConstant.LoginTypes) => {
    // 提取邀请加入的 spaceId，赠送空间需要用到
    const invite = store.getState().invite;
    const spaceId = invite?.inviteLinkInfo?.data?.spaceId || invite?.inviteEmailInfo?.data?.spaceId;
    return Api.signInOrSignUp({ ...loginData, spaceId }).then((res) => {
      const { success, code, message, data } = res.data;
      if (success) {
        dispatch(StoreActions.setLoading(true));

        const urlParams = getSearchParams();
        // 发送好友邀请码获得奖励
        const inviteCode = urlParams.get('inviteCode');
        if (inviteCode) {
          Api.submitInviteCode(inviteCode);
        }
        // 链接邀请
        if (!data) {
          if (urlParams.has('inviteLinkToken')) {
            join();
            return res.data;
          }
          // 邮箱邀请
          if (urlParams.has('inviteMailToken') && inviteEmailInfo) {
            navigationTo({
              path: Navigation.WORKBENCH,
              params: { spaceId: inviteEmailInfo.data.spaceId },
              method: Method.Redirect,
              clearQuery: true,
            });
            return res.data;
          }
        }

        if (reference) {
          localStorage.removeItem('reference');
          if (isLocalSite(window.location.href, reference)) {
            window.location.href = reference;
            return;
          }
        }

        // 正常流程
        if (data) {
          navigationTo({ path: Navigation.WORKBENCH, method: Method.Redirect });
          return res.data;
        }
        // ! 是否是从分享页面登录的（保存的是分享页面的地址）
        const shareReference = localStorage.getItem('share_login_reference');
        // 是否从分享页面登录的
        if (shareReference) {
          window.location.href = shareReference;
          return res.data;
        }
        // 如果有源URL地址，就跳转到源地址
        if (reference && isLocalSite(window.location.href, reference)) {
          window.location.href = reference;
          return res.data;
        }
        navigationTo({ path: Navigation.WORKBENCH, method: Method.Redirect });
        return res.data;
      }

      if (secondStepVerify(code)) {
        return;
      }
      dispatch(
        StoreActions.setHomeErr({
          code,
          msg: message,
        })
      );
      return res.data;
    });
  };

  /**
   * 登录【废弃】
   */
  const loginReq = (loginData: ApiInterface.ISignIn, loginType?: ConfigConstant.LoginTypes) => {
    return Api.signIn(loginData).then((res) => {
      const { success, code, message, data } = res.data;
      if (success) {

        dispatch(StoreActions.setLoading(true));

        const urlParams = getSearchParams();
        // 链接邀请
        if (urlParams.has('inviteLinkToken') && !data) {
          join();
          return res.data;
        }
        // 邮箱邀请
        if (urlParams.has('inviteMailToken') && !data && inviteEmailInfo) {
          navigationTo({
            path: Navigation.WORKBENCH,
            params: { spaceId: inviteEmailInfo.data.spaceId },
            clearQuery: true,
          });
          return res.data;
        }

        // 正常流程
        if (data) {
          navigationTo({
            path: Navigation.INVITATION_VALIDATION,
            query: {
              token: data,
              inviteCode: urlParams.get('inviteCode') || undefined,
              inviteLinkToken: urlParams.get('inviteLinkToken') || undefined,
              tenantKey: urlParams.get('tenantKey') || undefined,
              loginType,
              reference,
            },
          });
          return res.data;
        }
        // ! 是否是从分享页面登录的（保存的是分享页面的地址）
        const shareReference = localStorage.getItem('share_login_reference');
        // 是否从分享页面登录的
        if (shareReference) {
          window.location.href = shareReference;
          return res.data;
        }
        // 如果有源URL地址，就跳转到源地址
        if (reference && isLocalSite(window.location.href, reference)) {
          window.location.href = reference;
          return res.data;
        }
        navigationTo({ path: Navigation.HOME });
      }

      // 进行二次验证（滑块验证）
      if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
        openSliderVerificationModal();
      } else if (code === StatusCode.PHONE_VALIDATION) {
        Modal.confirm({
          title: t(Strings.warning),
          content: t(Strings.status_code_phone_validation),
          onOk: () => {
            window['nvc'].reset();
          },
          type: 'warning',
          okText: t(Strings.got_it),
          cancelButtonProps: {
            style: { display: 'none' },
          },
        });
        return;
      }
      dispatch(
        StoreActions.setHomeErr({
          code,
          msg: message,
        })
      );
      return res.data;
    });
  };

  // 注册（带上登录获取的 token，带上可选的邀请码）
  const signUpReq = (token: string, inviteCode?: string) => {
    return Api.signUp(token, inviteCode).then((res) => {
      const { success } = res.data;
      if (success) {
        const searchParams = getSearchParams();
        if (searchParams.toString()) {
          const paramsObj = {};
          searchParams.forEach((value, key) => {
            paramsObj[key] = value;
          });
          navigationTo({
            path: Navigation.SETTING_NICKNAME,
            query: { ...paramsObj, reference },
            method: Method.Redirect,
          });
          return res;
        }
        navigationTo({
          path: Navigation.SETTING_NICKNAME,
          query: { reference },
          method: Method.Redirect,
        });
        return res;
      }
      return res;
    });
  };

  /**
   * 退出登录
   */
  const signOutReq = () => {
    return Api.signOut().then((res) => {
      const { success, data } = res.data;
      if (success) {
        if (data.needRedirect) {
          window.location.href = data.redirectUri;
        } else {
          // navigationTo 方法会带上 reference，所以直接使用 location.href
          window.location.href = '/login';
        }
      }
    });
  };

  /**
   * 编辑自己在空间站的成员信息
   */
  const editOwnerMemberName = (memberName: string, oldUnitMap: IUnitValue | null, needMessage?: boolean) =>
    Api.updateOwnerMemberInfo(memberName).then((res) => {
      const { success } = res.data;
      if (success) {
        needMessage &&
        Message.success({
          content: t(Strings.message_member_name_modified_successfully),
        });
        dispatch(StoreActions.updateUserInfo({ memberName, isMemberNameModified: true }));
        // 修改成员信息后同步数表等成员信息
        if (oldUnitMap) {
          dispatch(StoreActions.updateUnitMap({
            [oldUnitMap.unitId]: {
              ...oldUnitMap,
              name: memberName,
            }
          }));
        }
      } else {
        needMessage &&
        Message.error({
          content: t(Strings.message_member_name_modified_failed),
        });
      }
    });

  // 生成开发者令牌
  const createApiKeyReq = () => {
    return Api.createApiKey().then((res) => {
      const { data, success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.generation_success) });
        return data.apiKey;
      }
      Message.error({ content: t(Strings.generation_fail) });
      return false;
    });
  };

  // 刷新开发者令牌
  const refreshApiKeyReq = (code?: string, type?: string) => {
    return Api.refreshApiKey(code, type).then((res) => {
      const { success, message, code } = res.data;
      if (success) {
        Message.success({ content: t(Strings.generation_success) });
        return res.data;
      }
      dispatch(StoreActions.setHomeErr({ code, msg: message }));
      return res.data;
    });
  };

  // 查看是否有成员管理权限
  const spaceResourceApi = () => {
    return Api.getSpaceResource().then((res): boolean => {
      const { success, data } = res.data;
      return (
        success &&
        data.permissions?.includes(ConfigConstant.PermissionCode.MEMBER)
      );
    });
  };

  // 是否开启全员可邀请
  const inviteStatusApi = () => {
    return Api.getSpaceFeatures().then((res) => {
      const { success, data } = res.data;
      return success && data.invitable;
    });
  };

  // 获取可邀请成员状态
  const getInviteStatus = async() => {
    if (!userInfo) {
      return;
    }

    if (userInfo.isMainAdmin) {
      return true;
    }

    if (userInfo.isAdmin) {
      // 判断是否有成员管理权限
      const membePermssion = await spaceResourceApi();
      if (membePermssion) {
        return true;
      }
    }
    return await inviteStatusApi();
  };

  // 更新头像
  const updateAvatar = (token: string, init?: boolean) => {
    return Api.updateUser({ avatar: token, init }).then((res) => {
      const { success, data } = res.data;
      if (success) {
        dispatch(StoreActions.setUserAvatar(data));
        dispatch(StoreActions.setReqStatus(true));
        return;
      }
    });
  };

  // 更新头像
  const customOrOfficialAvatarUpload = async({
    file,
    token,
  }: {
    file?: File;
    token?: string;
  }) => {
    if (!file && !token) {
      return;
    }
    if (token) {
      return await updateAvatar(token, false);
    }
    if (file) {
      return uploadAttachToS3({
        file: file,
        fileType: UploadType.UserAvatar
      }).then(async(res) => {
        const { success, data } = res.data;
        if (success) {
          return await updateAvatar(data.token, false);
        }
        return;
      });
    }
    return;
  };

  // 获取手机验证码
  const getSmsCodeReq = (
    areaCode: string,
    phone: string,
    type: number,
    data?: string
  ) => {
    return Api.getSmsCode(areaCode, phone, type, data).then((res) => {
      const { success, code } = res.data;
      if (success) {
        return res.data;
      }
      // 进行二次验证（滑块验证）
      if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
        openSliderVerificationModal();
      } else if (code === StatusCode.PHONE_VALIDATION) {
        Modal.confirm({
          title: t(Strings.warning),
          content: t(Strings.status_code_phone_validation),
          onOk: () => {
            window['nvc'].reset();
          },
          type: 'warning',
          okText: t(Strings.got_it),
          cancelButtonProps: {
            style: { display: 'none' },
          },
        });
      }
      return res.data;
    });
  };

  // 获取邮件验证码
  const getEmailCodeReq = (email: string, type: number) => {
    return Api.getEmailCode(email, type).then((res) => {
      return res.data;
    });
  };

  // 找回密码
  const retrievePwdReq = (
    areaCode: string,
    username: string,
    code: string,
    password: string,
    type: string,
  ) => {
    return Api.retrievePwd(areaCode, username, code, password, type).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.password_reset_succeed) });
      }
      return res.data;
    });
  };

  // 修改密码
  const modifyPasswordReq = (password: string, code?: string, type?: string) => {
    return Api.updatePwd(password, code, type).then(res => {
      return res.data;
    });
  };

  const updateLangReq = (locale: string) => {
    return Api.updateUser({ locale }).then(res => {
      return res.data;
    });
  };

  const getUserCanLogoutReq = () => {
    return Api.getUserCanLogout().then(res => {
      return res.data;
    });
  };

  const submitInviteCodeReq = (inviteCode: string) => {
    return Api.submitInviteCode(inviteCode).then(res => {
      return res.data;
    });
  };

  return {
    getLoginStatusReq,
    loginOrRegisterReq,
    loginReq,
    signOutReq,
    editOwnerMemberName,
    createApiKeyReq,
    refreshApiKeyReq,
    getInviteStatus,
    customOrOfficialAvatarUpload,
    signUpReq,
    getSmsCodeReq,
    retrievePwdReq,
    getEmailCodeReq,
    getUserCanLogoutReq,
    modifyPasswordReq,
    updateLangReq,
    submitInviteCodeReq,
  };
};
