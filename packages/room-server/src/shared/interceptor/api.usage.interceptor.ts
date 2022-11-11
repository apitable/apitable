import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiTipConstant, CacheManager, clearCachedSelectors, computeCache, ExpCache } from '@apitable/core';
import { InjectLogger, SPACE_ID_HTTP_DECORATE, USER_HTTP_DECORATE } from '../common';
import { ApiUsageEntity } from '../../fusion/entities/api.usage.entity';
import { ApiHttpMethod } from '../enums';
import { ApiException } from '../exception/api.exception';
import { ServerException } from '../exception/server.exception';
import { getApiVersionFromUrl } from 'shared/helpers/fusion.helper';
import { ApiResponse } from '../../fusion/vos/api.response';
import { ApiUsageRepository } from '../../fusion/repositories/api.usage.repository';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { QueryFailedError } from 'typeorm';
import { Logger } from 'winston';

/**
 * <p>
 * Fusion API Usage intercept, middleware -> hooks -> interceptor
 * api usage statistics
 * </p>
 * @author Zoe zheng
 * @date 2020/9/14 6:59 PM
 */
@Injectable()
export class ApiUsageInterceptor implements NestInterceptor {
  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly apiUsageRepository: ApiUsageRepository) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Promise<any> {
    const request = context.switchToHttp().getRequest();
    this.clearApiCache();
    return next.handle().pipe(
      tap((data: ApiResponse<any>) => {
        this.clearApiCache();
        this.apiUsage(request, data);
      }),
      catchError(err => {
        this.clearApiCache();
        if (err instanceof ApiException && err.getTip().isRecordTimes) {
          this.apiUsage(request, null, err);
          return throwError(err);
        }
        // database error
        if (err instanceof QueryFailedError) {
          this.logger.error('FusionApiDBException', err?.stack, err?.message);
          return throwError(ApiException.tipError(ApiTipConstant.api_server_error));
        }
        return throwError(err);
      }),
    ) as any as Promise<any>;
  }

  /**
   * clear API cache all at once
   * @author Zoe Zheng
   * @date 2020/9/21 3:35 PM
   */
  clearApiCache(): void {
    ExpCache.clearAll();
    CacheManager.clear();
    if (computeCache) {
      computeCache.clear();
    }
    clearCachedSelectors();
  }

  apiUsage(request: any, response?: ApiResponse<any>, error?: any) {
    const apiUsageEntity = new ApiUsageEntity();
    apiUsageEntity.dstId = request.params.datasheetId;
    apiUsageEntity.spaceId = request[SPACE_ID_HTTP_DECORATE];
    apiUsageEntity.userId = request[USER_HTTP_DECORATE].id;
    apiUsageEntity.reqIp = request.headers['x-real-ip'] || request.ip;
    apiUsageEntity.apiVersion = getApiVersionFromUrl(request.raw.url);
    apiUsageEntity.reqMethod = ApiHttpMethod[request.raw.method.toLowerCase()];
    apiUsageEntity.reqPath = request.raw.url.split('?')[0];
    apiUsageEntity.reqDetail = {
      ua: request.headers['x-vika-user-agent'] || request.headers['user-agent'],
      referer: request.headers.referer,
    };
    if (response) {
      apiUsageEntity.resDetail = {
        code: response.code,
        message: response.message,
      };
    }
    if (error) {
      apiUsageEntity.resDetail = {
        code: error instanceof ServerException ? error.getCode() : HttpStatus.INTERNAL_SERVER_ERROR,
        message: error instanceof ServerException ? error.getMessage() : error.message,
      };
    }
    return this.apiUsageRepository.insertByEntity(apiUsageEntity);
  }
}
