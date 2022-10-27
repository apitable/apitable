import { Module } from '@nestjs/common';
import { RedisHealthIndicator } from './redis.health.indicator';
import { ActuatorController } from './actuator.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CpuHealthIndicator } from './cpu.health.indicator';

@Module({
  imports: [TerminusModule],
  providers: [RedisHealthIndicator,CpuHealthIndicator],
  controllers: [ActuatorController],
})
export class ActuatorModule {}
