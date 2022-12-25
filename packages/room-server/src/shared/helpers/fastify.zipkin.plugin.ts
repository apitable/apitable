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

import { AsyncLocalStorage, AsyncResource } from 'async_hooks';
import { FastifyInstance } from 'fastify';
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import * as url from 'url';
import * as zipkin from 'zipkin';
import { Instrumentation, TraceId, Tracer } from 'zipkin';
import { TRACE_ID } from '../common';
import None = zipkin.option.None;
import Some = zipkin.option.Some;

const pluginName = 'zipkin-tracer';

const als = new AsyncLocalStorage();

const isWrappedSymbol = Symbol('zipkin-tracer-is-wrapped');
const wrappedSymbol = Symbol('zipkin-tracer-wrapped-function');

const addMethods = ['on', 'addListener', 'prependListener'] as const;

const removeMethods = ['off', 'removeListener'] as const;

type Emitter<K extends string[]> = {
  [key in K[number]]: (this: AsyncResource, name: string, handler: () => void) => void;
};

function wrapEmitterMethod<K extends string[]>(
  emitter: Emitter<K>,
  method: string,
  wrapper: (original: Emitter<K>[K[number]], method: string) => Emitter<K>[K[number]],
) {
  if (emitter[method][isWrappedSymbol]) {
    return;
  }

  const original = emitter[method];
  const wrapped = wrapper(original, method);
  wrapped[isWrappedSymbol] = true;
  emitter[method] = wrapped;

  return wrapped;
}

function wrapEmitter(emitter: Emitter<[...typeof addMethods, ...typeof removeMethods]>, asyncResource: AsyncResource) {
  for (const method of addMethods) {
    wrapEmitterMethod(
      emitter,
      method,
      original =>
        function(this: AsyncResource, name: string, handler: () => void) {
          handler[wrappedSymbol] = asyncResource.runInAsyncScope.bind(asyncResource, handler, emitter);
          return original.call(this, name, handler[wrappedSymbol]);
        },
    );
  }

  for (const method of removeMethods) {
    wrapEmitterMethod(
      emitter,
      method,
      original =>
        function(this: AsyncResource, name: string, handler: () => void) {
          return original.call(this, name, handler[wrappedSymbol] || handler);
        },
    );
  }
}

const wrapHttpEmitters = (req: IncomingMessage, res: ServerResponse) => {
  const asyncResource = new AsyncResource('zipkin-tracer');
  wrapEmitter(req, asyncResource);
  wrapEmitter(res, asyncResource);
};

function readHeader(this: IncomingHttpHeaders, header: string) {
  const val = this[header];
  if (val != null) {
    return new Some<any>(val);
  }
  return None;
}

export interface IFastifyOptions {
  tracer?: Tracer;
  endpoint?: string;
  serviceName: string;
  port: number;
}

export const fastifyZipkinPlugin = (fastify: FastifyInstance, options: IFastifyOptions, next: (err?: Error) => void) => {
  const { tracer, serviceName, port } = options;

  const instrumentation = new Instrumentation.HttpServer({
    tracer: tracer!,
    serviceName: serviceName,
    port: port || 0,
  });

  let traceId: TraceId;

  fastify.addHook('onRequest', (req, reply, done) => {
    tracer!.scoped(() => {
      traceId = instrumentation.recordRequest(req.raw.method!, url.format(req.raw.url!), readHeader.bind(req.headers));
      reply.header(TRACE_ID, traceId.traceId);
      als.run(traceId, () => {
        wrapHttpEmitters(req.raw, reply.raw || reply.request);
        done();
      });
    });
  });

  fastify.addHook('onResponse', (_req, reply, done) => {
    tracer!.letId(traceId, () => {
      instrumentation.recordResponse(traceId, String(reply.raw.statusCode));
    });
    done();
  });

  next();
};

fastifyZipkinPlugin[Symbol.for('skip-override')] = true;
fastifyZipkinPlugin[Symbol.for('fastify.display-name')] = pluginName;

export const getTraceId = () => als.getStore() && als.getStore()!['traceId'];
export const getSpanId = () => als.getStore() && als.getStore()!['spanId'];
export const ALS = als;
