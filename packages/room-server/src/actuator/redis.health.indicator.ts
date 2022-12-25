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

import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
} from '@nestjs/terminus';
import { RedisService } from '@apitable/nestjs-redis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {

  isRedisHealthy(redisService: RedisService) {
    const redisClient = redisService.getClient();
    const isHealthy = redisClient.status !== 'end';
    const result = this.getStatus('redis', isHealthy);
    if (isHealthy) {
      return Promise.resolve(result);
    }
    throw new HealthCheckError(
      'redis',
      this.getStatus('redis', false, { message: 'down' }),
    );
  }
}
