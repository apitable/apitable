/*
 * 初始化函数，用于一些非构造器型，需要再启动时进行初始化执行的事情
 */
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Api, getLanguage, injectStore, Navigation, Selectors, StatusCode, StoreActions, Strings, t, Url } from '@vikadata/core';
import axios from 'axios';
import dayjs from 'dayjs';
import { BillingModal, Modal } from 'pc/components/common/modal/modal/modal';
import { Method, navigatePath } from 'pc/components/route_manager/use_navigation';
import { store } from 'pc/store';
import { getEnvVariables, getInitializationData, getReleaseVersion, getSpaceIdFormTemplate } from 'pc/utils/env';
import './apphook/hook_bindings';
import { initCronjobs } from './cronjob';
import { initialConfig } from './initial_config';
import './store_subscribe';
import { vika } from './vikalib';

declare let window: any;
if (!process.env.SSR && window !== undefined) {
  window.vika = vika;
  initialConfig();
}

const isMatch = (staticUrl: string, url: string) => {
  const formatArr = staticUrl.replace(/:[0-9A-Za-z]+/g, '*').split('*');
  return formatArr.every(item => url.includes(item));
};

// 判断当前Url是否属于存在于要忽略的url集合中
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
    // 由于请求部分接口是通过模板动态渲染的，因此临时采用匹配子串的方式解决
    // 为了捕获 errorCode，需要过滤 数表/神奇表单/... 等相关接口
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
  // 对url的query进行转义
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
    return config;
  });

  axios.interceptors.response.use(response => {
    const {
      success,
      code,
      data,
      message = 'Error',
    } = response.data;
    const IGNORE_PATH_REG = /^\/(share|template|notify)/;
    // 当路由上的nodeId变化是跨空间的话，需要重新获取用户相关的信息
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
              navigatePath({ path: Navigation.LOGIN, query: { reference }, method: Method.Redirect });
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
            navigatePath({ path: Navigation.LOGIN, method: Method.Redirect });
          },
        });
        return Promise.reject();
      }
      case StatusCode.NODE_NUMBER_ERR: {
        Modal.error({
          title: t(Strings.node_not_exist_title),
          content: t(Strings.node_number_err_content),
          onOk: () => {
            navigatePath({ path: Navigation.HOME, method: Method.Redirect });
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
              navigatePath({ path: Navigation.HOME });
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
  // 本地开发和私有化部署不启用上报
  if (!dsn) {
    return;
  }

  Sentry.init({
    enabled: true,
    dsn,
    integrations: [
      new Integrations.BrowserTracing(),
      new RewriteFrames(),
      /**
       * @description Sentry 在 Chrome 74 对 requestAnimationFrame 的处理会有问题，会导致意外的报错
       * 目前根据 Sentry 的 Issue 中提供的方法重写对 requestAnimationFrame 的检查
       * @issue https://github.com/getsentry/sentry-javascript/issues/3388
       * @type {boolean}
       */
      new Sentry.Integrations.TryCatch({
        requestAnimationFrame: false,
      })]
    ,
    environment: getInitializationData().env,
    release: getReleaseVersion(),
    normalizeDepth: 5,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 10,
    // 每进入一个页面，发生一次 pageload 或者路由的变更，都会自动向 sentry 发送一条记录，目前来看这个数据没有多大意义，先关闭，后续观察
    autoSessionTracking: false,
    ignoreErrors: [
      // 发现所有 hover 出现 tooltip 的地方都会向 sentry 发送请求，异常状态都是这个
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
    navigatePath({ path: Navigation.APPLY_LOGOUT, method: Method.Push });
  }
}

export function initializer(comlink) {
  initAxios(comlink.store);

  // 初始化 Field.bindModel
  injectStore(comlink.store);
  initCronjobs(comlink.store);
  initDayjs(comlink);

  initBugTracker();
}

// tslint:disable

/**
 * @description
 * @param {*} fn 表格区域的滚动函数
 * @param {*} id 需要滚动测试的 dom id
 * @param {*} totalCount 计算次数，也指代测试执行的总时间
 * @param {*} dps 每 16s 内滚动的距离，用来进行阻塞测试
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
      let count = 0; // 帧率计算节点次数（每次一秒左右）
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
          // 去掉第一秒和最后一秒
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

    // 滚动到顶部
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
