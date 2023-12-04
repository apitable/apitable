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

import { APITipConfigInterface, Tips } from 'config/api_tip_config.interface';
import * as apiTipConfigJson from './api_tip_config.source.json';
import * as systemConfigJson from './system_config.source.json';
import { SystemConfigInterface, Notifications, Templates, Types } from './system_config.interface';

/**
 * config class, directly get the entire class of SystemConfig
 */
const SystemConfig: SystemConfigInterface = systemConfigJson as unknown as SystemConfigInterface;

/**
 * api tip config class
 */
const ApiTipConfig = apiTipConfigJson as APITipConfigInterface;

/**
 * Settings object, quickly get system_config.system table, system constant configuration
 *
 * pass in key
 * @example Conf.api_rate...
 */
const Settings = SystemConfig.settings;

// notification
const jsonToObject = (object: object) => {
  const obj = { ...object };
  Object.keys(object).forEach((i) => {
    obj[i] = i;
  });
  return obj;
};
const Notifications = (SystemConfig.notifications as any) as Notifications;

const NotificationTypes = Notifications.types;
const NotificationTemplates = Notifications.templates;

const NoticeTypesConstant = jsonToObject(Notifications.types) as {
  [key in keyof Types]: key;
};
const NoticeTemplatesConstant = jsonToObject(Notifications.templates) as {
  [key in keyof Templates]: key;
};
const ApiTipConstant = jsonToObject(ApiTipConfig.api.tips) as {
  [key in keyof Tips]: key;
};

export {
  SystemConfig,
  Settings,
  NotificationTypes,
  NotificationTemplates,
  NoticeTypesConstant,
  NoticeTemplatesConstant,
  ApiTipConfig,
  ApiTipConstant,
};
