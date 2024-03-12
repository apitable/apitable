/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ApiTipConstant, ConfigConstant } from '@apitable/core';
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpStatus, Logger, NotFoundException } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ServerResponse } from 'http';
import { I18nService } from 'nestjs-i18n';
import { USER_HTTP_DECORATE } from 'shared/common';
import { ApiException, OverLimitException, ServerException } from 'shared/exception';
import { IHttpErrorResponse } from 'shared/interfaces/http.interfaces';

/**
 * Global exception filter
 * would filter custom exception
 * catch exceptions, not only http exceptions
 * @description format all errors and exceptions data
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const response = ctx.getResponse<FastifyReply>();

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
          stack: exception?.stack,
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
    if (exception instanceof NotFoundException) {
      httpStatusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      statusCode = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      // 404 means API not found
      errMsg = await this.i18n.translate(ApiTipConstant.api_not_exists, {
        lang: request[USER_HTTP_DECORATE]?.locale,
      });
    }
    if (exception instanceof BadRequestException) {
      errMsg = exception.getResponse()['message'];
      if (ApiTipConstant[errMsg]) {
        errMsg = await this.i18n.translate(errMsg, {
          lang: request[USER_HTTP_DECORATE]?.locale,
        });
        // TODO Does not meet the http status specification, the parameter error should be 400
        httpStatusCode = HttpStatus.OK;
      }
    }

    // handle API exceptions with internationalization
    if (exception instanceof ApiException) {
      httpStatusCode = exception.getTip().statusCode;
      statusCode = exception.getTip().code;
      errMsg = await this.i18n.translate(exception.getTip().message!, {
        lang: request[USER_HTTP_DECORATE]?.locale,
        args: exception.getExtra(),
      });
    }

    if (exception instanceof OverLimitException) {
      httpStatusCode = exception.getStatus();
      statusCode = exception.ex.getCode();
      errMsg = exception.ex.getMessage();
    }

    // standard error response
    const errorResponse: IHttpErrorResponse = {
      success: false,
      code: statusCode,
      message: errMsg,
    };

    this.logger.error(
      {
        message: `request error: ${exception?.message || ''}`,
        response: exception?.response || '',
      },
      exception?.stack || errMsg,
    );

    try {
      // set header, status code and error response data
      if (response instanceof ServerResponse) {
        response.setHeader('Content-Type', 'application/json');
        response.statusCode = httpStatusCode;
        response.write(JSON.stringify(errorResponse));
        response.end();
      } else {
        await response.status(httpStatusCode).send(errorResponse);
      }
    } catch (e) {}
  }
}
