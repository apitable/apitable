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

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GatewayConstants } from 'shared/common/constants/socket.module.constants';

@Injectable()
export class ExecuteTimeInterceptor implements NestInterceptor {
  private readonly logger = new Logger(ExecuteTimeInterceptor.name);

  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(
      tap(data => {
        const executeTime = Date.now() - now;
        if (executeTime > GatewayConstants.ACK_TIMEOUT) {
          const message = data.data && data.data.changesets ?
            data.data.changesets.map((item: any) => {
              return { messageId: item?.messageId, dstId: item?.resourceId };
            }) : [];
          this.logger.log({ time: `${executeTime}ms`, message: JSON.stringify(message) });
        }
      }),
    );
  }
}
