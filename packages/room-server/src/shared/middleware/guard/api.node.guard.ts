import { ApiTipConstant } from '@apitable/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { NODE_INFO } from '../../common';
import { ApiException } from '../../exception';

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
