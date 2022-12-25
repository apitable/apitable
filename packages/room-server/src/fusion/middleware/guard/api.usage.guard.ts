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

import { ApiTipConstant } from '@apitable/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { RestService } from 'shared/services/rest/rest.service';
import { Logger } from 'winston';
import { DATASHEET_HTTP_DECORATE, InjectLogger } from '../../../shared/common';
import { ApiException, PermissionException } from '../../../shared/exception';

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
      if ((e as any).getCode() === PermissionException.SPACE_NOT_EXIST.code) {
        throw ApiException.tipError(ApiTipConstant.api_param_invalid_space_id_value);
      }
      if ((e as any).getCode() === PermissionException.NO_ALLOW_OPERATE.code) {
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
