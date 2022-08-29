import Bowser from 'bowser';

let _browser;

(() => {
  if (!process.env.SSR) {
    _browser = Bowser.getParser(window.navigator.userAgent);
    (window as any).bowser = _browser;
  }
})();
export const browser = _browser;

