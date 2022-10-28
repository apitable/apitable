import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from '@vikadata/nestjs-redis';
import { AUTHORIZATION_PREFIX, EnvConfigKey, NODE_LIMITER_PREFIX } from '../common';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { ApiException } from '../exception/api.exception';
import { FusionHelper } from '../helpers';
import { IRateLimiter } from '../interfaces';
import { ApiResponse } from '../../fusion/vos/api.response';
import { I18nService } from 'nestjs-i18n';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import sha1 from 'sha1';

/**
 * Rate limiter middleware
 * @author Zoe zheng
 * @date 2020/8/15 3:43 PM
 */
@Injectable()
export class NodeRateLimiterMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly envConfigService: EnvConfigService,
    private readonly i18n: I18nService) {
  }

  use(req: any, res: any, next: () => void): any {
    // use redis for distributed system
    const redisClient = this.redisService.getClient();
    // use spaceId as the unique key for verification, no need to verify in other places.
    // only count the successful requests
    const limitKey = FusionHelper.parseDstIdFromUrl(req.originalUrl) || FusionHelper.parseSpaceIdFromUrl(req.originalUrl) || 'user';
    const token = req.headers.authorization.substr(AUTHORIZATION_PREFIX.length);
    // single user plus single node
    const consume = limitKey + ':' + sha1(token);
    const limiter = this.envConfigService.getRoomConfig(EnvConfigKey.API_LIMIT) as IRateLimiter;
    // rate limit per [duration] seconds
    const rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      points: limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token).points : limiter.points,
      duration: limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token).duration : limiter.duration,
      keyPrefix: NODE_LIMITER_PREFIX,
    });
    rateLimiter
      .consume(consume)
      .then(() => {
        next();
      })
      .catch(async() => {
        const err = ApiException.tipError('api_frequently_error');
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = err.getTip().statusCode;
        const errMsg = await this.i18n.translate(err.getMessage());
        res.write(JSON.stringify(ApiResponse.error(errMsg, err.getTip().code)));
        res.end();
      });
  }
}
