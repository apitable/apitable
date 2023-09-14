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

/*
 * Initialization functions, used for some non-constructor type things that need to be initialized and executed at startup again
 */
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import axios from 'axios';
import dayjs from 'dayjs';
import { Store } from 'redux';
import {
  Api,
  getLanguage,
  IAxiosResponse,
  injectStore,
  IReduxState,
  Navigation,
  Selectors,
  StatusCode,
  StoreActions,
  Strings,
  t,
  Url,
  WasmApi,
} from '@apitable/core';
import { getBrowserDatabusApiEnabled } from '@apitable/core/dist/modules/database/api/wasm';
import { BillingModal, Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';
import { getEnvVariables, getInitializationData, getReleaseVersion, getSpaceIdFormTemplate } from 'pc/utils/env';
import '../../modules/shared/apphook/hook_bindings';
import { APITable } from '../../modules/shared/apitable_lib';
import { initCronjobs } from './cronjob';
import './store_subscribe';
// @ts-ignore
import { isSocialUrlIgnored } from 'enterprise';

declare let window: any;
if (!process.env.SSR && window !== undefined) {
  window.APITable = APITable;
}

function hasUrlIgnore(curUrl: string | undefined): boolean {
  if (!curUrl) {
    return false;
  }

  if (isSocialUrlIgnored?.(curUrl)) {
    return true;
  }

  const ignoreData = [Url.USER_ME, Url.KEEP_TAB_BAR, Url.JOIN_VIA_LINK, Url.LINK_VALID];

  for (const url of ignoreData) {
    if (curUrl.includes(url) || curUrl.includes('dataPack')) {
      return true;
    }
  }

  return false;
}

export function handleResponse<T>(
  response: {
    data: IAxiosResponse<T>['data'];
  },
  headers: any | undefined,
  url: string | undefined,
) {
  const { success, code, data, message = 'Error' } = response.data;

  const IGNORE_PATH_REG = /^\/(share|template|notify|embed)/;
  if (success && data && url?.startsWith('/nest/v1/') && !IGNORE_PATH_REG.test(location.pathname)) {
    const state = store.getState();
    const activeSpaceId = Selectors.activeSpaceId(state);
    // @ts-ignore
    const spaceId = data.datasheet?.spaceId || data.mirror?.spaceId || data.dashboard?.spaceId || data.form?.spaceId;
    if (spaceId && spaceId !== activeSpaceId) {
      axios.defaults.headers.common['X-Space-Id'] = spaceId;
      // @ts-ignore
      store.dispatch(StoreActions.getUserMe({ spaceId }));
    }
  }

  if (!success && String(code).startsWith('5')) {
    Sentry.captureMessage(message, {
      extra: {
        headers: headers,
      },
    });
  }
  if (success || hasUrlIgnore(url)) {
    return response;
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
    case StatusCode.OPERATION_FREQUENT: {
      Modal.error({
        title: t(Strings.get_verification_code_err_title),
        content: t(Strings.get_verification_code_err_content),
        okText: t(Strings.get_verification_code_err_button),
      });
      return Promise.reject();
    }
    case StatusCode.LOGIN_OUT_NUMBER: {
      Modal.error({
        title: t(Strings.login_frequent_operation_reminder_title),
        content: t(Strings.login_frequent_operation_reminder_content),
        okText: t(Strings.login_frequent_operation_reminder_button),
        onOk: () => {
          Router.redirect(Navigation.LOGIN);
        },
      });
      return Promise.reject();
    }
    case StatusCode.NODE_NUMBER_ERR: {
      Modal.error({
        title: t(Strings.node_not_exist_title),
        content: t(Strings.node_number_err_content),
        onOk: () => {
          Router.redirect(Navigation.HOME);
        },
      });
      return Promise.reject();
    }

    case StatusCode.NODE_NOT_EXIST: {
      Api.keepTabbar({});
      return Promise.resolve(response);
    }
    case StatusCode.NOT_PERMISSION: {
      Api.keepTabbar({});
      return Promise.resolve(response);
    }
    case StatusCode.PAYMENT_PLAN: {
      BillingModal();
      return Promise.reject();
    }
    case StatusCode.SPACE_NOT_EXIST: {
      if (window.location.pathname.search('/invite') === -1) {
        Modal.error({
          title: t(Strings.no_access_space_title),
          content: t(Strings.no_access_space_descirption),
          okText: t(Strings.refresh),
          onOk: () => {
            Router.push(Navigation.HOME);
          },
        });
      }
      return Promise.reject();
    }
    case StatusCode.FRONT_VERSION_ERROR: {
      window.dispatchEvent(new CustomEvent('newVersionRequired'));
      return Promise.reject();
    }
    default:
      return Promise.resolve(response);
  }
}

function initAxios(store: Store<IReduxState>) {
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
        config.headers.common[k] = customHeaders[k];
      }
    }
    return config;
  });

  axios.interceptors.response.use((response) => {
    return handleResponse(response.data, response, response.config.url);
  });

  if (process.env.NODE_ENV === 'production') {
    axios.defaults.headers.common['X-Front-Version'] = getReleaseVersion();
    const spaceId = getSpaceIdFormTemplate();
    if (spaceId) {
      axios.defaults.headers.common['X-Space-Id'] = spaceId;
    }
  }
}

