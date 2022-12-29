import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AUTH_TOKEN } from 'socket/common/constants';

@Injectable()
export class AuthGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];
    if (!token || token !== AUTH_TOKEN) {
      return false;
    }
    return true;
  }
}
