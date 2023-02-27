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

import React from 'react';
import $loadjs from 'loadjs';
import axios from 'axios';
import { SystemConfig } from '@apitable/core';

const componentMap = new Map<string, React.FC>();

const getDevWidgetHttpOrigin = (bundleUrl: string) => {
  const url = new URL(bundleUrl);
  const { hostname, port } = url;
  return `http://${hostname}:${Number(port) + 1}`;
};

export enum WidgetLoadError {
  // url dose not meet specifications
  UrlIllegal = 1,
  // packageId not match
  PackageIdNotMatch = 2,
  // browser loading https restriction not lifted
  CretInvalid = 3,
  // widget-cli not start
  LoadError = 4,
  // widget-cli too low version
  CliLowVersion = 5,
  // unknown version
  UnknownError = -1
}

export function loadWidget(url: string, widgetPackageId: string, refresh?: boolean) {
  return new Promise<React.FC>((resolve, reject) => {
    const component = componentMap.get(widgetPackageId);
    if (!refresh && component) {
      resolve(component);
      return;
    }
    const requestUrl = refresh ? url + `?v=${Date.now()}` : url;
    componentMap.delete(widgetPackageId);

    $loadjs(requestUrl, {
      success: () => {
        // after the widget is loaded, it will be triggered an initializeWidget,
        // which is stored in the componentMap and can be retrieved in the next event loop
        setTimeout(() => {
          const cp = componentMap.get(widgetPackageId);
          if (!cp) {
            reject(WidgetLoadError.PackageIdNotMatch);
            return;
          }
          resolve(cp);
          console.log('widgetPackage: %s loaded', widgetPackageId);
        });
      },
      error: async() => {
        const error = await checkCretInvalid(url);
        reject(error);
      }
    });
  });
}

export function initializeWidget(Component: React.FC<React.PropsWithChildren<unknown>>, widgetPackageId: string | undefined) {
  if (!widgetPackageId) {
    throw Error('widget load error, widgetPackageId is undefined');
  }
  componentMap.set(widgetPackageId, Component);
}

/**
 * distinguish whether the browser restriction is not lifted when the widget loads with an error
 * @param bundleUrl
 */
export function checkCretInvalid(bundleUrl: string) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = `${getDevWidgetHttpOrigin(bundleUrl)}/ping.png?v=${Date.now()}`;
    document.body.appendChild(img);
    img.onload = () => {
      resolve(WidgetLoadError.CretInvalid);
      img.parentElement?.removeChild(img);
    };
    img.onerror = () => {
      resolve(WidgetLoadError.LoadError);
      img.parentElement?.removeChild(img);
    };
  });
}

interface IWidgetConfig {
  sandbox?: boolean;
  packageId?: string;
}
/**
 * get sandbox configuration in widget development mode
 * @param bundleUrl bundleUrl path
 */
export function getWidgetConfig(bundleUrl: string) {
  const url = new URL(bundleUrl);
  return new Promise<IWidgetConfig>((resolve, reject) => {
    axios.get(`${url.origin}/widgetConfig?v=${Date.now()}`)
      .then(res => resolve(res.data))
      .catch(async() => {
        /**
         * reasons for loading failure
         * 1. service is not available
         * 2. browser restrictions are not lifted
         */
        const error = await checkCretInvalid(bundleUrl);
        reject(error);
      });
  });
}

/**
 * check for widget dev mode loading
 * @param bundleUrl path of the widget bundleUrl
 * @param widgetPackageId
 */
export function loadWidgetCheck(bundleUrl: string, widgetPackageId: string) {
  return new Promise<IWidgetConfig>((resolve, reject) => {
    checkCliVersion(bundleUrl).then(() => {
      getWidgetConfig(bundleUrl).then(res => {
        if (res.packageId === widgetPackageId) {
          resolve(res);
        } else {
          reject(WidgetLoadError.PackageIdNotMatch);
        }
      }).catch(reject);
    }).catch(reject);
  });
}

interface ICliInfo {
  version: string
}

/**
 * check version method
 * a > b return 1
 * a = b return 0
 * a < b return -1
 * @param a
 * @param b
 */
function checkVersion(a: string, b: string) {
  const x = a.split('.').map(e => parseInt(e, 10));
  const y = b.split('.').map(e => parseInt(e, 10));

  for (const i in x) {
    y[i] = y[i] || 0;
    if (x[i] === y[i]) {
      continue;
    } else if (x[i]! > y[i]!) {
      return 1;
    } else {
      return -1;
    }
  }
  return y.length > x.length ? -1 : 0;
}

/**
 * cli version check
 */
export function checkCliVersion(bundleUrl: string) {
  return new Promise<ICliInfo>((resolve, reject) => {
    axios.get<ICliInfo>(`${getDevWidgetHttpOrigin(bundleUrl)}/widget-cli/info?v=${Date.now()}`)
      .then(res => {
        const cliInfo = res.data;
        const minSupportVersion = SystemConfig.settings.widget_cli_miumum_version.value;
        if (checkVersion(cliInfo.version, minSupportVersion) === -1) {
          reject(WidgetLoadError.CliLowVersion);
          return;
        }
        resolve(cliInfo);
      })
      .catch(() => {
        reject(WidgetLoadError.LoadError);
      });
  });
}
