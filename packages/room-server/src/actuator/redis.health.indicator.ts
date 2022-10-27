import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
} from '@nestjs/terminus';
import { RedisService } from '@vikadata/nestjs-redis';

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
