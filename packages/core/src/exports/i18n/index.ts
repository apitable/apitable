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

/*
 * read strings.auto.json,  go translation
 */
import { I18N } from '@apitable/i18n';
import type { StringKeysMapType, StringKeysType } from 'config/stringkeys.interface';

export * from 'config/stringkeys.interface';

// String.key will return key, for compatibility
export const Strings = new Proxy({}, {
  get: function(_target, key) {
    return key;
  },
}) as (StringKeysMapType) as any;

/**
 * read Settings in config
 */
declare const window: any;
declare const global: any;

const _global = global || window;

export function getLanguage() {
  let clientLang = null;
  if(_global.document){
    // @ts-ignore
    clientLang = localStorage.getItem('client-lang')
  }
  const language = typeof _global == 'object' && _global.__initialization_data__ && _global.__initialization_data__.locale;
  const defaultLang = (typeof _global == 'object' && _global.__initialization_data__?.envVars?.SYSTEM_CONFIGURATION_DEFAULT_LANGUAGE) || 'zh-CN';
  return clientLang || language || defaultLang;
}

const rewriteI18nForEdition = () => {
  for (const k in _global.apitable_i18n) {
    if (_global.apitable_i18n_edition?.[k]) {
      _global.apitable_i18n[k] = {
        ..._global.apitable_i18n[k],
        ..._global.apitable_i18n_edition[k]
      };
    }
  }
};

const currentLang = getLanguage();

_global.currentLang = currentLang;
if (undefined === _global.apitable_i18n) {
  _global.apitable_i18n = {};
}
if (undefined === _global.apitable_i18n[currentLang]) {
  _global.apitable_i18n[currentLang] = {};
}
require('@apitable/i18n-lang');
rewriteI18nForEdition();
const i18n = I18N.createByLanguagePacks(_global.apitable_i18n, currentLang);

export function t(stringKey: StringKeysType, options: any = null, isPlural = false): string {
  return i18n.getText(stringKey, options, isPlural);
}
