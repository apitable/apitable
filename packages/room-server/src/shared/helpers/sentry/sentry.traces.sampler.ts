import { SamplingContext } from '@sentry/types';
import { find } from 'lodash';

/**
 * Sentry 采样
 */
export class SentryTraces {
  private readonly _nameSamplerConfig: TransactionNameSampler[];
  private readonly _defaultSampleRate: number;

  constructor(defaultSampleRate?: number) {
    // 初始化规则
    this._nameSamplerConfig = [{
      name: /^GET \/actuator\/health$/,
      rate: 0
    }];
    this._defaultSampleRate = defaultSampleRate;
  }

  get nameSamplerConfig(): TransactionNameSampler[] {
    return this._nameSamplerConfig;
  }

  get defaultSampleRate(): number {
    return this._defaultSampleRate;
  }

  public tracesSampler() {
    const nameSamplerConfig = this.nameSamplerConfig;
    const defaultSampleRate = this.defaultSampleRate;
    return function(samplingContext: SamplingContext): number | boolean {
      const { name: transactionName } = samplingContext.transactionContext;

      // 取第一个匹配的规则
      const match = find(nameSamplerConfig, pre => {
        if (pre.name instanceof RegExp) {
          return pre.name.test(transactionName);
        }
        return pre.name === transactionName;
      });

      return match?.rate ?? defaultSampleRate;
    };
  }
}

interface Sampler {
  rate: number | boolean
}

interface TransactionNameSampler extends Sampler {
  name: string | RegExp
}