import { Module } from '@nestjs/common';
import { LocalHealthIndicator } from '../service/indicator/local-health.indicator';
import { RedisModule } from './redis.module';

@Module({
  imports: [RedisModule],
  providers: [LocalHealthIndicator],
  exports: [LocalHealthIndicator],
})
export class IndicatorModule {}
