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

import { CacheInterceptor, Injectable } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common/interfaces';
import { API_CACHE_KEY, AUTHORIZATION_PREFIX, DEFAULT_X_MAX_AGE, X_MAX_AGE } from '../common';
import sha1 from 'sha1';
import { isApiCacheEnabled } from 'app.environment';

/**
 * Fusion API cache intercept, middleware -> hooks -> interceptor
 */
@Injectable()
export class ApiCacheInterceptor extends CacheInterceptor {
  override isRequestCacheable(context: ExecutionContext): boolean {
    // whether or not enable API cache
    if (!isApiCacheEnabled) {
      return false;
    }
    // judge if the request could be cached by method, only support Get method
    if (super.isRequestCacheable(context)) {
      const request = context.switchToHttp().getRequest();
      const maxAge = parseInt(request.headers[X_MAX_AGE], 10) || 0;
      if (maxAge > 0) {
        return true;
      }
    }
    return false;
  }

  override trackBy(context: ExecutionContext): string | undefined {
    const key = super.trackBy(context);
    if (key) {
      const request = context.switchToHttp().getRequest();
      if (request.headers.authorization) {
        const token = request.headers.authorization.substr(AUTHORIZATION_PREFIX.length);
        return API_CACHE_KEY + sha1(token) + ':' + key;
      }
    }
    return key;
  }
}

export const apiCacheTTLFactory = (ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const maxAge = parseInt(request.headers[X_MAX_AGE], 10) || 0;
  if (maxAge > DEFAULT_X_MAX_AGE) {
    return DEFAULT_X_MAX_AGE;
  }
  return maxAge;
};

