import { Module } from '@nestjs/common';
import { LocalHealthIndicator } from './local-health.indicator';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [LocalHealthIndicator],
  exports: [LocalHealthIndicator],
})
export class IndicatorModule {}
