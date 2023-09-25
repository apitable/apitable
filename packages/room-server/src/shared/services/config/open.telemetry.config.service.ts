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

import { OpenTelemetryModuleConfig } from '@metinseylan/nestjs-opentelemetry';
import { AlwaysOffSampler, ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { GrpcInstrumentation } from '@opentelemetry/instrumentation-grpc';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { MySQLInstrumentation } from '@opentelemetry/instrumentation-mysql';
import { Resource } from '@opentelemetry/resources';
import { BatchSpanProcessor, NoopSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { enableOtelJaeger } from 'app.environment';
import * as os from 'os';
import { APPLICATION_NAME } from 'shared/common/constants/bootstrap.constants';
import { CustomParentBasedSampler } from 'shared/helpers/opentelemetry/custom.parent.sampler';

const openTelemetryConfiguration: OpenTelemetryModuleConfig = {
  applicationName: APPLICATION_NAME,
  sampler: enableOtelJaeger
    ? new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(parseInt(process.env.OTEL_JAEGER_TRACE_ID_RATIO_BASED || '0.1', 10)),
      localParentSampled: new CustomParentBasedSampler(),
    })
    : new AlwaysOffSampler(),
  metricInterval: 1000,
  instrumentations: [
    new HttpInstrumentation({
      ignoreIncomingPaths: [/.*(actuator|socket)\/health.*/],
      ignoreOutgoingUrls: [/.*(actuator|socket)\/health.*/],
    }),
    new GrpcInstrumentation(),
    new MySQLInstrumentation(),
  ],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: APPLICATION_NAME,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.ENV || 'development',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SEMVER_FULL,
    [SemanticResourceAttributes.HOST_NAME]: os.hostname(),
  }) as any,
  spanProcessor: (enableOtelJaeger
    ? new BatchSpanProcessor(
      new JaegerExporter({
        endpoint: process.env.OTEL_JAEGER_ENDPOINT,
      }),
    )
    : new NoopSpanProcessor()) as any,
};

export default openTelemetryConfiguration;
export { openTelemetryConfiguration as configuration };
