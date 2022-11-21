import { ApiTipConstant } from '@apitable/core';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApiException } from 'shared/exception';

/**
 * request context middleware
 */
@Injectable()
export class ApiRequestMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      throw ApiException.tipError(ApiTipConstant.api_unauthorized);
    }
    next();
  }
}
