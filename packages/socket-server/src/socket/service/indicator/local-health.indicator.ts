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
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import * as os from 'os';
import { ipAddress } from 'socket/common/helper';
import { HealthConstants } from 'socket/constants/health.constants';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class LocalHealthIndicator extends HealthIndicator {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async isRedisHealthy(): Promise<HealthIndicatorResult> {
    const redisStatus = this.redisService.getStatus();
    const isHealthy = redisStatus !== 'end';
    const result = await this.getStatus('redis', isHealthy, { redisStatus });
    if (isHealthy) {
      return result;
    }
    throw new HealthCheckError('redis down', result);
  }

  async checkMemory(): Promise<HealthIndicatorResult> {
    // get the current node memory stack situation
    const { rss, heapUsed, heapTotal } = process.memoryUsage();
    // get the total system memory
    const sysTotal = os.totalmem();
    const rssRatio = Number((rss / sysTotal).toFixed(2));
    const heapUsedRatio = Number((heapUsed / heapTotal).toFixed(2));
    const isRssHealthy = rssRatio * 100 < HealthConstants.RSS_MEMORY_RATIO;
    const isHeapHealthy = heapUsedRatio * 100 < HealthConstants.HEAP_MEMORY_RATIO;
    const result = await this.getStatus('memory', isRssHealthy && isHeapHealthy, {
      rss: { rssRatio, rss, sysTotal, status: isRssHealthy ? 'up' : 'down' },
      heap: {
        heapUsedRatio,
        heapUsed,
        heapTotal,
        status: isHeapHealthy ? 'up' : 'down',
      },
    });
    if (isRssHealthy && isHeapHealthy) {
      return result;
    }
    throw new HealthCheckError('memory', result);
  }

  async serverInfo(): Promise<HealthIndicatorResult> {
    return await this.getStatus('server', true, {
      name: `socket-server/${ipAddress()}`,
    });
  }
}
