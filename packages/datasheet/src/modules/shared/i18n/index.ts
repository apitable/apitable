import LanguageDetector from './browserDetector';
import { getSupportedLang } from './getSupportedLang';

// Initialising multilingual judgements
const languageDetector = new LanguageDetector();
languageDetector.init();

/**
 * Get the current language status
 *
 */
export function initLanguage() {
  !window.__initialization_data__ && ((window as any).__initialization_data__ = {});
  const locale = window.__initialization_data__.locale;
  if (locale) { // The language is already set on the server side
    window.__initialization_data__.lang = window.__initialization_data__.locale = getSupportedLang(locale);
    return;
  }
  // Default language
  const defaultLang = window.__initialization_data__.locale;

  const lang = defaultLang || languageDetector.detect();

  if (lang !== undefined) {
    // Set the language of the system i18n config
    window.__initialization_data__.lang = getSupportedLang(lang.replace(/_/g, '-'));
  }
}
