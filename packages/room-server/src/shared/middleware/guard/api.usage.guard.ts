import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DATASHEET_HTTP_DECORATE, InjectLogger } from '../../common';
import { ApiException } from '../../exception';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * API usage guard
 */
@Injectable()
export class ApiUsageGuard implements CanActivate {
  constructor(@InjectLogger() private readonly logger: Logger,
              private readonly restService: RestService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // 空间站相关接口
    let spaceId = request.params?.spaceId;
    if (!spaceId) {
      // 数表相关接口
      const datasheet = request[DATASHEET_HTTP_DECORATE];
      if (datasheet) {
        spaceId = datasheet.spaceId;
      }
    }
    // todo spaceList这个接口没办法验证，因为不确定空间站
    if (!spaceId) {
      return true;
    }
    let res;
    try {
      res = await this.restService.getApiUsage({ token: request.headers.authorization }, spaceId);
    } catch (e) {
      // 这里已经调用下游服务无法调通，为了不造成资源浪费，直接抛出异常失败
      this.logger.error('获取API用量失败', e?.stack, e?.message);
      throw ApiException.tipError('api_server_error', { value: 1 });
    }
    if (!res) {
      this.logger.error('获取API用量失败，禁止访问');
      throw ApiException.tipError('api_forbidden');
    }
    // api 用量是允许超限的，只有在这种情况下才会进行校验
    if (res.data && !res.data.isAllowOverLimit && res.data.maxApiUsageCount - res.data.apiUsageUsedCount < 0) {
      throw ApiException.tipError('api_forbidden_because_of_usage');
    }
    return true;
  }
}
