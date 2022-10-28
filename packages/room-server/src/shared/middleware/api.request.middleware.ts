import { Injectable, NestMiddleware } from '@nestjs/common';
import { ApiException } from '../exception/api.exception';

/**
 * request context middleware
 * @author Zoe zheng
 * @date 2020/7/24 2:16 PM
 */
@Injectable()
export class ApiRequestMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void): any {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      throw ApiException.tipError('api_unauthorized');
    }
    next();
  }
}
