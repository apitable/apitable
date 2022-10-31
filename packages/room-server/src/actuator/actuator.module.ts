import { Module } from '@nestjs/common';
import { RedisHealthIndicator } from './redis.health.indicator';
import { ActuatorController } from './actuator.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CpuHealthIndicator } from './cpu.health.indicator';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [TerminusModule, SharedModule],
  providers: [RedisHealthIndicator,CpuHealthIndicator],
  controllers: [ActuatorController],
  })
export class ActuatorModule {}
