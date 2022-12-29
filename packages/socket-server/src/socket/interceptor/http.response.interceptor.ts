import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonStatusMsg } from 'socket/common/constants';

/**
 * HTTP Response Interceptor
 * Interception of a successful response, wrapping the response data and returning a uniform structure
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
