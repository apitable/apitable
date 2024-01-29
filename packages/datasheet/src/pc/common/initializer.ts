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

/*
 * Initialization functions, used for some non-constructor type things that need to be initialized and executed at startup again
 */
import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import dayjs from 'dayjs';
import { getLanguage, injectStore, WasmApi } from '@apitable/core';
import { getBrowserDatabusApiEnabled } from '@apitable/core/dist/modules/database/api/wasm';
import { handleResponse, initAxios } from 'api/utils/init_axios';
import { getEnvVariables, getInitializationData, getReleaseVersion } from 'pc/utils/env';
import '../../modules/shared/apphook/hook_bindings';
import { APITable } from '../../modules/shared/apitable_lib';
import { initCronjobs } from './cronjob';
import './store_subscribe';

declare let window: any;
if (!process.env.SSR && window !== undefined) {
  window.APITable = APITable;
}

function initBugTracker() {
  const dsn = getEnvVariables().SENTRY_DSN;
  // Reporting is not enabled for local development and private deployments
  if (!dsn) {
    return;
  }

  Sentry.init({
    enabled: true,
    dsn,
    integrations: [
      new Integrations.BrowserTracing()!,
      new RewriteFrames()!,
      /**
       * @description Sentry's handling of requestAnimationFrame in Chrome 74 can be problematic and lead to unexpected errors
       * Currently rewriting the check for requestAnimationFrame based on the method provided in Sentry's issue
       * @issue https://github.com/getsentry/sentry-javascript/issues/3388
       * @type {boolean}
       */
      // new Sentry.Integrations.TryCatch({
      //   requestAnimationFrame: false,
      // })
    ],
    environment: getInitializationData().env,
    release: getReleaseVersion(),
    normalizeDepth: 5,
    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 0.1,
    maxBreadcrumbs: 10,
    /**  Every time a page is entered, a pageload or a route change is made, a record is automatically sent to the sentry,
     *   which doesn't make much sense at the moment, so turn it off and watch it later.
     */
    autoSessionTracking: false,
    ignoreErrors: [
      // It was found that all hovers where tooltip appears send a request to sentry and the exception status is this
      'ResizeObserver loop limit exceeded',
    ],
  });
}

function initDayjs(comlink: any) {
  let lang = getLanguage() || 'zh-cn';
  lang = lang.toLowerCase().replace('_', '-');
  dayjs.locale(lang);
  comlink.proxy?.initHook(lang);
}

export function initializer(comlink: any) {
  initAxios(comlink.store);

  if (getBrowserDatabusApiEnabled()) {
    WasmApi.initializeDatabusWasm().then((r) => {});
  } else {
    console.log('web assembly is not supported');
  }

  window.__global_handle_response = handleResponse;

  // Initialisation Field.bindModel
  injectStore(comlink.store);
  initCronjobs(comlink.store);
  initDayjs(comlink);

  initBugTracker();
}

