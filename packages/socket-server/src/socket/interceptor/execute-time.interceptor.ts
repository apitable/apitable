import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { logger } from '../common/helper';
import { GatewayConstants } from '../constants/gateway.constants';

@Injectable()
export class ExecuteTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(
      tap(data => {
        const executeTime = Date.now() - now;
        if (executeTime > GatewayConstants.ACK_TIMEOUT) {
          const message =
            data.data && data.data.changesets
              ? data.data.changesets.map(item => {
                  return { messageId: item?.messageId, dstId: item?.resourceId };
                })
              : [];
          logger('ExecuteTime').log({ time: `${executeTime}ms`, message: JSON.stringify(message) });
        }
      }),
    );
  }
}
