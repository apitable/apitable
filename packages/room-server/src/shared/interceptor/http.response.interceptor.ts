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

import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigConstant } from '@apitable/core';
import { FastifyReply } from 'fastify';
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

    return next.handle().pipe(
      map((data: any) => {
        const response = context.switchToHttp().getResponse<FastifyReply>();
        response.header('Cache-Control', 'no-cache,no-store,must-revalidate');
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
