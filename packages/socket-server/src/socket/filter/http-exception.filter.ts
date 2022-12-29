import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToWs().getClient();

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
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

    const res: any = exception.getResponse();
    response.emit(exception.message, {
      ...res,
      code: exception.getStatus(),
    });
  }
}
