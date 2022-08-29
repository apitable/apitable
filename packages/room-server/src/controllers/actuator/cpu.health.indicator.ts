import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
} from '@nestjs/terminus';
import * as osu from 'node-os-utils';

@Injectable()
export class CpuHealthIndicator extends HealthIndicator {

  async healthCheckResult(cpuRatio: number) {
    const currentCpuPercentage = (await osu.cpu.usage(350) | 0);
    const isHealthy = currentCpuPercentage <= cpuRatio;

    const result = this.getStatus('cpu_usage', isHealthy, { cpuPercentage: currentCpuPercentage });
    if (isHealthy) {
      return Promise.resolve(result);
    }
    throw new HealthCheckError(
      'cpu_usage',
      this.getStatus('cpu_usage', false, { message: 'down' }),
    );
  }

}
