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
import { Reflector } from '@nestjs/core';
import { NodePermissionService } from 'node/services/node.permission.service';
import { NODE_PERMISSION_REFLECTOR_KEY } from 'shared/common';
import { ApiException } from 'shared/exception';
import { NodePermission } from 'shared/interfaces';

@Injectable()
export class NodePermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly permissionService: NodePermissionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const datasheetId = req.params.datasheetId || req.params.nodeId || req.params.dstId;
    const permissions = this.reflector.get<string[]>(NODE_PERMISSION_REFLECTOR_KEY, context.getHandler());
    if (!permissions) {
      return true;
    }
    return await this.matchPermissions(permissions, datasheetId, req);
  }

  /**
   * permission verification. room could not verify the permission, so it calls backend server to verify
   * @param permissions need to be verify permissions while it calls by reflection
   * @param dstId datasheet id
   * @param req request
   * @return boolean
   */
  private async matchPermissions(permissions: string[], dstId: string, req: any): Promise<boolean> {
    let auth;
    if (req.headers.authorization) {
      auth = { token: req.headers.authorization };
    } else {
      auth = { cookie: req.headers.cookie };
    }
    let nodePermission: NodePermission | undefined;
    try {
      nodePermission = await this.permissionService.getNodeRole(dstId, auth);
    } catch (e) {}
    if (nodePermission) {
      for (const permission of permissions) {
        if (!nodePermission[permission]) {
          throw ApiException.tipError(ApiTipConstant.api_node_permission_error);
        }
      }
    }
    return true;
  }
}
