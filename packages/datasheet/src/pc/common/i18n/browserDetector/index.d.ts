// import * as i18next from "i18next";

interface IDetectorOptions {
  /**
   * order and from where user language should be detected
   */
  // order?: Array<
  //   "querystring" | "cookie" | "localStorage" | "navigator" | "htmlTag" | string
  // >;
  order?: ('querystring' | 'cookie' | 'localStorage' | 'navigator' | 'htmlTag' | string) [];
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
