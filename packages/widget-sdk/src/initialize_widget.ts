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
  // url 不符合规范
  UrlIllegal = 1,
  // packageId 不匹配
  PackageIdNotMatch = 2,
  // 未解除浏览器加载 https 限制
  CretInvalid = 3,
  // 未启动
  LoadError = 4,
  // cli 版本太低
  CliLowVersion = 5,
  // 未知错误
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
        // 小程序加载之后，会触发 initializeWidget，存入componentMap，在下一个事件循环可以获取到
        setTimeout(() => {
          const cp = componentMap.get(widgetPackageId);
          if (!cp) {
            reject(WidgetLoadError.PackageIdNotMatch);
            return;
          }
          resolve(cp);
          console.log(`widgetPackage: ${widgetPackageId} loaded`);
        });
      },
      error: async() => {
        const error = await checkCretInvalid(url);
        reject(error);
      }
    });
  });
}

export function initializeWidget(Component: React.FC, widgetPackageId: string | undefined) {
  if (!widgetPackageId) {
    throw Error('widget 加载失败，未定义 widgetPackageId');
  }
  componentMap.set(widgetPackageId, Component);
}

/**
 * 小程序加载报错的时候区分是否是浏览器限制未解除
 * @param bundleUrl 
 */
export function checkCretInvalid(bundleUrl) {
  return new Promise((resolve, reject) => {
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
 * 小程序开发模式中，获取 sandbox 配置
 * @param bundleUrl bundleUrl 路径
 */
export function getWidgetConfig(bundleUrl) {
  const url = new URL(bundleUrl);
  return new Promise<IWidgetConfig>((resolve, reject) => {
    axios.get(`${url.origin}/widgetConfig?v=${Date.now()}`)
      .then(res => resolve(res.data))
      .catch(async() => {
        /**
         * 加载失败原因
         * 1、服务未启动
         * 2、浏览器限制未解除
         */
        const error = await checkCretInvalid(bundleUrl);
        reject(error);
      });
  });
}

/**
 * 小程序dev加载检查
 * @param bundleUrl 小程序 bundleUrl 路径
 * @param widgetPackageId 
 */
export function loadWidgetCheck(bundleUrl, widgetPackageId) {
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
 * 版本检查工具方法
 * a > b return 1
 * a = b return 0
 * a < b return -1
 * @param a 
 * @param b 
 */
function checkVersion(a, b) {
  const x = a.split('.').map(e => parseInt(e, 10));
  const y = b.split('.').map(e => parseInt(e, 10));

  for (const i in x) {
    y[i] = y[i] || 0;
    if (x[i] === y[i]) {
      continue;
    } else if (x[i] > y[i]) {
      return 1;
    } else {
      return -1;
    }
  }
  return y.length > x.length ? -1 : 0;
}

/**
 * cli 版本检查
 */
export function checkCliVersion(bundleUrl) {
  return new Promise<ICliInfo>((resolve, reject) => {
    axios.get<ICliInfo>(`${getDevWidgetHttpOrigin(bundleUrl)}/widget-cli/info?v=${Date.now()}`)
      .then(res => {
        const cliInfo = res.data;
        const minSupportVersion = SystemConfig.settings.widget_cli_min_version.value;
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