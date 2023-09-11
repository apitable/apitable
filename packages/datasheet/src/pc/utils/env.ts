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

export function isHiddenLivechat() {
  return getEnvVariables().LIVECHAT_VISIBLE;
}

export function isMobileApp() {
  if (process.env.SSR) {
    return;
  }
  return browser?.getUA().includes(ConfigConstant.MOBILE_APP_UA);
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

export const IS_QQBROWSER = typeof navigator !== 'undefined' && /.*QQBrowser/.test(navigator.userAgent);

export const isIframe = () => {
  return window.self !== window.top;
};
