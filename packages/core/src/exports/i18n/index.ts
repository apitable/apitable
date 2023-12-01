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
import type { StringKeysMapType, StringKeysType } from '../../config/stringkeys.interface';

export * from '../../config/stringkeys.interface';

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

export function getLanguage() {
  let clientLang = null;
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore
      clientLang = localStorage.getItem('client-lang');
    } catch (e) {}
  }
  const language = typeof _global == 'object' && _global.__initialization_data__ &&
    _global.__initialization_data__.locale != 'und' && _global.__initialization_data__.locale;
  const defaultLang = (typeof _global == 'object' && _global.__initialization_data__?.envVars?.SYSTEM_CONFIGURATION_DEFAULT_LANGUAGE) || 'zh-CN';
  return clientLang || language || defaultLang;
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

// get English language pack asynchronously
const fetchLanguagePackAsync = (lang: string, data: any) => {
  const version = window.__initialization_data__.version;
  // @ts-ignore
  fetch(`/file/langs/strings.${lang}.json?version=${version}`)
    .then((response: any) => {
      if (!response.ok) {
        throw new Error('get lang pack error: ' + response.status);
      }
      return response.json(); // 解析响应为JSON格式
    })
    .then((langPack: any) => {
      data[lang] = langPack;
      if (_global.apitable_i18n){
        _global.apitable_i18n[lang] = langPack;
      }
    });
};

const loadLanguage = (lang: string) => {
  // console.log('start load language', lang);
  let data = {};
  if (typeof window !== 'undefined') {
    fetchLanguagePack(lang, data);
    if (lang != 'en-US') {
      fetchLanguagePackAsync('en-US', data);
    }
  } else {
    try {
      // load language for room-server. suitable for docker environment
      const fs = require('fs');
      const jsonData = fs.readFileSync(`${__dirname}/../../../../i18n-lang/src/config/strings.json`);
      data = JSON.parse(jsonData);
    } catch (_e) {
      // load language for frontend
      try {
        const path = require('path');
        const fs = require('fs');
        const pagesDirectory = path.resolve(process.cwd(), '../i18n-lang/src/config/strings.json');
        const jsonData = fs.readFileSync(pagesDirectory);
        data = JSON.parse(jsonData);
      } catch (error) {
        console.error('load strings.json error', error);
      }
    }
  }
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

  if (_global.apitable_language_list && Object.keys(_global.apitable_language_list).length > 0) {
    _global.languageManifest = _global.apitable_language_list;
  }
};

const currentLang = getLanguage().replace('_', '-');
_global.currentLang = currentLang;
_global.apitable_i18n = loadLanguage(currentLang);
// browser only
if (typeof window !== 'undefined') {
  require('@apitable/i18n-lang');
}
rewriteI18nForEdition();
const i18n = I18N.createByLanguagePacks(_global.apitable_i18n, currentLang);
let engI18n: I18N | null = null;
if (currentLang != 'en-US') {
  engI18n = I18N.createByLanguagePacks(_global.apitable_i18n, 'en-US');
}
export function t(stringKey: keyof StringKeysMapType | unknown, options: any = null, isPlural = false): string {
  const text = i18n.getText(stringKey as string, options, isPlural);
  if (currentLang != 'en-US' && !text && engI18n != null && _global.apitable_i18n['en-US']) {
    return engI18n.getText(stringKey as string, options, isPlural);
  }
  return text;
}