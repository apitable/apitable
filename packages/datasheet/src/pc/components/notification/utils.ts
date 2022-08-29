import { SystemConfig, t, Strings, integrateCdnHost, Settings } from '@vikadata/core';
import { SystemConfigInterfaceNotifications, Templates, Types } from '@vikadata/core/src/config/system_config.interface';
import { TriggerCommands } from 'pc/common/apphook/trigger_commands';
import { getInitializationData } from 'pc/utils/env';
import semver from 'semver';

const jsonToObject = (object) => {
  const obj = { ...object };
  Object.keys(object).forEach(i => {
    obj[i] = i;
  });
  return obj;
};
const NotificationsConfig = SystemConfig.notifications as any as SystemConfigInterfaceNotifications;

const NotificationTypes = NotificationsConfig.types;
const NotificationTemplates = NotificationsConfig.templates;

const NoticeTypesConstant = jsonToObject(NotificationsConfig.types) as {[key in keyof Types]: string};
const NoticeTemplatesConstant = jsonToObject(NotificationsConfig.templates) as {[key in keyof Templates]: string};

export {
  NotificationTypes,
  NotificationTemplates,
  NoticeTypesConstant,
  NoticeTemplatesConstant,
};

const removeFirstV = (s: string): string => {
  if (['v', 'V'].includes(s[0])) {
    return s.slice(1);
  }
  return s;
};

// 判断当前用户是否未更新到新版本
export const isUserInOldVersionOrLocal = (latestVersion: string) => {
  const curVersion = getInitializationData().version;
  if (!curVersion) return true;

  return semver.lt(
    removeFirstV(curVersion),
    removeFirstV(latestVersion)
  );
};

// 处理点击事件
export const stringToActions = (arr: string[], id: string, url?: string) => {
  arr.forEach(str => {
    const firstIndex = str.indexOf('(');
    const secondIndex = str.lastIndexOf(')');
    if(firstIndex === -1 || secondIndex === -1) return;
    const actionStr = str.slice(0,firstIndex);
    const argsStr = str.slice(firstIndex+1, secondIndex);
    switch(actionStr){
      case 'mark_cur_notice_to_read':
        TriggerCommands['mark_notice_to_read']([id]);
        break;
      case 'window_open_url':
      case 'window_location_href_to':
        if(url){
          TriggerCommands[actionStr](url);
        }
        break;
      default:
        const command = TriggerCommands[actionStr];
        argsStr ? command(JSON.parse(argsStr)) : command();
        break;
    }
  });
};

// 创建浏览器通知
const createWebNotification = (data:{title?: string, options?: NotificationOptions | undefined, onClick?: ()=>void}) => {
  const { title = t(Strings.vikadata), options, onClick } = data;
  const webNotification = new Notification(title, {
    icon: integrateCdnHost(Settings.vika_logo.value),
    tag: 'vika',
    ...options,
  });
  if(onClick){
    webNotification.onclick = onClick;
  }
};
// 验证浏览器通知的授权信息，根据结果显示浏览器通知
export const requestWebNotification = (data:{title?: string, options?: NotificationOptions | undefined, onClick?: ()=>void}) => {
  if (window.Notification && Notification.permission === 'granted') {
    createWebNotification(data);
  } else if (window.Notification && Notification.permission === 'default') {
    Notification.requestPermission().then(result => {
      if (result === 'granted') {
        createWebNotification(data);
      }
    });
  }
};
