/*
 * Initialization functions, used for some non-constructor type things that need to be initialized and executed at startup again
 */
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import { Api, getLanguage, injectStore, Navigation, Selectors, StatusCode, StoreActions, Strings, t, Url } from '@apitable/core';
import axios from 'axios';
import dayjs from 'dayjs';
import { BillingModal, Modal } from 'pc/components/common/modal/modal/modal';
import { Router } from 'pc/components/route_manager/router';
import { store } from 'pc/store';
import { getEnvVariables, getInitializationData, getReleaseVersion, getSpaceIdFormTemplate } from 'pc/utils/env';
import '../../modules/shared/apphook/hook_bindings';
import { initCronjobs } from './cronjob';
import './store_subscribe';
import { APITable } from '../../modules/shared/apitable_lib';

declare let window: any;
if (!process.env.SSR && window !== undefined) {
  window.APITable = APITable;
}

const isMatch = (staticUrl: string, url: string) => {
  const formatArr = staticUrl.replace(/:[0-9A-Za-z]+/g, '*').split('*');
  return formatArr.every(item => url.includes(item));
};

function hasUrlIgnore(curUrl: string | undefined): boolean {
  if (!curUrl) {
    return false;
  }
  const ignoreData = [
    Url.USER_ME,
    Url.KEEP_TAB_BAR,
    Url.JOIN_VIA_LINK,
    Url.LINK_VALID,
    Url.WECOM_AGENT_BINDSPACE
  ];

  if (
    isMatch(Url.SOCIAL_FEISHU_BIND_SPACE, curUrl) ||
    isMatch(Url.DINGTALK_H5_BIND_SPACE, curUrl) ||
    isMatch(Url.SOCIAL_DINGTALK_BIND_SPACE, curUrl) ||
    isMatch(Url.SOCIAL_DINGTALK_ADMIN_DETAIL, curUrl)
  ) {
    return true;
  }
  for (const url of ignoreData) {
    if (
      curUrl.includes(url) ||
      curUrl.includes('dataPack')

    ) {
      return true;
    }
  }

  return false;
}

function initAxios(store) {
  axios.defaults.paramsSerializer = (params) => {
    return Object.keys(params).filter(it => {
      return params.hasOwnProperty(it);
    }).reduce((pre, curr) => {
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

  axios.interceptors.response.use(response => {
    const {
      success,
      code,
      data,
      message = 'Error',
    } = response.data;
    const IGNORE_PATH_REG = /^\/(share|template|notify|embed)/;
    if (
      success && data && response.config.url?.startsWith('/nest/v1/') &&
      !IGNORE_PATH_REG.test(location.pathname)
    ) {
      const state = store.getState();
      const activeSpaceId = Selectors.activeSpaceId(state);
      const spaceId = data.datasheet?.spaceId || data.mirror?.spaceId || data.dashboard?.spaceId || data.form?.spaceId;
      if (spaceId && (spaceId !== activeSpaceId)) {
        axios.defaults.headers.common['X-Space-Id'] = spaceId;
        store.dispatch(StoreActions.getUserMe({ spaceId }));
      }
    }

    if (
      !success
      && String(code).startsWith('5')
    ) {
      Sentry.captureMessage(message, {
        extra: {
          headers: response.headers,
        },
      });
    }
    if (success || hasUrlIgnore(response.config.url)) {
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
              const reference = (new URLSearchParams(window.location.search)).get('reference')?.toString();
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
    ]
    ,
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
      'ResizeObserver loop limit exceeded'
    ],
  });
}

function initDayjs(comlink) {
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

export function initializer(comlink) {
  initAxios(comlink.store);

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
function checkFps(fn, id, totalCount, dps) {
  return new Promise(resolve => {
    const element = document.getElementById(id)!;

    function simulatScroll() {
      return setInterval(() => {
        const deltaY = dps;
        dispatchScrollEvent(deltaY);
      }, 16);
    }

    function dispatchScrollEvent(deltaY) {
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

    function showFps(totalCount) {
      window._fpsResult = {
        fps: [],
        averageFps: undefined,
      };
      const result = window._fpsResult;

      let frame = 0;
      let count = 0; // Number of frame rate calculation nodes (about one second at a time)
      let time = Date.now();
      let rafId;

      const scrollTmer = simulatScroll();

      function step() {
        frame++;
        rafId = window.requestAnimationFrame(step);
      }

      rafId = window.requestAnimationFrame(step);
      const timer = setInterval(() => {
        count++;
        const timeEscape = (Date.now() - time) / 1000;
        const fps = (frame / timeEscape);
        console.log(fps);
        result.fps.push(fps);
        if (count >= totalCount) {
          // Remove the first and last seconds
          result.fps.shift();
          result.fps.pop();
          result.averageFps = result.fps.reduce((cur, prev) => cur + prev) / result.fps.length;
          console.log(result);
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
