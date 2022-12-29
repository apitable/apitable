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
