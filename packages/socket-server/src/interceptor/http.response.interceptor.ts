import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonStatusMsg } from 'src/common/constants';

/**
 * HTTP 响应拦截器
 * 成功响应的拦截，包装响应数据，返回统一结构
 */
@Injectable()
export class HttpResponseInterceptor implements NestInterceptor {
  intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        if (data?.code) {
          return data;
        }
        return {
          success: true,
          code: HttpStatus.OK,
          message: CommonStatusMsg.DEFAULT_SUCCESS_MESSAGE,
          data,
        };
      }),
    );
  }
}
