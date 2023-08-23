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

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToWs().getClient();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    Sentry.captureException(exception, {
      extra: {
        ip: request.ip,
        headers: request.headers,
        url: request.url,
        params: request.params,
        query: request.query,
        body: request.body,
        replyHeaders: response.headers,
      },
    });

    const res: any = exception.getResponse();
    response.emit(exception.message, {
      ...res,
      code: exception.getStatus(),
    });
  }
}
