import { Modal } from 'antd';
import axios from 'axios';
import { Store } from 'redux';
import { IReduxState, Navigation, StatusCode, StoreActions, Strings, t } from '@apitable/core';
import { apiErrorManager } from 'api/utils/error_manager';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';
import { getInitializationData, getReleaseVersion, getSpaceIdFormTemplate } from 'pc/utils/env';

declare let window: any;

// function hasUrlIgnore(curUrl: string | undefined): boolean {
//   if (!curUrl) {
//     return false;
//   }
//
//   if (isSocialUrlIgnored?.(curUrl)) {
//     return true;
//   }
//
//   const ignoreData = [Url.USER_ME, Url.KEEP_TAB_BAR, Url.JOIN_VIA_LINK, Url.LINK_VALID];
//
//   for (const url of ignoreData) {
//     if (curUrl.includes(url) || curUrl.includes('dataPack')) {
//       return true;
//     }
//   }
//
//   return false;
// }

export function redirectIfUserApplyLogout() {
  const state = store.getState();
  const initData = getInitializationData();
  const userInfo = state.user.info || initData.userInfo;
  if (userInfo && userInfo.isPaused) {
    Router.push(Navigation.APPLY_LOGOUT);
  }
}

export function handleResponse<T>(response, headers: any | undefined, url: string | undefined) {
  const { success, code, message = 'Error' } = response;

  // const IGNORE_PATH_REG = /^\/(share|template|notify|embed)/;
  // if (success && data && url?.startsWith('/nest/v1/') && !IGNORE_PATH_REG.test(location.pathname)) {
  //   const state = store.getState();
  //   const activeSpaceId = Selectors.activeSpaceId(state);
  //   // @ts-ignore
  //   const spaceId = data.datasheet?.spaceId || data.mirror?.spaceId || data.dashboard?.spaceId || data.form?.spaceId;
  //   if (spaceId && spaceId !== activeSpaceId) {
  //     axios.defaults.headers.common['X-Space-Id'] = spaceId;
  //     // @ts-ignore
  //     store.dispatch(StoreActions.getUserMe({ spaceId }));
  //   }
  // }
  //
  // if (!success && String(code).startsWith('5')) {
  //   Sentry.captureMessage(message, {
  //     extra: {
  //       headers: headers,
  //     },
  //   });
  // }
  // if (success || hasUrlIgnore(url)) {
  //   return response;
  // }
  if (success) {
    return {
      data: response,
    };
  }

  try {
    apiErrorManager.handleError(code);
  } catch (e) {
    throw new Error(message);
  }

  switch (code) {
    case StatusCode.UN_AUTHORIZED: {
      if (window.location.pathname !== '/login') {
        Modal.error({
          title: t(Strings.login_status_expired_title),
          content: t(Strings.login_status_expired_content),
          okText: t(Strings.login_status_expired_button),
          onOk: () => {
            const IS_EMBED_LINK_REG = /^\/embed/;
            const reference = !IS_EMBED_LINK_REG.test(location.pathname)
              ? new URLSearchParams(window.location.search).get('reference')?.toString()
              : window.location.href;
            store.dispatch(StoreActions.setUserMe(null));
            store.dispatch(StoreActions.setIsLogin(false));
            Router.redirect(Navigation.LOGIN, { query: { reference } });
          },
        });
      }
      return Promise.reject();
    }
    // case StatusCode.OPERATION_FREQUENT: {
    //   Modal.error({
    //     title: t(Strings.get_verification_code_err_title),
    //     content: t(Strings.get_verification_code_err_content),
    //     okText: t(Strings.get_verification_code_err_button),
    //   });
    //   return Promise.reject();
    // }
    // case StatusCode.LOGIN_OUT_NUMBER: {
    //   Modal.error({
    //     title: t(Strings.login_frequent_operation_reminder_title),
    //     content: t(Strings.login_frequent_operation_reminder_content),
    //     okText: t(Strings.login_frequent_operation_reminder_button),
    //     onOk: () => {
    //       Router.redirect(Navigation.LOGIN);
    //     },
    //   });
    //   return Promise.reject();
    // }
    // case StatusCode.NODE_NUMBER_ERR: {
    //   Modal.error({
    //     title: t(Strings.node_not_exist_title),
    //     content: t(Strings.node_number_err_content),
    //     onOk: () => {
    //       Router.redirect(Navigation.HOME);
    //     },
    //   });
    //   return Promise.reject();
    // }

    // case StatusCode.NODE_NOT_EXIST: {
    //   Api.keepTabbar({});
    //   return Promise.resolve(response);
    // }
    // case StatusCode.NOT_PERMISSION: {
    //   Api.keepTabbar({});
    //   return Promise.resolve(response);
    // }
    // case StatusCode.PAYMENT_PLAN: {
    //   BillingModal();
    //   return Promise.reject();
    // }
    // case StatusCode.SPACE_NOT_EXIST: {
    //   if (window.location.pathname.search('/invite') === -1) {
    //     Modal.error({
    //       title: t(Strings.no_access_space_title),
    //       content: t(Strings.no_access_space_descirption),
    //       okText: t(Strings.refresh),
    //       onOk: () => {
    //         Router.push(Navigation.HOME);
    //       },
    //     });
    //   }
    //   return Promise.reject();
    // }
    // case StatusCode.FRONT_VERSION_ERROR: {
    //   window.dispatchEvent(new CustomEvent('newVersionRequired'));
    //   return Promise.reject();
    // }
    // case billingErrorCode.OVER_LIMIT:
    // case billingErrorCode.OVER_LIMIT_2: {
    //   triggerUsageAlertUniversal('亲爱的用户，您当前的操作已经触发了您的订阅级别的用量限制。为了继续享受无限制的操作，我们建议您升级您的订阅。');
    //   return Promise.reject();
    // }
    default:
      return {
        data: response,
      };
  }
}

export function initAxios(store: Store<IReduxState>) {
  axios.defaults.paramsSerializer = (params) => {
    return Object.keys(params)
      .filter((it) => {
        return params.hasOwnProperty(it);
      })
      .reduce((pre, curr) => {
        if (params[curr] === null || typeof params[curr] === 'undefined') {
          return pre;
        }
        return (pre ? pre + '&' : '') + curr + '=' + encodeURIComponent(params[curr]);
      }, '');
  };

  axios.interceptors.request.use((config) => {
    redirectIfUserApplyLogout();
    const customHeaders = window.__initialization_data__.headers;
    if (customHeaders && Object.keys(customHeaders).length) {
      for (const k in customHeaders) {
        config!.headers!.common[k] = customHeaders[k];
      }
    }
    return config;
  });

  const IGNORE_PATHS = ['/client/info', '/user/me', '/space/link/join', '/org/loadOrSearch', '/field/permission', '/space/features', '/space/info'];
  axios.interceptors.response.use((response) => {
    if (!response) return response;
    if (response.config && response.config.url && IGNORE_PATHS.some((path) => response.config.url?.includes(path))) {
      return response;
    }
    return handleResponse(response.data, response, response?.config?.url);
  });

  if (process.env.NODE_ENV === 'production') {
    axios.defaults.headers.common['X-Front-Version'] = getReleaseVersion();
    const spaceId = getSpaceIdFormTemplate();
    if (spaceId) {
      axios.defaults.headers.common['X-Space-Id'] = spaceId;
    }
  }
}
