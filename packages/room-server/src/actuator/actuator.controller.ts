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

import { RedisService } from '@apitable/nestjs-redis';
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import * as os from 'os';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { EnvConfigKey } from 'shared/common';
import { IActuatorConfig } from 'shared/interfaces';
import { RedisHealthIndicator } from './redis.health.indicator';

@Controller('actuator/health')
export class ActuatorController {
  constructor(
    private readonly envConfigService: EnvConfigService,
    private readonly redisService: RedisService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private redis: RedisHealthIndicator,
    private memory: MemoryHealthIndicator,
    // private cpu: CpuHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  healthCheck() {
    const actuator = this.envConfigService.getRoomConfig(EnvConfigKey.ACTUATOR) as IActuatorConfig;
    return this.health.check([
      () => this.db.pingCheck('database', { timeout: 60000 }),
      () => {
        const totalMem = os.totalmem();
        const rssThreshold = (actuator.rssRatio / 100) * totalMem;
        const rssThresholdResult = this.memory.checkRSS('memory_rss', rssThreshold).then(result => {
          Object.assign(result['memory_rss']!, { totalMem: (totalMem / 1024 / 1024) });
          return result;
        });
        return rssThresholdResult;
      },
      () => {
        const { heapTotal } = process.memoryUsage();
        const heapUsedThreshold = (actuator.heapRatio / 100) * heapTotal;
        const heapUsedThresholdResult = this.memory.checkHeap('memory_heap', heapUsedThreshold).then(result => {
          Object.assign(result['memory_heap']!, { memoryUsageMem: (heapTotal / 1024 / 1024) });
          return result;
        });
        return heapUsedThresholdResult;
      },
      // CPU health check always be killed incorrectly, disable it temporarily
      // () => this.cpu.healthCheckResult(88.8),
      () => this.redis.isRedisHealthy(this.redisService),
    ]);
  }
}
