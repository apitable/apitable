/*
 * read strings.auto.json,  go translation
 */
import { I18N } from '@apitable/i18n';
import { StringKeysMapType, StringKeysType } from '../../config/stringkeys.interface';
export * from '../../config/stringkeys.interface';

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

require('@apitable/i18n-lang');

const rewriteI18nForEdition = () => {
  for (const k in _global.vika_i18n) {
    if (_global.vika_i18n_edition?.[k]) {
      _global.vika_i18n[k] = {
        ..._global.vika_i18n[k],
        ..._global.vika_i18n_edition[k]
      };
    }
  }
};

rewriteI18nForEdition();

// global singleton of I18N
const i18n = I18N.createByLanguagePacks(_global.vika_i18n, getLanguage());

export function t(stringKey: StringKeysType, options: any = null, isPlural = false): string {
  return i18n.getText(stringKey, options, isPlural);
}
