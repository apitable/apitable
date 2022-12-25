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
import { NODE_INFO } from '../../../shared/common';
import { ApiException } from '../../../shared/exception';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * node info validate guard
 * the path start with: /fusion/v1/nodes
 */
@Injectable()
export class ApiNodeGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const nodeInfo = request[NODE_INFO];
    if (!nodeInfo?.spaceId) {
      // TODO: why the node is not in any space?
      throw ApiException.tipError(ApiTipConstant.api_datasheet_not_exist);
    }
    return true;
  }
}
