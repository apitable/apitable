import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { USER_HTTP_DECORATE } from '../../common';
import { ApiException } from '../../exception';

/**
 * Guards are executed after each middleware, but before any interceptor or pipe.
 * Authorization guard
 */
@Injectable()
export class ApiAuthGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request[USER_HTTP_DECORATE];
    // 未授权或者访问失效
    if (!user) throw ApiException.tipError('api_unauthorized');
    return true;
  }
}
