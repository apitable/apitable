import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NODE_PERMISSION_REFLECTOR_KEY } from 'common';
import { ApiException } from 'exception/api.exception';
import { NodePermission } from 'interfaces';
import { NodePermissionService } from 'modules/services/node/node.permission.service';

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
   * 验证权限，这里直接查找权限，应为目前room层还没有对权限的操作，所以不需要把用户的权限信息也放入requestContext（请求上下文）中
   * @param permissions 控制器通过反射器传入的需要判断的权限
   * @param dstId 数表ID
   * @param req 请求信息
   * @return
   * @author Zoe Zheng
   * @date 2020/8/14 4:29 下午
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
