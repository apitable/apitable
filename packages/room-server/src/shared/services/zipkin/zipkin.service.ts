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

import { IZipkinModuleOptions } from './zipkin.interface';
import * as zipkin from 'zipkin';
import { BatchRecorder, Tracer } from 'zipkin';
import { HttpLogger } from 'zipkin-transport-http';
import CLSContext from 'zipkin-context-cls';
import { environment, isDevMode } from '../../../app.environment';
import { Inject, Injectable } from '@nestjs/common';
import { ZIPKIN_MODULE_OPTIONS } from './zipkin.constants';

const JSON_V2 = zipkin.jsonEncoder.JSON_V2;

@Injectable()
export class ZipkinService {
  private readonly _tracer: Tracer;

  constructor(@Inject(ZIPKIN_MODULE_OPTIONS) private readonly options: IZipkinModuleOptions) {
    const serviceName = `${environment}-room-server`;

    const httpLogger = new HttpLogger({
      endpoint: `${this.options.endpoint}/api/v2/spans`,
      jsonEncoder: JSON_V2,
    });

    const debugRecorder = () => {
      const batchRecorder = new BatchRecorder({
        logger: {
          logSpan: span => {
            const json = JSON_V2.encode(span);
            console.log(`${serviceName} report: ${json}`);
            httpLogger.logSpan(span);
          },
        },
      });

      return {
        record: (rec: any) => {
          const { spanId, traceId } = rec.traceId;
          console.log(`${serviceName} record: ${traceId}/${spanId} ${rec.annotation.toString()}`);
          batchRecorder.record(rec);
        },
      };
    };

    const recorder = isDevMode ? debugRecorder() : new BatchRecorder({ logger: httpLogger });

    this._tracer = new Tracer({
      ctxImpl: new CLSContext('undefined'),
      recorder,
      localServiceName: serviceName,
    });
  }

  get tracer(): zipkin.Tracer {
    return this._tracer;
  }
}
