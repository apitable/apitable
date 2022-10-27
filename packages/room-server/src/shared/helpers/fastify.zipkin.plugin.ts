import { AsyncLocalStorage, AsyncResource } from 'async_hooks';
import * as zipkin from 'zipkin';
import Some = zipkin.option.Some;
import None = zipkin.option.None;
import * as url from 'url';
import { TRACE_ID } from '../common';
import { Instrumentation, TraceId, Tracer } from 'zipkin';
import { FastifyInstance } from 'fastify';

const pluginName = 'zipkin-tracer';

const als = new AsyncLocalStorage();

const isWrappedSymbol = Symbol('zipkin-tracer-is-wrapped');
const wrappedSymbol = Symbol('zipkin-tracer-wrapped-function');

const addMethods = ['on', 'addListener', 'prependListener'];

const removeMethods = ['off', 'removeListener'];

function wrapEmitterMethod(emitter, method, wrapper) {
  if (emitter[method][isWrappedSymbol]) {
    return;
  }

  const original = emitter[method];
  const wrapped = wrapper(original, method);
  wrapped[isWrappedSymbol] = true;
  emitter[method] = wrapped;

  return wrapped;
}

function wrapEmitter(emitter, asyncResource) {
  for (const method of addMethods) {
    wrapEmitterMethod(
      emitter,
      method,
      original =>
        function(name, handler) {
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
        function(name, handler) {
          return original.call(this, name, handler[wrappedSymbol] || handler);
        },
    );
  }
}

const wrapHttpEmitters = (req, res) => {
  const asyncResource = new AsyncResource('zipkin-tracer');
  wrapEmitter(req, asyncResource);
  wrapEmitter(res, asyncResource);
};

function readHeader(header: string) {
  const val = this[header];
  if (val != null) {
    return new Some(val);
  }
  return None;
}

export interface IFastifyOptions {
  tracer?: Tracer;
  endpoint?: string;
  serviceName: string;
  port: number;
}

export const fastifyZipkinPlugin = (fastify: FastifyInstance, options: IFastifyOptions, next) => {
  const { tracer, serviceName, port } = options;

  const instrumentation = new Instrumentation.HttpServer({
    tracer,
    serviceName: serviceName,
    port: port || 0,
  });

  let traceId: TraceId;

  fastify.addHook('onRequest', (req, reply, done) => {
    tracer.scoped(() => {
      traceId = instrumentation.recordRequest(req.raw.method, url.format(req.raw.url), readHeader.bind(req.headers));
      reply.header(TRACE_ID, traceId.traceId);
      als.run(traceId, () => {
        wrapHttpEmitters(req.raw, reply.raw || reply.request);
        done();
      });
    });
  });

  fastify.addHook('onResponse', (req, reply, done) => {
    tracer.letId(traceId, () => {
      instrumentation.recordResponse(traceId, String(reply.raw.statusCode));
    });
    done();
  });

  next();
};

fastifyZipkinPlugin[Symbol.for('skip-override')] = true;
fastifyZipkinPlugin[Symbol.for('fastify.display-name')] = pluginName;

export const getTraceId = () => als.getStore() && als.getStore()['traceId'];
export const getSpanId = () => als.getStore() && als.getStore()['spanId'];
