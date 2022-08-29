import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { logger } from '../common/helper';
import * as Sentry from '@sentry/node';

@Catch(RuntimeException)
export class RuntimeExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): any {
    logger('RuntimeExceptionFilter').error(exception);

    // 上报 sentry
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
  catch(exception: any): any {
    logger('RangeErrorFilter').error(exception);
  }
}
