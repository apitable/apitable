/*
 * 针对 strings.auto.json,  等配置文件的快速配置提取相关的函数
 */
import { template } from 'lodash';
import { plural } from './plural';
import { StringKeysMapType, StringKeysType } from './stringkeys.interface';

export const ERROR_STR = '[ERROR STR]';
// String.key 会返回 key，这里是为了兼容以前的写法
export const Strings = new Proxy({}, {
  get: function(target, key) {
    return key;
  },
}) as StringKeysMapType;

/**
 * 读取配置Settings中的语言
 */
declare const window: any;
declare const global: any;

const _global = global || window;

export function getLanguage() {
  const language = typeof _global == 'object' && _global.__initialization_data__ && _global.__initialization_data__.locale;
  return language || 'zh-CN';
}

const getLangPkg = () => {
  return _global.vika_i18n[getLanguage()];
};

require('@vikadata/i18n-lang');

/**
 * 多语言获取，传入 key
 * @param stringKey 对应stringkeys.auto.json文件的 key
 * @param options JavaScript Object,  支持字符串格式化（string format），支持lodash _.template
 * @example t(Strings.early_bird) 或 t('early_bird')
 */
export function getText(stringKey: StringKeysType, options: any = null, isPlural = false): string {
  if (!stringKey) {
    console.error('stringKey 不能为空');
    return ERROR_STR;
  }
  const langPkg = getLangPkg();
  if (!langPkg) {
    // console.error('langPkg 不能为空');
    return ERROR_STR;
  }

  const text = langPkg[stringKey];
  if (!text) {
    console.error(`Cannot find string key: ${stringKey}`);
    return stringKey;
  }

  const str = options ? template(text)(options) : text;
  if (isPlural) {
    return plural(str, false);
  }
  return str;
}

export const t = getText;
