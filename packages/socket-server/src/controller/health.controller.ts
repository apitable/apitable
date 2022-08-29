import { Controller, Get } from '@nestjs/common';
import { DNSHealthIndicator, HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { LocalHealthIndicator } from '../service/indicator/local-health.indicator';
import { HealthConstants } from 'src/constants/health.constants';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator,
    private memory: MemoryHealthIndicator,
    private healthIndicator: LocalHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  // @UseInterceptors(HealthCheckInterceptor)
  async healthCheck() {
    return this.health.check([
      async () => this.dns.pingCheck('dns', HealthConstants.HEALTH_CHECK_URL, { timeout: 3000 }),
      async () => this.healthIndicator.checkMemory(),
      async () => this.healthIndicator.isRedisHealthy(),
      async () => this.healthIndicator.serverInfo(),
    ]);
  }
}
