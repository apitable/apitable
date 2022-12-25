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

import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as Sentry from '@sentry/node';

@Catch(RuntimeException)
export class RuntimeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RuntimeExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error('Runtime Error', exception?.stack);

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    Sentry.captureException(exception, {
      extra: {
        ip: request.ip,
        headers: request.headers,
        url: request.url,
        params: request.params,
        query: request.query,
        body: request.body,
        replyHeaders: response.getHeaders(),
      },
    });
  }
}

@Catch(RangeError)
export class RangeErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(RangeErrorFilter.name);

  catch(exception: any): any {
    this.logger.error('Range Error', exception?.stack);
  }
}
