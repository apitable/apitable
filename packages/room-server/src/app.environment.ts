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

export const environment = process.env.NODE_ENV || 'development';
export const isDevMode = Object.is(environment, 'development');
export const isProdMode = Object.is(environment, 'production');
export const enableSwagger = Object.is(process.env.ENABLE_SWAGGER, 'true');
export const serviceDomain = process.env.SERVER_DOMAIN;
export const currentAppInstanceId = process.env.NODE_APP_INSTANCE || 0;
// whether or not enable cache for Fusion API
export const isApiCacheEnabled = Object.is(process.env.API_CACHEABLE, 'true');

// whether or not enable scheduler. (only for one instance, should use zookeeper if there are multiple instances)
export const enableScheduler = Object.is(process.env.ENABLE_SCHED, 'true');

// whether or not enable queue worker. (individual instances in worker queue mode to handle messages)
export const enableQueueWorker = Object.is(process.env.ENABLE_QUEUE_WORKER, 'true');

export const disableHSTS = Object.is(process.env.STRICT_TRANSPORT_SECURITY, 'false');

export default {
  isDevMode,
  isProdMode,
  serviceDomain,
  environment,
};

