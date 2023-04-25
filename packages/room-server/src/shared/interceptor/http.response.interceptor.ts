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

import { ConfigConstant } from '@apitable/core';
import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * HTTP Response Intercept
 * success response only, error response @code{GlobalExceptionFilter}
 * response standard format data
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // avoid to handle error mes in queue worker mode
    if (isRabbitContext(context)) {
      return next.handle();
    }
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    /*
     * FIXME: The problem comes from a low version of @Nestjs-OpenTelemetry integration and wants to upgrade the dependency to solve it,
     *  at which point it is necessary to upgrade Nestjs, which will take a little time to verify...
     */
    request.route = Object.assign(request.route || {}, {
      path: request.raw.url,
    });
    response.__proto__.once = response.raw.once;
    response.__proto__.removeListener = response.raw.removeListener;
    // @ts-ignore
    response.__proto__.on = function(method, callback) {
      callback();
    };

    return next.handle().pipe(
      map((data: any) => {
        response.header('Cache-Control', 'no-cache,no-store,must-revalidate');
        if (data?.response instanceof Buffer) {
          response.header('Content-Type', 'application/json');
          return data!.response;
        }
        if (data?.code) {
          return data;
        }
        return {
          success: true,
          code: HttpStatus.OK,
          message: ConfigConstant.DefaultStatusMessage.OK_MSG,
          data,
        };
      }),
    );
  }
}
