import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ApiTipConfig, ApiTipConstant, Strings, t, ConfigConstant } from '@apitable/core';
import { USER_HTTP_DECORATE } from '../common';
import { ApiException } from '../exception';
import { ServerException } from '../exception/server.exception';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { IExceptionOption, IHttpErrorResponse } from 'shared/interfaces/http.interfaces';
import { I18nService } from 'nestjs-i18n';

/**
 * Global exception filter
 * would filter custom exception
 * catch exceptions, not only http exceptions
 * @description format all errors and exceptions data
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService, private readonly i18n: I18nService) {
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    this.logger.error('request error', exception);

    // filter custom exception
    if (!(exception instanceof ServerException) && !(exception instanceof ApiException)) {
      const headers = request.headers;
      if (headers) {
        request.headers.authorization = undefined;
        request.headers.cookie = undefined;
      }
      
      Sentry.captureException(exception, {
        extra: {
          ip: request.ip,
          headers: request.headers,
          url: request.url,
          params: request.params,
          query: request.query,
          body: request.body,
          replyHeaders: response.getHeaders(),
          msg: exception?.message,
          method: request.method,
          stack: exception?.stack
        },
      });
    }

    // http status code, return custom exception code or 500
    let httpStatusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let statusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let errMsg: string = exception?.message || ConfigConstant.DefaultStatusMessage.SERVER_ERROR_MSG;
    // throw custom exception
    if (exception instanceof ServerException) {
      statusCode = exception.getCode();
      errMsg = exception.getMessage();
      httpStatusCode = exception.getStatusCode();
    }

    if (exception instanceof HttpException) {
      httpStatusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      if (httpStatusCode === HttpStatus.NOT_FOUND) {
        // 404 means API not found
        errMsg = t(Strings[ApiTipConfig.api.tips[ApiTipConstant.api_not_exists].id]);
      } else {
        const errorOption: IExceptionOption = exception.getResponse() as IExceptionOption;
        errMsg = typeof errorOption === 'string' ? errorOption : errorOption.message;
      }
    }
    // handle API exceptions with internationalization
    if (exception instanceof ApiException) {
      httpStatusCode = exception.getTip().statusCode;
      statusCode = exception.getTip().code;
      errMsg = await this.i18n.translate(exception.getTip().message, {
        lang: request[USER_HTTP_DECORATE]?.locale,
        args: exception.getExtra(),
      });
    }

    // standard error response
    const errorResponse: IHttpErrorResponse = {
      success: false,
      code: statusCode,
      message: errMsg,
    };
    this.logger.error('request error', exception?.stack || errMsg, exception?.message);
    // set header, status code and error response data
    if (response instanceof ServerResponse) {
      response.setHeader('Content-Type', 'application/json');
      response.statusCode = httpStatusCode;
      response.write(JSON.stringify(errorResponse));
      response.end();
    } else {
      response.status(httpStatusCode).send(errorResponse);
    }
  }
}
