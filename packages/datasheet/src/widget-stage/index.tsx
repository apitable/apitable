import * as components from '@apitable/components';
import * as core from '@apitable/core';
import * as icons from '@apitable/icons';
import * as widgetSdk from '@apitable/widget-sdk';
import 'focus-options-polyfill';
import 'get-root-node-polyfill/implement';
import 'normalize.css';
import { getEnvVariables } from 'pc/utils/env';
import React from 'react';
import ReactDOM from 'react-dom';
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
    window[`_@${prefix}/components`] = components;
    window[`_@${prefix}/widget-sdk`] = widgetSdk;
    window[`_@${prefix}/core`] = core;
    window[`_@${prefix}/icons`] = icons;
  }
})();

initTheme();

const WidgetStage = () => {
  return <ThemeWrap>
    <Main />
  </ThemeWrap>;
};

export default WidgetStage;
