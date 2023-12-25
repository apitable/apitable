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
import LANGUAGE_DATA from '@apitable/i18n-lang/src/config/strings.json';
import type { StringKeysMapType, StringKeysType } from '../../config/stringkeys.interface';

export { StringKeysMapType, StringKeysType };

// @ts-ignore nextjs
const isBrowser = process.browser || typeof window !== 'undefined';

export const Strings = new Proxy({} as Record<keyof StringKeysMapType, string>, {
  get: function (_target, key: string) {
    return key;
  },
}) as StringKeysType;

/**
 * read Settings in config
 */
declare const window: any;
declare const global: any;

const _global = global || window;
const getBrowserLanguage = (): string | undefined => {
  if (_global.browserLang){
    return _global.browserLang;
  }
  // @ts-ignore
  const languageMap = _global.languageManifest;

  if (!_global.navigator || !languageMap) {
    return undefined;
  }
  let userLanguage: string | undefined = _global.navigator.language as string;
  if (userLanguage){
    userLanguage = userLanguage.replace(/-(.+)/g, (match, group1) => {
      return '-' + group1.toUpperCase();
    });
  }
  if (userLanguage == 'zh-TW') {
    userLanguage = 'zh-HK';
  }
  if (!languageMap[userLanguage]) {
    userLanguage = undefined;
    const langArr = Object.keys(languageMap);
    if (langArr) {
      for (let i = 0; i < langArr.length; i++) {
        // @ts-ignore
        if (langArr[i] !== undefined && langArr[i].indexOf(userLanguage) > -1) {
          userLanguage = langArr[i];
          break;
        }
      }
    }
  }
  _global.browserLang = userLanguage;
  return userLanguage;
};

export function getLanguage() {
  let clientLang = null;
  if (isBrowser) {
    try {
      // @ts-ignore
      clientLang = localStorage.getItem('client-lang');
    } catch (e) {}
  }
  const browserLang = getBrowserLanguage();
  // console.log('browser language is', browserLang);
  const language = typeof _global == 'object' && _global.__initialization_data__ &&
    _global.__initialization_data__.locale != 'und' && _global.__initialization_data__.locale;
  const defaultLang = (typeof _global == 'object' && _global.__initialization_data__?.envVars?.SYSTEM_CONFIGURATION_DEFAULT_LANGUAGE) || 'zh-CN';
  return clientLang || browserLang || language || defaultLang;
}

const fetchLanguagePack = (lang: string, data: any) => {
  // @ts-ignore
  const xhr = new XMLHttpRequest();
  const version = window.__initialization_data__.version;
  if (lang) {
    xhr.open('GET', `/file/langs/strings.${lang}.json?version=${version}`, false);
  } else {
    xhr.open('GET', '/file/langs/strings.json?version=${version}', false);
  }
  xhr.send();
  if (xhr.readyState === 4 && xhr.status === 200) {
    const languageData = JSON.parse(xhr.responseText);
    if (lang) {
      data[lang] = languageData;
    } else {
      Object.keys(languageData).forEach((key) => {
        data[key] = languageData[key];
      });
    }
  } else {
    console.error('load language from remote error', xhr.statusText);
  }
};

const loadClientLanguage = (lang: string) => {
  const data = {};
  fetchLanguagePack(lang, data);
  return data;
};

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

// browser only
if (isBrowser) {
  require('@apitable/i18n-lang');

  if (_global.apitable_language_list && Object.keys(_global.apitable_language_list).length > 0) {
    _global.languageManifest = _global.apitable_language_list;
  }
}

const currentLang = getLanguage().replace('_', '-');
_global.currentLang = currentLang;
_global.apitable_i18n = isBrowser ? loadClientLanguage(currentLang) : LANGUAGE_DATA;

rewriteI18nForEdition();
const i18n = I18N.createByLanguagePacks(_global.apitable_i18n, currentLang);

export function t(stringKey: keyof StringKeysMapType | unknown, options: any = null, isPlural = false): string {
  const text = i18n.getText(stringKey as string, options, isPlural);
  return text;
}

