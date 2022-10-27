import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { RedisService } from '@vikadata/nestjs-redis';
import { EnvConfigKey } from '../shared/common';
import { EnvConfigService } from 'shared/services/config/env.config.service';
import { IActuatorConfig } from '../shared/interfaces';
import * as os from 'os';
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
          Object.assign(result['memory_rss'], { totalMem: (totalMem / 1024 / 1024) });
          return result;
        });
        return rssThresholdResult;
      },
      () => {
        const { heapTotal } = process.memoryUsage();
        const heapUsedThreshold = (actuator.heapRatio / 100) * heapTotal;
        const heapUsedThresholdResult = this.memory.checkHeap('memory_heap', heapUsedThreshold).then(result => {
          Object.assign(result['memory_heap'], { memoryUsageMem: (heapTotal / 1024 / 1024) });
          return result;
        });
        return heapUsedThresholdResult;
      },
      // Cpu 健康检查容易被误杀，暂时不开启
      // () => this.cpu.healthCheckResult(88.8),
      () => this.redis.isRedisHealthy(this.redisService),
    ]);
  }
}
