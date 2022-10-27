import { Controller, Get } from '@nestjs/common';
import { HttpHealthIndicator, HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { LocalHealthIndicator } from '../service/indicator/local-health.indicator';
import { HealthConstants } from 'src/socket/constants/health.constants';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private healthIndicator: LocalHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async healthCheck() {
    return await this.health.check([
      () => this.http.pingCheck('dns', HealthConstants.HEALTH_CHECK_URL, { timeout: 3000 }),
      async() => this.healthIndicator.checkMemory(),
      async() => this.healthIndicator.isRedisHealthy(),
      async() => this.healthIndicator.serverInfo(),
    ]);
  }
}
