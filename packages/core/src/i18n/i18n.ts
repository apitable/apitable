/*
 * read strings.auto.json,  go translation
 */
import { template } from 'lodash';
import { plural } from './plural';
import { StringKeysMapType, StringKeysType } from './stringkeys.interface';

export const ERROR_STR = '[ERROR STR]';

// String.key will return key, for compatibility 
export const Strings = new Proxy({}, {
  get: function(_target, key) {
    return key;
  },
}) as StringKeysMapType;

/**
 * read Settings in config
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
 * multi-language get, pass key as arguments
 * @param stringKey map the stringkeys.auto.json file
 * @param options JavaScript Object,  support string format, support lodash _.template
 * @example t(Strings.early_bird) | t('early_bird')
 */
export function getText(stringKey: StringKeysType, options: any = null, isPlural = false): string {
  if (!stringKey) {
    console.error('stringKey can not be empty');
    return ERROR_STR;
  }
  const langPkg = getLangPkg();
  if (!langPkg) {
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
