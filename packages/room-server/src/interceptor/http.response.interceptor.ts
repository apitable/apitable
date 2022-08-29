import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigConstant } from '@vikadata/core';
import { FastifyReply } from 'fastify';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * HTTP 响应拦截器
 * 成功响应的拦截，异常响应请移步 @code{GlobalExceptionFilter}
 * 包装响应数据，返回统一结构
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 避免 queue worker 模式工作时处理消息报错
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
