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

import { Injectable, NestMiddleware } from '@nestjs/common';
import { RedisService } from '@apitable/nestjs-redis';
import { AUTHORIZATION_PREFIX, EnvConfigKey, NODE_LIMITER_PREFIX } from '../common';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { ApiException } from '../exception/api.exception';
import { FusionHelper } from '../helpers';
import { IRateLimiter } from '../interfaces';
import { ApiResponse } from '../../fusion/vos/api.response';
import { I18nService } from 'nestjs-i18n';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import sha1 from 'sha1';
import { ApiTipConstant } from '@apitable/core';

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
      points: limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token)!.points : limiter.points,
      duration: limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token)!.duration : limiter.duration,
      keyPrefix: NODE_LIMITER_PREFIX,
    });
    rateLimiter
      .consume(consume)
      .then(() => {
        next();
      })
      .catch(async() => {
        const err = ApiException.tipError(ApiTipConstant.api_frequently_error);
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = err.getTip().statusCode;
        const errMsg = await this.i18n.translate(err.getMessage());
        res.write(JSON.stringify(ApiResponse.error(errMsg, err.getTip().code)));
        res.end();
      });
  }
}
