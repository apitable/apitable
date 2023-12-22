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

import { RewriteFrames } from '@sentry/integrations';
import * as Sentry from '@sentry/nextjs';
import { Integrations } from '@sentry/tracing';
import { getEnvVariables, getInitializationData, getReleaseVersion } from 'pc/utils/env';

Sentry.init({
  enabled: true,
  dsn: getEnvVariables().SENTRY_DSN,
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