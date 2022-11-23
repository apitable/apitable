import { ConfigConstant } from '@apitable/core';
import { getEnvVars } from 'get_env';
import { browser } from 'modules/shared/browser';
import { IInitializationData } from 'typings';

export function getInitializationData(): IInitializationData {
  const base = {
    env: 'development',
    envVars: getEnvVars(),
    locale: 'zh-CN',
  };
  if (process.env.SSR) {
    return base;
  }
  return Object.assign(base, window.__initialization_data__ || {});
}

export function getEnvVariables() {
  return getInitializationData().envVars;
}

export function isHiddenQRCode() {
  const env = getEnvVariables();
  return env.HIDDEN_QRCODE;
}

export function isMobileApp() {
  if (process.env.SSR) {
    return;
  }
  return browser.getUA().includes(ConfigConstant.MOBILE_APP_UA);
}

export function getReleaseVersion() {
  const defaultVersion = 'development';
  const initData = getInitializationData();

  if (initData && initData.version) {
    return initData.version;
  }
  return defaultVersion;
}

export function getSpaceIdFormTemplate() {
  const initData = getInitializationData();

  if (initData) {
    const user = initData.userInfo;
    if (user && user.spaceId) {
      return user.spaceId;
    }
  }
  return null;
}

export const IS_QQBROWSER =
  typeof navigator !== 'undefined' && /.*QQBrowser/.test(navigator.userAgent);

export const isIframe = () => {
  return window.self !== window.top;
};
