import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from '@vikadata/nestjs-redis';
import { AUTHORIZATION_PREFIX, EnvConfigKey, NODE_LIMITER_PREFIX } from 'common';
import { EnvConfigService } from 'config/env.config.service';
import { ApiException } from 'exception/api.exception';
import { FusionHelper } from 'helpers';
import { IRateLimiter } from 'interfaces';
import { ApiResponse } from 'model/api.response';
import { I18nService } from 'nestjs-i18n';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import sha1 from 'sha1';

/**
 * <p>
 * 中间件限流
 * </p>
 * @author Zoe zheng
 * @date 2020/8/15 3:43 下午
 */
@Injectable()
export class NodeRateLimiterMiddleware implements NestMiddleware {
  constructor(
    private readonly redisService: RedisService,
    private readonly envConfigService: EnvConfigService,
    private readonly i18n: I18nService) {
  }

  use(req: any, res: any, next: () => void): any {
    // 这里用redis存储，在分布式环境中同样有用
    const redisClient = this.redisService.getClient();
    // 在space的限流阀里面统一做了验证，不需要在业务层再做验证,只有成功的请求才进行消费，计数, dstId,spaceId,单用户
    const limitKey = FusionHelper.parseDstIdFromUrl(req.originalUrl) || FusionHelper.parseSpaceIdFromUrl(req.originalUrl) || 'user';
    const token = req.headers.authorization.substr(AUTHORIZATION_PREFIX.length);
    // 单用户 + 单节点
    const consume = limitKey + ':' + sha1(token);
    const limiter = this.envConfigService.getRoomConfig(EnvConfigKey.API_LIMIT) as IRateLimiter;
    // 每 「duration」 s 限制 「points」 请求
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
