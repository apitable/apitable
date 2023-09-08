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

/* eslint-disable */
import * as utils from './utils.js';
import cookie from './browserLookups/cookie.js';
import querystring from './browserLookups/querystring.js';
import localStorage from './browserLookups/localStorage.js';
import navigator from './browserLookups/navigator.js';
import htmlTag from './browserLookups/htmlTag.js';
import path from './browserLookups/path.js';
import subdomain from './browserLookups/subdomain.js';
import LanguageUtils from './languageUtils';

const languageUtils = new LanguageUtils({
  // whiteList: true,
  currentOnly: true,
  cleanCode: true,
  // lowerCaseLng: true,
});

function getDefaults() {
  return {
    order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
    lookupQuerystring: 'lang',
    lookupCookie: 'vika-i18n',
    lookupLocalStorage: 'vika-i18n',

    // cache user language
    caches: ['localStorage'],
    excludeCacheFor: ['cimode'],
    //cookieMinutes: 10,
    //cookieDomain: 'myDomain'
    checkWhitelist: true,
  };
}

class Browser {
  constructor(services, options = {}) {
    this.type = 'languageDetector';
    this.detectors = {};

    this.init(services, options);
  }

  init(services, options = {}, i18nOptions = {}) {
    this.services = services;
    this.options = utils.defaults(options, this.options || {}, getDefaults());

    // backwards compatibility
    if (this.options.lookupFromUrlIndex) {
      this.options.lookupFromPathIndex = this.options.lookupFromUrlIndex;
    }

    this.i18nOptions = i18nOptions;

    this.addDetector(cookie);
    this.addDetector(querystring);
    this.addDetector(localStorage);
    this.addDetector(navigator);
    this.addDetector(htmlTag);
    this.addDetector(path);
    this.addDetector(subdomain);
  }

  addDetector(detector) {
    this.detectors[detector.name] = detector;
  }

  detect(detectionOrder) {
    if (!detectionOrder) {
      detectionOrder = this.options.order;
    }

    let detected = [];
    detectionOrder.forEach((detectorName) => {
      if (this.detectors[detectorName]) {
        let lookup = this.detectors[detectorName].lookup(this.options);
        if (lookup && typeof lookup === 'string') {
          lookup = [lookup];
        }
        if (lookup) {
          detected = detected.concat(lookup);
        }
      }
    });

    let found;
    detected.forEach((lng) => {
      if (found) {
        return;
      }
      let cleanedLng = languageUtils.formatLanguageCode(lng);
      if (!this.options.checkWhitelist || languageUtils.isWhitelisted(cleanedLng)) {
        found = cleanedLng;
      }
    });

    if (!found) {
      let fallbacks = this.i18nOptions.fallbackLng;
      if (typeof fallbacks === 'string') {
        fallbacks = [fallbacks];
      }
      if (!fallbacks) {
        fallbacks = [];
      }

      if (Object.prototype.toString.apply(fallbacks) === '[object Array]') {
        found = fallbacks[0];
      } else {
        found = fallbacks[0] || (fallbacks.default && fallbacks.default[0]);
      }
    }

    return found;
  }

  cacheUserLanguage(lng, caches) {
    if (!caches) {
      caches = this.options.caches;
    }
    if (!caches) {
      return;
    }
    if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) {
      return;
    }
    caches.forEach((cacheName) => {
      if (this.detectors[cacheName]) {
        this.detectors[cacheName].cacheUserLanguage(lng, this.options);
      }
    });
  }
}

Browser.type = 'languageDetector';

export default Browser;
