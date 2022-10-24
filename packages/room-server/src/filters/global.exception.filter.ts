import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, LoggerService } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ApiTipConfig, ApiTipConstant, Strings, t, ConfigConstant } from '@apitable/core';
import { USER_HTTP_DECORATE } from 'common';
import { ApiException } from 'exception';
import { ServerException } from 'exception/server.exception';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { IExceptionOption, IHttpErrorResponse } from 'interfaces/http.interfaces';
import { I18nService } from 'nestjs-i18n';

/**
 * 全局异常过滤器
 * 失败处理或者错误请求都会被过滤
 * 捕获各种异常，不局限于HttpException
 * @description 拦截全局抛出的所有异常，同时任何错误将在这里被规范化输出
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private logger: LoggerService, private readonly i18n: I18nService) {
  }

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

    this.logger.error('请求异常', exception);

    // 过滤掉自定义异常
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

    // 状态码，如果是业务异常，返回业务异常代码，否则返回500异常
    let httpStatusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let statusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let errMsg: string = exception?.message || ConfigConstant.DefaultStatusMessage.SERVER_ERROR_MSG;
    // 自定义业务异常，直接抛出
    if (exception instanceof ServerException) {
      statusCode = exception.getCode();
      errMsg = exception.getMessage();
      httpStatusCode = exception.getStatusCode();
    }

    if (exception instanceof HttpException) {
      httpStatusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      if (httpStatusCode === HttpStatus.NOT_FOUND) {
        // 404代表接口不存在
        errMsg = t(Strings[ApiTipConfig.api.tips[ApiTipConstant.api_not_exists].id]);
      } else {
        const errorOption: IExceptionOption = exception.getResponse() as IExceptionOption;
        errMsg = typeof errorOption === 'string' ? errorOption : errorOption.message;
      }
    }
    // 处理ApiException，兼容国际化
    if (exception instanceof ApiException) {
      httpStatusCode = exception.getTip().statusCode;
      statusCode = exception.getTip().code;
      errMsg = await this.i18n.translate(exception.getTip().message, {
        lang: request[USER_HTTP_DECORATE]?.locale,
        args: exception.getExtra(),
      });
    }

    // 统一响应结果
    const errorResponse: IHttpErrorResponse = {
      success: false,
      code: statusCode,
      message: errMsg,
    };
    this.logger.error('请求异常', exception?.stack || errMsg, exception?.message);
    // 设置返回的状态码、请求头、发送错误信息
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
