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

import { batchActions } from 'redux-batched-actions';
import { Api, ApiInterface, ConfigConstant, IReduxState, IUnitValue, Navigation, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { uploadAttachToS3, UploadType } from '@apitable/widget-sdk';
import { Message } from 'pc/components/common/message';
import { Modal } from 'pc/components/common/modal/modal/modal';
import { openSliderVerificationModal } from 'pc/components/common/slider_verification';
import { ActionType } from 'pc/components/home/pc_home';
import { useLinkInvite } from 'pc/components/invite/use_invite';
import { Router } from 'pc/components/route_manager/router';
import { useDispatch } from 'pc/hooks/use_dispatch';
import { secondStepVerify } from 'pc/hooks/utils';
import { NotificationStore } from 'pc/notification_store';
import { store } from 'pc/store';
import { useAppSelector } from 'pc/store/react-redux';
import { isLocalSite } from 'pc/utils/catalog';
import { getSearchParams } from 'pc/utils/dom';
import { getEnvVariables } from 'pc/utils/env';
import { deleteStorageByKey, StorageName } from '../utils/storage';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

/**
 * This hook encapsulates the logic related to user request processing
 */
export const useUserRequest = () => {
  const dispatch = useDispatch();
  const urlParams = getSearchParams();
  const reference = urlParams.get('reference') || undefined;
  const activeSpaceId = useAppSelector((state) => state.space.activeId);
  const userInfo = useAppSelector((state: IReduxState) => state.user.info);
  const inviteEmailInfo = useAppSelector((state: IReduxState) => state.invite.inviteEmailInfo);
  const { join } = useLinkInvite();
  /**
   * Get the login status and update the user information into userMe in redux if you are already logged in.
   * @param {{spaceId?: string | null, nodeId?: string | null}} locateIdMap
   * @param {boolean} filter
   * @returns {Promise<import("axios").AxiosResponse<IApiWrapper & {data: IUserInfo}>>}
   */
  const getLoginStatusReq = (locateIdMap: { spaceId?: string | null; nodeId?: string | null } = { spaceId: '', nodeId: '' }, filter = false) => {
    return Api.getUserMe(locateIdMap, filter).then((res) => {
      const { data, success, code, message } = res.data;
      if (success) {
        dispatch(
          batchActions(
            [StoreActions.setIsLogin(true), StoreActions.setUserMe(data), StoreActions.setLoading(false), StoreActions.updateUserInfoErr(null)],
            LOGIN_SUCCESS,
          ),
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
            Router.push(Navigation.HOME);
          },
        });
        return;
      }
      dispatch(StoreActions.setLoading(false));
      dispatch(
        StoreActions.updateUserInfoErr({
          code,
          msg: message,
        }),
      );
      return;
    });
  };

  /**
   * Direct login/registration
   */
  const loginOrRegisterReq = (loginData: ApiInterface.ISignIn) => {
    // Extract the spaceId of the invitation to join, which is needed to give away space
    const invite = store.getState().invite;
    const spaceId = invite?.inviteLinkInfo?.data?.spaceId || invite?.inviteEmailInfo?.data?.spaceId;
    return Api.signInOrSignUp({ ...loginData, spaceId }).then((res) => {
      const { success, code, message, data } = res.data;
      if (success) {
        dispatch(StoreActions.setLoading(true));

        const urlParams = getSearchParams();
        // Send a friend invitation code for a reward
        const inviteCode = urlParams.get('inviteCode');
        if (inviteCode) {
          Api.submitInviteCode(inviteCode);
        }
        if (urlParams.has('inviteLinkToken')) {
          join();
          return;
        }
        if (!data) {
          if (urlParams.has('inviteMailToken') && inviteEmailInfo) {
            Router.redirect(Navigation.WORKBENCH, {
              params: { spaceId: inviteEmailInfo.data.spaceId },
              clearQuery: true,
            });
            return res.data;
          }
        }

        if (!getEnvVariables().IS_APITABLE && data?.isNewUser && loginData.type === ConfigConstant.LoginTypes.EMAIL) {
          const query: any = { improveType: ConfigConstant.ImproveType.Phone };
          const inviteLinkToken = urlParams.get('inviteLinkToken');
          const inviteMailToken = urlParams.get('inviteMailToken');
          if (reference) {
            query.reference = reference;
            localStorage.removeItem('reference');
          }
          if (inviteLinkToken) {
            query.inviteLinkToken = inviteLinkToken;
          }
          if (inviteMailToken) {
            query.inviteLinkToken = inviteLinkToken;
          }
          Router.redirect(Navigation.IMPROVING_INFO, { query });
          return;
        }

        if (reference) {
          localStorage.removeItem('reference');
          if (isLocalSite(window.location.href, reference)) {
            window.location.href = reference;
            return;
          }
        }

        if (data) {
          Router.redirect(Navigation.WORKBENCH);
          return res.data;
        }
        const shareReference = localStorage.getItem('share_login_reference');
        if (shareReference) {
          window.location.href = shareReference;
          return res.data;
        }
        if (reference && isLocalSite(window.location.href, reference)) {
          window.location.href = reference;
          return res.data;
        }
        Router.redirect(Navigation.WORKBENCH);
        return res.data;
      }

      if (!secondStepVerify(code)) {
        return;
      }
      dispatch(
        StoreActions.setHomeErr({
          code,
          msg: message,
        }),
      );
      return res.data;
    });
  };

  const bindPhoneReq = ({
    areaCode,
    phone,
    code,
    reference,
    inviteLinkToken,
    inviteMailToken,
  }: {
    areaCode: string;
    phone: string;
    code: string;
    reference?: string;
    inviteLinkToken?: string;
    inviteMailToken?: string;
  }) => {
    return Api.bindMobile(areaCode, phone, code).then((res) => {
      const { success, message } = res.data;
      if (success) {
        Message.success({
          content: t(Strings.binding_success),
        });

        if (inviteLinkToken) {
          join();
          return;
        }
        if (inviteMailToken && inviteEmailInfo) {
          Router.redirect(Navigation.WORKBENCH, {
            params: { spaceId: inviteEmailInfo.data.spaceId },
            clearQuery: true,
          });
          return;
        }
        if (reference) {
          localStorage.removeItem('reference');
          if (isLocalSite(window.location.href, reference)) {
            window.location.href = reference;
            return;
          }
        }

        Router.redirect(Navigation.WORKBENCH);
        return;
      }
      Message.success({
        content: message,
      });
    });
  };

  /**
   * Log in [abandoned]
   */
  const loginReq = (loginData: ApiInterface.ISignIn, loginType?: ConfigConstant.LoginTypes) => {
    const env = getEnvVariables();
    return Api.signIn(loginData).then((res) => {
      const { success, code, message, data } = res.data;
      if (success) {
        dispatch(StoreActions.setLoading(true));

        const urlParams = getSearchParams();
        if (urlParams.has('inviteLinkToken') && !data) {
          join();
          return res.data;
        }
        if (urlParams.has('inviteMailToken') && !data && inviteEmailInfo) {
          Router.push(Navigation.WORKBENCH, {
            params: { spaceId: inviteEmailInfo.data.spaceId },
            clearQuery: true,
          });
          return res.data;
        }

        if (data) {
          Router.push(Navigation.INVITATION_VALIDATION, {
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
        const shareReference = localStorage.getItem('share_login_reference');
        if (shareReference) {
          window.location.href = shareReference;
          return res.data;
        }
        if (reference && isLocalSite(window.location.href, reference)) {
          window.location.href = reference;
          return res.data;
        }
        Router.push(Navigation.HOME);
      }
      if (!env.IS_SELFHOST) {
        if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
          openSliderVerificationModal();
        } else if (code === StatusCode.PHONE_VALIDATION) {
          Modal.confirm({
            title: t(Strings.warning),
            content: t(Strings.status_code_phone_validation),
            onOk: () => {
              if (!env.IS_SELFHOST) {
                window['nvc'].reset();
              }
            },
            type: 'warning',
            okText: t(Strings.got_it),
            cancelButtonProps: {
              style: { display: 'none' },
            },
          });
          return;
        }
      }
      dispatch(
        StoreActions.setHomeErr({
          code,
          msg: message,
        }),
      );
      return res.data;
    });
  };

  const signUpReq = (token: string, inviteCode?: string) => {
    return Api.signUp(token, inviteCode).then((res) => {
      const { success } = res.data;
      if (success) {
        localStorage.removeItem('client-lang');
        deleteStorageByKey(StorageName.IsPanelClosed);
        const searchParams = getSearchParams();
        if (searchParams.toString()) {
          const paramsObj = {};
          searchParams.forEach((value, key) => {
            paramsObj[key] = value;
          });
          Router.redirect(Navigation.SETTING_NICKNAME, {
            query: { ...paramsObj, reference },
          });
          return res;
        }
        Router.redirect(Navigation.SETTING_NICKNAME, {
          query: { reference },
        });
        return res;
      }
      return res;
    });
  };

  const registerReq = (username: string, credential: string) => {
    const defaultLang = (): string => {
      // @ts-ignore
      const languageMap = (global || window).languageManifest;

      let userLanguage = navigator.language;

      if (userLanguage == 'zh-TW') {
        userLanguage = 'zh-HK';
      }
      if (languageMap[userLanguage]) {
        return userLanguage;
      } 
      const langArr = Object.keys(languageMap);
      for (let i = 0; i < langArr.length; i++) {
        if (langArr[i].indexOf(userLanguage) > -1) {
          return langArr[i];
        }
      }
      
      return 'en-US';
    };
    return Api.register(username, credential, defaultLang()).then((res) => {
      const { success } = res.data;
      if (success) {
        localStorage.removeItem('client-lang');
        deleteStorageByKey(StorageName.IsPanelClosed);
        dispatch(StoreActions.setLoading(true));

        const urlParams = getSearchParams();
        // Send a friend invitation code for a reward
        if (urlParams.has('inviteLinkToken')) {
          join();
          return res.data;
        }
        if (urlParams.has('inviteMailToken') && inviteEmailInfo) {
          Router.redirect(Navigation.WORKBENCH, {
            params: { spaceId: inviteEmailInfo.data.spaceId },
            clearQuery: true,
          });
          return res.data;
        }
        Router.redirect(Navigation.WORKBENCH, {
          query: { reference },
        });
        return res.data;
      }
      return res.data;
    });
  };

  /**
   * Logout
   */
  const signOutReq = () => {
    return Api.signOut().then((res) => {
      const { success, data } = res.data;
      if (success) {
        deleteStorageByKey(StorageName.IsPanelClosed);
        if (data.needRedirect) {
          window.location.href = data.redirectUri;
        } else {
          window.location.href = '/login';
          localStorage.setItem('loginAction', ActionType.SignIn);
        }
      }
    });
  };

  /**
   * Edit your own membership information on the space station
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
        // Synchronising member information such as datasheets after modifying member information
        if (oldUnitMap) {
          dispatch(
            StoreActions.updateUnitMap({
              [oldUnitMap.unitId]: {
                ...oldUnitMap,
                name: memberName,
              },
            }),
          );
        }
      } else {
        needMessage &&
          Message.error({
            content: t(Strings.message_member_name_modified_failed),
          });
      }
    });

  // Generating developer tokens
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

  // Refreshing the Developer Token
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

  // Whether to turn on full invitability
  const inviteStatusApi = () => {
    return Api.getSpaceFeatures().then((res) => {
      const { success, data } = res.data;
      return success && data.invitable;
    });
  };

  // Get Inviteable Member Status
  const getInviteStatus = async () => {
    if (!userInfo) {
      return;
    }
    return await inviteStatusApi();
  };

  // Update avatar
  const updateAvatar = (token: string, init?: boolean) => {
    return Api.updateUser({ avatar: token, init, avatarColor: null }).then((res) => {
      const { success, data } = res.data;
      if (success) {
        Message.success({
          content: t(Strings.avatar_modified_successfully),
        });
        dispatch(StoreActions.setUserAvatarColor(null));
        dispatch(StoreActions.setUserAvatar(data));
        dispatch(StoreActions.setReqStatus(true));
        return;
      }
    });
  };

  const updateAvatarColor = (avatarColor: number) => {
    return Api.updateUser({
      avatarColor,
      init: false,
      avatar: null as any,
    }).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({
          content: t(Strings.avatar_modified_successfully),
        });
        dispatch(StoreActions.setUserAvatarColor(avatarColor));
        dispatch(StoreActions.setUserAvatar(''));
        dispatch(StoreActions.setReqStatus(true));
        return;
      }
    });
  };

  // Update avatar
  const customOrOfficialAvatarUpload = async ({ file, token }: { file?: File; token?: string }) => {
    if (!file && !token) {
      return;
    }
    if (token) {
      return await updateAvatar(token, false);
    }
    if (file) {
      return uploadAttachToS3({
        file: file,
        fileType: UploadType.UserAvatar,
      }).then(async (res) => {
        const { success, data } = res.data;
        if (success) {
          return await updateAvatar(data.token, false);
        }
        return;
      });
    }
    return;
  };

  // Get mobile verification code
  const getSmsCodeReq = (areaCode: string, phone: string, type: number, data?: string) => {
    const env = getEnvVariables();
    return Api.getSmsCode(areaCode, phone, type, data).then((res) => {
      const { success, code } = res.data;
      if (success || env.IS_SELFHOST) {
        return res.data;
      }
      // Perform secondary verification (slider verification)
      if (code === StatusCode.SECONDARY_VALIDATION || code === StatusCode.NVC_FAIL) {
        openSliderVerificationModal();
      } else if (code === StatusCode.PHONE_VALIDATION) {
        Modal.confirm({
          title: t(Strings.warning),
          content: t(Strings.status_code_phone_validation),
          onOk: () => {
            if (!env.IS_SELFHOST) {
              window['nvc'].reset();
            }
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

  const getEmailCodeReq = (email: string, type: number) => {
    return Api.getEmailCode(email, type).then((res) => {
      return res.data;
    });
  };

  const retrievePwdReq = (areaCode: string, username: string, code: string, password: string, type: string) => {
    return Api.retrievePwd(areaCode, username, code, password, type).then((res) => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.password_reset_succeed) });
      }
      return res.data;
    });
  };

  const modifyPasswordReq = (password: string, code?: string, type?: string) => {
    return Api.updatePwd(password, code, type).then((res) => {
      return res.data;
    });
  };

  const updateLangReq = (locale: string) => {
    return Api.updateUser({ locale }).then((res) => {
      return res.data;
    });
  };

  const getUserCanLogoutReq = () => {
    return Api.getUserCanLogout().then((res) => {
      return res.data;
    });
  };

  const submitInviteCodeReq = (inviteCode: string) => {
    return Api.submitInviteCode(inviteCode).then((res) => {
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
    updateAvatarColor,
    registerReq,
    bindPhoneReq,
  };
};
