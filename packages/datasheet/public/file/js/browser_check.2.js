/**
 * 浏览器兼容性方案
 * 参考：https://stackoverflow.com/questions/49686741/detect-unsupported-browser-version-and-show-specific-div-with-message
 */

const isClient = typeof window === 'object';

/**
 * 检查是否是 IE 11
 */
(function() {
  if (isClient && (!!window['ActiveXObject'] || 'ActiveXObject' in window)) {
    window.location.pathname = '/not_support';
  }
})();

const SPECIAL_UA = ['lark', 'wolai'];

function isTouchDevice() {
  return (
    !!(typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        (window.DocumentTouch &&
          typeof document !== 'undefined' &&
          document instanceof window.DocumentTouch))) ||
    !!(typeof navigator !== 'undefined' &&
      (navigator.maxTouchPoints || navigator['msMaxTouchPoints']))
  );
}

function versionCheck() {
  if (!isClient) return;

  if (isTouchDevice()) {
    return;
  }
  navigator['sayswho'] = (function() {
    let ua = navigator.userAgent, tem,
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
    // 触屏设备不检查浏览器类型了，不然手机上很多浏览器都用不了
    if (window['REACT_APP_DEPLOYMENT_MODELS']) {
      window.location.pathname = '/404';
    }
    window.location.pathname = '/not_support';
  }
}

versionCheck();
