import { ConfigConstant } from '@vikadata/core';
import { getEnvVars } from 'get_env';
import { browser } from 'pc/common/browser';
import { IInitializationData } from 'typings';

export function getInitializationData(): IInitializationData {
  return Object.assign({
    env: 'development',
    envVars: getEnvVars(),
    locale: 'zh-CN',
  }, window.__initialization_data__ || {});
}

export function getEnvVariables() {
  return getInitializationData().envVars;
}

export function isHiddenQRCode() {
  const env = getEnvVariables();
  return env.HIDDEN_QRCODE;
}

/**
 * 获取当前代码打包的 prerelease 类型
 * 打包类型按照分支区分
 * integration, or others: alpha
 * staging: beta
 * master（tag）: release or undefined
 * @returns alpha, beta, release or undefined
 */
export function getPrerelease() {
  const initData = getInitializationData();
  return initData.version ? semver.prerelease(initData.version) : null;
}

/**
 * 非生产环境的包都属于 preview 包版本
 * 生产环境不会有 preRelease 后缀，或者后缀为 release。
 */
export function isPreviewMode() {
  const preRelease = getPrerelease();
  return Boolean(!preRelease || !['release'].includes(preRelease[0] as string));
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
