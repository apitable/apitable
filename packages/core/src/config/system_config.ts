import { APITipConfigInterface, Tips } from 'config/api_tip_config.interface';
import apiTipConfigJson from './api_tip_config.auto.json';
import { privateTransform } from './private_transform';
import systemConfigJson from './system_config.auto.json';
import { SystemConfigInterfaceNotifications, SystemConfigInterface, Templates, Types } from './system_config.interface';

/**
 * config类，直接获取SystemConfig整个类
 */
const SystemConfig: SystemConfigInterface = privateTransform(
  (systemConfigJson as any) as SystemConfigInterface,
  'settings',
  'value',
);

/**
 * api tip config class
 */
const ApiTipConfig = apiTipConfigJson as APITipConfigInterface;

/**
 * Settings对象, 快速获取system_config.system表, 系统常量配置
 *
 * 传入key
 * @example Conf.api_rate...
 */
const Settings = SystemConfig.settings;

// notification相关
const jsonToObject = (object) => {
  const obj = { ...object };
  Object.keys(object).forEach((i) => {
    obj[i] = i;
  });
  return obj;
};
const Notifications = (SystemConfig.notifications as any) as SystemConfigInterfaceNotifications;

const NotificationTypes = Notifications.types;
const NotificationTemplates = Notifications.templates;

const NoticeTypesConstant = jsonToObject(Notifications.types) as {
  [key in keyof Types]: string;
};
const NoticeTemplatesConstant = jsonToObject(Notifications.templates) as {
  [key in keyof Templates]: string;
};
const ApiTipConstant = jsonToObject(ApiTipConfig.api.tips) as {
  [key in keyof Tips]: string;
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
