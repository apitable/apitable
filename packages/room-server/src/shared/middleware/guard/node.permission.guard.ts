import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NODE_PERMISSION_REFLECTOR_KEY } from '../../common';
import { ApiException } from '../../exception/api.exception';
import { NodePermission } from '../../interfaces';
import { NodePermissionService } from 'database/services/node/node.permission.service';

@Injectable()
export class NodePermissionGuard implements CanActivate {
  constructor(private reflector: Reflector, private readonly permissionService: NodePermissionService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const datasheetId = req.params.datasheetId;
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
   * @return
   * @author Zoe Zheng
   * @date 2020/8/14 4:29 PM
   */
  private async matchPermissions(permissions: string[], dstId: string, req: any): Promise<boolean> {
    let auth;
    if (req.headers.authorization) {
      auth = { token: req.headers.authorization };
    } else {
      auth = { cookie: req.headers.cookie };
    }
    const nodePermission: NodePermission = await this.permissionService.getNodeRole(dstId, auth);
    for (const permission of permissions) {
      if (!nodePermission[permission]) {
        throw ApiException.tipError('api_node_permission_error');
      }
    }
    return true;
  }
}
