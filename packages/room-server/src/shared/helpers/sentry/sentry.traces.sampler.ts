import { SamplingContext } from '@sentry/types';
import { find } from 'lodash';

/**
 * Sentry sampling
 */
export class SentryTraces {
  private readonly _nameSamplerConfig: TransactionNameSampler[];
  private readonly _defaultSampleRate: number;

  constructor(defaultSampleRate?: number) {
    // initialize rules
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

      // select the first matching rule
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