function initBugTracker() {
  const dsn = getEnvVariables().SENTRY_DSN;
  // Reporting is not enabled for local development and private deployments
  if (!dsn) {
    return;
  }

  Sentry.init({
    enabled: true,
    dsn,
    integrations: [
      new Integrations.BrowserTracing()!,
      new RewriteFrames()!,
      /**
       * @description Sentry's handling of requestAnimationFrame in Chrome 74 can be problematic and lead to unexpected errors
       * Currently rewriting the check for requestAnimationFrame based on the method provided in Sentry's issue
       * @issue https://github.com/getsentry/sentry-javascript/issues/3388
       * @type {boolean}
       */
      // new Sentry.Integrations.TryCatch({
      //   requestAnimationFrame: false,
      // })
    ],
    environment: getInitializationData().env,
    release: getReleaseVersion(),
    normalizeDepth: 5,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 10,
    /**  Every time a page is entered, a pageload or a route change is made, a record is automatically sent to the sentry,
     *   which doesn't make much sense at the moment, so turn it off and watch it later.
     */
    autoSessionTracking: false,
    ignoreErrors: [
      // It was found that all hovers where tooltip appears send a request to sentry and the exception status is this
      'ResizeObserver loop limit exceeded',
    ],
  });
}

function initDayjs(comlink: any) {
  let lang = getLanguage() || 'zh-cn';
  lang = lang.toLowerCase().replace('_', '-');
  dayjs.locale(lang);
  comlink.proxy?.initHook(lang);
}

export function redirectIfUserApplyLogout() {
  const state = store.getState();
  const initData = getInitializationData();
  const userInfo = state.user.info || initData.userInfo;
  if (userInfo && userInfo.isPaused) {
    Router.push(Navigation.APPLY_LOGOUT);
  }
}

export function initializer(comlink: any) {
  initAxios(comlink.store);

  if (getBrowserDatabusApiEnabled()) {
    WasmApi.initializeDatabusWasm().then((r) => {});
  } else {
    console.log('web assembly is not supported');
  }

  window.__global_handle_response = handleResponse;

  // Initialisation Field.bindModel
  injectStore(comlink.store);
  initCronjobs(comlink.store);
  initDayjs(comlink);

  initBugTracker();
}

// tslint:disable

/**
 * @description
 * @param {*} fn Scroll functions for table areas
 * @param {*} id The dom id to be rolled up for testing
 * @param {*} totalCount Number of calculations, also refers to the total time of test execution
 * @param {*} dps Distance scrolled in every 16s for blocking test
 * @returns
 */
function checkFps(fn: (arg0: WheelEvent) => void, id: string, totalCount: number, dps: any) {
  return new Promise((resolve) => {
    const element = document.getElementById(id)!;

    function simulatScroll() {
      return setInterval(() => {
        dispatchScrollEvent(dps);
      }, 16);
    }

    function dispatchScrollEvent(deltaY: number) {
      const domRect = element.getBoundingClientRect();
      const evt = new WheelEvent('wheel', {
        deltaX: 0,
        deltaY: deltaY,
        wheelDeltaX: 0,
        wheelDeltaY: deltaY,
        pageX: domRect.left + 100,
        pageY: domRect.top + 100,
      } as any);
      fn(evt);
    }

    function showFps(totalCount: number) {
      window._fpsResult = {
        fps: [],
        averageFps: undefined,
      };
      const result = window._fpsResult;

      let frame = 0;
      let count = 0; // Number of frame rate calculation nodes (about one second at a time)
      let time = Date.now();
      let rafId: any;

      const scrollTmer = simulatScroll();

      function step() {
        frame++;
        rafId = window.requestAnimationFrame(step);
      }

      rafId = window.requestAnimationFrame(step);
      const timer = setInterval(() => {
        count++;
        const timeEscape = (Date.now() - time) / 1000;
        const fps = frame / timeEscape;
        result.fps.push(fps);
        if (count >= totalCount) {
          // Remove the first and last seconds
          result.fps.shift();
          result.fps.pop();
          result.averageFps = result.fps.reduce((cur: any, prev: any) => cur + prev) / result.fps.length;
          window.clearInterval(timer);
          window.clearInterval(scrollTmer);
          window.cancelAnimationFrame(rafId);
          resolve(result);
          return;
        }
        frame = 0;
        time = Date.now();
      }, 1000);
    }

    // Scroll to the top
    // const sheet = window.spread.getActiveSheet();
    // sheet.showCell(0, 0, 0, 0);
    showFps(totalCount);
  });
}

(() => {
  if (!process.env.SSR) {
    window.checkFps = checkFps;
  }
})();
