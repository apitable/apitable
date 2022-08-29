import strings from './config/strings.json';

declare const window: any;

function loadAllLang() {
  if (typeof window !== 'undefined') {
    (window as any).vika_i18n = strings;
  } else {
    (global as any).vika_i18n = strings;
  }
}

loadAllLang();

