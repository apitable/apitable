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

import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line no-restricted-imports
import * as components from '@apitable/components';
import * as core from '@apitable/core';
import * as icons from '@apitable/icons';
import * as widgetSdk from '@apitable/widget-sdk';
import 'focus-options-polyfill';
import 'get-root-node-polyfill/implement';
import 'normalize.css';
import { getEnvVariables } from 'pc/utils/env';
import 'regenerator-runtime/runtime';
import 'resize-observer-polyfill/dist/ResizeObserver.global';
import { Main } from './main/main';
import { initTheme } from './theme';
import { ThemeWrap } from './theme_wrap';

(() => {
  if (!process.env.SSR) {
    const prefix = getEnvVariables().WIDGET_REPO_PREFIX;
    window['_React'] = React;
    window['_ReactDom'] = ReactDOM;
    window['_@apitable/components'] = components;
    window['_@apitable/widget-sdk'] = widgetSdk;
    window['_@apitable/core'] = core;
    window['_@apitable/icons'] = icons;
    if (prefix !== 'apitable') {
      window[`_@${prefix}/components`] = components;
      window[`_@${prefix}/widget-sdk`] = widgetSdk;
      window[`_@${prefix}/core`] = core;
      window[`_@${prefix}/icons`] = icons;
    }
  }
})();

initTheme();

const WidgetStage = () => {
  return (
    <ThemeWrap>
      <Main />
    </ThemeWrap>
  );
};

export default WidgetStage;
