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
  if (locale) {
    // The language is already set on the server side
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
