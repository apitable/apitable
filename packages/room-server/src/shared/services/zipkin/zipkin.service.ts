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
            console.log(`${serviceName} 上报: ${json}`);
            httpLogger.logSpan(span);
          },
        },
      });

      return {
        record: rec => {
          const { spanId, traceId } = rec.traceId;
          console.log(`${serviceName} 记录: ${traceId}/${spanId} ${rec.annotation.toString()}`);
          batchRecorder.record(rec);
        },
      };
    };

    const recorder = isDevMode ? debugRecorder() : new BatchRecorder({ logger: httpLogger });

    this._tracer = new Tracer({
      ctxImpl: new CLSContext(),
      recorder,
      localServiceName: serviceName,
    });
  }

  get tracer(): zipkin.Tracer {
    return this._tracer;
  }
}
