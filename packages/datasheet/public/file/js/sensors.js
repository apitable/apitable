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

(function (para) {
  if (process.env.SSR) {
    return false
  }
  let p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
  if (typeof (w['sensorsDataAnalytic201505']) !== 'undefined') {
    return false;
  }
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); }; };
  const ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus'];
  for (let i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    x.setAttribute('charset', 'UTF-8');
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  sdk_url: '//s1.vika.cn/common/js/sensors/sensorsdata-1.19.2.min.js',
  app_js_bridge: true,
  heatmap_url: '//s1.vika.cn/common/js/sensors/heatmap.min.js',
  name: 'sensors',
  is_track_single_page: true,
  server_url: `https://vika.datasink.sensorsdata.cn/sa?token=${process.env.SENSORSDATA_TOKEN}` + (!process.env.SSR && window.location.host.slice(-'vika.cn'.length) === 'vika.cn' ? '&project=production' : ''),
  heatmap: {
    clickmap: 'default',
    scroll_notice_map: 'not_collect',
    collect_tags: {
      div: {
        max_level: 3,
      },
      li: true,
      img: true,
      svg: true,
      section: true,
    },
  },
  show_log: false,
});
typeof sensors !== "undefined" && sensors.registerPage({
  platform_type: 'web_app',
  user_agent: navigator.userAgent,
  app_version: function () {
    return window.__vika_init__ && window.__vika_init__.version;
  },
  is_login: function () {
    return Boolean(window.__vika_init__ && window.__vika_init__.userInfo);
  },
  userSpaceId: function () {
    return window.__vika_init__ && window.__vika_init__.userInfo && window.__vika_init__.userInfo.spaceId;
  }
});
typeof sensors !== "undefined" && sensors.quick('autoTrack');

export const _sensors = 1
