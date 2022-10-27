import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import * as Sentry from '@sentry/node';

@Catch(RuntimeException)
export class RuntimeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RuntimeExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): any {
    this.logger.error('Runtime Error', exception?.stack);

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
  private readonly logger = new Logger(RangeErrorFilter.name);

  catch(exception: any): any {
    this.logger.error('Range Error', exception?.stack);
  }
}
