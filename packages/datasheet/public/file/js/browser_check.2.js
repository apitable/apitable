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

/**
 * Browser Compatibility Program
 * Reference: https://stackoverflow.com/questions/49686741/detect-unsupported-browser-version-and-show-specific-div-with-message
 */

const isClient = typeof window === 'object';

/**
 * Check if it is IE 11
 */
(function () {
  if (isClient && (!!window['ActiveXObject'] || 'ActiveXObject' in window)) {
    window.location.pathname = '/not_support';
  }
})();

const SPECIAL_UA = ['lark', 'wolai'];

function isTouchDevice() {
  return (
    !!(
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || (window.DocumentTouch && typeof document !== 'undefined' && document instanceof window.DocumentTouch))
    ) || !!(typeof navigator !== 'undefined' && (navigator.maxTouchPoints || navigator['msMaxTouchPoints']))
  );
}

function versionCheck() {
  if (!isClient) return;

  if (isTouchDevice()) {
    return;
  }
  navigator['sayswho'] = (function () {
    let ua = navigator.userAgent,
      tem,
      M = ua.match(/(opera|chrome|safari|edge|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    for (let i = 0; i < SPECIAL_UA.length; i++) {
      if (typeof ua.includes === 'function' && ua.includes(SPECIAL_UA[i])) {
        return [].join(' ');
      }
    }
    console.log(ua);
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
  })();
  //document.getElementById('printVer').innerHTML=navigator.sayswho
  const str = navigator['sayswho'];
  const browser = str.substring(0, str.indexOf(' '));
  let version = str.substring(str.indexOf(' '));
  version = version.trim();
  version = parseInt(version);
  console.log(browser);
  console.log(version);

  if (
    (browser == 'Chrome' && version < 61) ||
    (browser == 'Firefox' && version < 57) ||
    (browser == 'Safari' && version < 12) ||
    (browser == 'IE' && version < 12) ||
    (browser == 'Opera' && version < 52) ||
    (browser == 'edge' && version < 70)
  ) {
    // Touch devices do not check browser type
    if (window['REACT_APP_DEPLOYMENT_MODELS']) {
      window.location.pathname = '/404';
    }
    window.location.pathname = '/not_support';
  }
}

versionCheck();
