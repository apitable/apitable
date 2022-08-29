import { ICollaCommandExecuteResult, ICollaCommandOptions } from 'core';
import { widgetMessage } from 'iframe_message';
import { IResourceService } from 'resource';

/**
 * TODO 私有化
 * 是否是安全的域名
 * 1、vika.ltd 或者 vika.cn 结尾
 * 2、localhost 本地域名
 */
export const isSafeOrigin = (origin: string) => {
  const SAFE_ORIGIN_END = ['vika.ltd', 'vika.cn', window.location.origin];
  const LOCAL = ['https://localhost', 'http://localhost'];
  return SAFE_ORIGIN_END.some(str => origin.endsWith(str)) || LOCAL.some(str => origin.startsWith(str));
};

declare const window: any;

export function getLanguage() {
  const language = typeof window == 'object' &&
    window.__initialization_data__ &&
    window.__initialization_data__.lang;
  return language || 'zh-CN';
}

export function isIframe() {
  const isIframe = typeof window == 'object' && window.__initialization_data__ && window.__initialization_data__.isIframe;
  return isIframe;
}

export const cmdExecute = async(
  cmdOptions: ICollaCommandOptions, resourceService: IResourceService
): Promise<ICollaCommandExecuteResult<any>> => {
  if (isIframe()) {
    return (await widgetMessage.syncCmd(cmdOptions));
  }
  return resourceService.commandManager.execute(cmdOptions);
};
