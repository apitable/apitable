/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { SamplingContext } from '@sentry/types';
import { find } from 'lodash';

/**
 * Sentry sampling
 */
export class SentryTraces {
  private readonly _nameSamplerConfig: ITransactionNameSampler[];
  private readonly _defaultSampleRate: number;

  constructor(defaultSampleRate: number) {
    // initialize rules
    this._nameSamplerConfig = [{
      name: /^GET \/actuator\/health$/,
      rate: 0
    }];
    this._defaultSampleRate = defaultSampleRate;
  }

  get nameSamplerConfig(): ITransactionNameSampler[] {
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

interface ISampler {
  rate: number | boolean
}

interface ITransactionNameSampler extends ISampler {
  name: string | RegExp
}