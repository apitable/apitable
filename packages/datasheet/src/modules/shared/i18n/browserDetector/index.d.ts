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

// import * as i18next from "i18next";

interface IDetectorOptions {
  /**
   * order and from where user language should be detected
   */
  // order?: Array<
  //   "querystring" | "cookie" | "localStorage" | "navigator" | "htmlTag" | string
  // >;
  order?: ('querystring' | 'cookie' | 'localStorage' | 'navigator' | 'htmlTag' | string)[];
  /**
   * keys or params to lookup language from
   */
  lookupQuerystring?: string;
  lookupCookie?: string;
  lookupLocalStorage?: string;

  /**
   * cache user language on
   */
  caches?: string[];

  /**
   * languages to not persist (cookie, localStorage)
   */
  excludeCacheFor?: string[];

  /**
   * optional expire and domain for set cookie
   * @default 10
   */
  cookieMinutes?: number;
  cookieDomain?: string;

  /**
   * optional htmlTag with lang attribute
   * @default document.documentElement
   */
  htmlTag?: HTMLElement | null;
}

interface ICustomDetector {
  name: string;
  cacheUserLanguage?(lng: string, options: IDetectorOptions): void;
  lookup(options: IDetectorOptions): string | undefined;
}

export default class I18nextBrowserLanguageDetector {
  //   implements i18next.LanguageDetectorModule {
  constructor(services?: any, options?: IDetectorOptions);
  /**
   * Adds detector.
   */
  addDetector(detector: ICustomDetector): I18nextBrowserLanguageDetector;

  /**
   * Initializes detector.
   */
  init(services?: any, options?: IDetectorOptions): void;

  detect(detectionOrder?: IDetectorOptions['order']): string | undefined;

  cacheUserLanguage(lng: string, caches?: string[]): void;

  type: 'languageDetector';
  detectors: { [key: string]: any };
  services: any;
  i18nOptions: any;
}
