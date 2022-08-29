import LanguageDetector from './browserDetector';
import { getSupportedLang } from './getSupportedLang';

// 初始化多语言判断
const languageDetector = new LanguageDetector();
languageDetector.init();

/**
 * 获取当前语言状态
 *
 */
export function initLanguage() {
  !window.__initialization_data__ && ((window as any).__initialization_data__ = {});
  const locale = window.__initialization_data__.locale;
  if (locale) { // 服务端已经设置好了语言
    window.__initialization_data__.lang = window.__initialization_data__.locale = getSupportedLang(locale);
    return;
  }
  // 默认语言
  const defaultLang = window.__initialization_data__.locale;

  const lang = defaultLang || languageDetector.detect();

  if (lang !== undefined) {
    // 设置系统i18n config的language
    window.__initialization_data__.lang = getSupportedLang(lang.replace(/_/g, '-'));
  }
}
