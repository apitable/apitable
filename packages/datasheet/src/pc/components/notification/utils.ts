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

import semver from 'semver';
import { integrateCdnHost, Strings, SystemConfig, t } from '@apitable/core';
import { Notifications, Templates, Types } from '@apitable/core/src/config/system_config.interface';
import { TriggerCommands } from 'modules/shared/apphook/trigger_commands';
import { getEnvVariables, getInitializationData } from 'pc/utils/env';

const jsonToObject = (object: any) => {
  const obj = { ...object };
  Object.keys(object).forEach((i) => {
    obj[i] = i;
  });
  return obj;
};
const NotificationsConfig = SystemConfig.notifications as any as Notifications;

const NotificationTypes = NotificationsConfig.types;
const NotificationTemplates = NotificationsConfig.templates;

const NoticeTypesConstant = jsonToObject(NotificationsConfig.types) as { [key in keyof Types]: string };
const NoticeTemplatesConstant = jsonToObject(NotificationsConfig.templates) as { [key in keyof Templates]: string } as any;

export { NotificationTypes, NotificationTemplates, NoticeTypesConstant, NoticeTemplatesConstant };

const removeFirstV = (s: string): string => {
  if (['v', 'V'].includes(s[0])) {
    return s.slice(1);
  }
  return s;
};

// Determine if the current user has not updated to the new version
export const isUserInOldVersionOrLocal = (latestVersion: string) => {
  const curVersion = getInitializationData().version;
  if (!curVersion) return true;

  return semver.lt(removeFirstV(curVersion), removeFirstV(latestVersion));
};

export const stringToActions = (arr: string[], id: string, url?: string | { text: string }) => {
  arr.forEach((str) => {
    const firstIndex = str.indexOf('(');
    const secondIndex = str.lastIndexOf(')');
    if (firstIndex === -1 || secondIndex === -1) return;
    const actionStr = str.slice(0, firstIndex);
    const argsStr = str.slice(firstIndex + 1, secondIndex);
    switch (actionStr) {
      case 'mark_cur_notice_to_read':
        TriggerCommands['mark_notice_to_read']?.([id]);
        break;
      case 'window_open_url':
      case 'window_location_href_to':
        const _url = typeof url === 'string' ? url : url?.text;
        if (_url) {
          TriggerCommands[actionStr]?.(_url);
        }
        break;
      default:
        const command = TriggerCommands[actionStr];
        argsStr ? command?.(JSON.parse(argsStr)) : command?.();
        break;
    }
  });
};

const createWebNotification = (data: { title?: string; options?: NotificationOptions | undefined; onClick?: () => void }) => {
  const { title = t(Strings.system_configuration_product_name), options, onClick } = data;
  const webNotification = new Notification(title, {
    icon: integrateCdnHost(getEnvVariables().SYSTEM_CONFIGURATION_OFFICIAL_LOGO!),
    tag: 'vika',
    ...options,
  });
  if (onClick) {
    webNotification.onclick = onClick;
  }
};
// Validate the authorization information of browser notifications and display browser notifications according to the result
export const requestWebNotification = (data: { title?: string; options?: NotificationOptions | undefined; onClick?: () => void }) => {
  if (window.Notification && Notification.permission === 'granted') {
    createWebNotification(data);
  } else if (window.Notification && Notification.permission === 'default') {
    Notification.requestPermission().then((result) => {
      if (result === 'granted') {
        createWebNotification(data);
      }
    });
  }
};
