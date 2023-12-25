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

import { ApiTipConstant } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { DatasheetRepository } from 'database/datasheet/repositories/datasheet.repository';
import { DeveloperService } from 'developer/services/developer.service';
import { I18nService } from 'nestjs-i18n';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import sha1 from 'sha1';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { ApiResponse } from '../../fusion/vos/api.response';
import { AUTHORIZATION_PREFIX, EnvConfigKey, NODE_LIMITER_PREFIX } from '../common';
import { ApiException, CommonException, PermissionException } from '../exception';
import { FusionHelper } from '../helpers';
import { IRateLimiter } from '../interfaces';
import { RestService } from '../services/rest/rest.service';

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
    private readonly restService: RestService,
    private readonly datasheetRepository: DatasheetRepository,
    private readonly developerService: DeveloperService,
    private readonly i18n: I18nService) {
  }

  async use(req: any, res: any, next: () => void) {
    if (req.complete) {
      return next();
    }
    // use redis for distributed system
    const redisClient = this.redisService.getClient();
    // use spaceId as the unique key for verification, no need to verify in other places.
    // only count the successful requests
    const limitKey = FusionHelper.parseDstIdFromUrl(req.originalUrl) || FusionHelper.parseSpaceIdFromUrl(req.originalUrl) || 'user';
    const token = req.headers.authorization.substr(AUTHORIZATION_PREFIX.length);
    // single user plus single node
    const consume = limitKey + ':' + sha1(token);
    const limiter = this.envConfigService.getRoomConfig(EnvConfigKey.API_LIMIT) as IRateLimiter;
    let points = limiter.points;
    let duration = limiter.duration;
    if (!process.env.LIMIT_POINTS || parseInt(process.env.LIMIT_POINTS!) === 5) {
      const datasheetId = FusionHelper.parseDstIdFromUrl(req.originalUrl);
      let spaceId: string | undefined = FusionHelper.parseSpaceIdFromUrl(req.originalUrl);
      if (!spaceId && datasheetId) {
        const entity = await this.datasheetRepository.selectById(datasheetId);
        spaceId = entity?.spaceId;
      }
      if (spaceId) {
        try {
          const qps = await this.restService.getApiRateLimit({ token }, spaceId);
          if (qps?.qps && qps.qps !== -1) {
            points = qps.qps;
          }
        } catch (e: any) {
          let error;
          if (e.code === PermissionException.SPACE_NOT_EXIST.code) {
            error = ApiException.tipError(ApiTipConstant.api_param_invalid_space_id_value);
          }
          if (e.code === PermissionException.NO_ALLOW_OPERATE.code) {
            error = ApiException.tipError(ApiTipConstant.api_forbidden_because_of_not_in_space);
          }
          if (e.code === CommonException.UNAUTHORIZED.code) {
            error = ApiException.tipError(ApiTipConstant.api_unauthorized);
          }
          if (error) {
            const user = await this.developerService.getUserInfoByApiKey(token);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = error.getTip().statusCode;
            const errMsg = await this.i18n.translate(error.getMessage(), { lang: user?.locale });
            res.write(JSON.stringify(ApiResponse.error(errMsg as string, error.getTip().code)));
            res.end();
          }
          // unknown error
          throw e;
        }
      }
    }
    points = limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token)!.points : points;
    duration = limiter.whiteList && limiter.whiteList.has(token) ? limiter.whiteList.get(token)!.duration : duration;
    // rate limit per [duration] seconds
    const rateLimiter = new RateLimiterRedis({
      storeClient: redisClient,
      points,
      duration,
      keyPrefix: NODE_LIMITER_PREFIX,
    });
    rateLimiter
      .consume(consume)
      .then(() => {
        next();
      })
      .catch(async () => {
        const user = await this.developerService.getUserInfoByApiKey(token);
        const err = ApiException.tipError(ApiTipConstant.api_frequently_error, { value: points });
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = err.getTip().statusCode;
        const errMsg = await this.i18n.translate(err.getMessage(), { lang: user?.locale, args: { value: points } });
        res.write(JSON.stringify(ApiResponse.error(errMsg as string, err.getTip().code)));
        res.end();
      });
  }
}
