import { ApiTipConstant } from '@apitable/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';
import { DATASHEET_HTTP_DECORATE, InjectLogger } from '../../common';
import { ApiException, PermissionException } from '../../exception';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * API usage guard
 */
@Injectable()
export class ApiUsageGuard implements CanActivate {
  constructor(@InjectLogger() private readonly logger: Logger, private readonly restService: RestService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // works for space related APIs
    let spaceId = request.params?.spaceId;
    if (!spaceId) {
      // works for datasheet related APIs
      const datasheet = request[DATASHEET_HTTP_DECORATE];
      if (datasheet) {
        spaceId = datasheet.spaceId;
      }
    }
    // TODO: /spaceList should be validated
    if (!spaceId) {
      return true;
    }
    let res;
    try {
      res = await this.restService.getApiUsage({ token: request.headers.authorization }, spaceId);
    } catch (e) {
      // throw error if it could not get the api usage information
      this.logger.error('Failed to get API usage', { error: e });
      if (e.getCode() === PermissionException.SPACE_NOT_EXIST.code) {
        throw ApiException.tipError(ApiTipConstant.api_param_invalid_space_id_value);
      }
      if (e.getCode() === PermissionException.NO_ALLOW_OPERATE.code) {
        throw ApiException.tipError(ApiTipConstant.api_forbidden_because_of_not_in_space);
      }
      throw ApiException.tipError(ApiTipConstant.api_server_error, { value: 1 });
    }
    if (!res) {
      this.logger.error('Forbidden, failed to get API usage');
      throw ApiException.tipError(ApiTipConstant.api_forbidden);
    }
    // only works for those who are allowed to exceed the limit of usage
    if (res.data && !res.data.isAllowOverLimit && res.data.maxApiUsageCount - res.data.apiUsageUsedCount < 0) {
      throw ApiException.tipError(ApiTipConstant.api_forbidden_because_of_usage);
    }
    return true;
  }
}
