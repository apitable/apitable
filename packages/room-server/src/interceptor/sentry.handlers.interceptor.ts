import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { isString } from '@sentry/utils';
import { Transaction } from '@sentry/types';
import { extractTraceparentData, SpanStatus } from '@sentry/tracing';
import { getCurrentHub, startTransaction } from '@sentry/core';
import { Observable } from 'rxjs';
import http from 'http';
import { status, Metadata } from '@grpc/grpc-js';
import { Http2ServerCallStream } from '@grpc/grpc-js/build/src/server-call';

/**
 * Sentry Http Tracing 拦截器
 * 用来自定义Tracing信息来跟踪性能
 */
@Injectable()
export class TracingHandlerInterceptor implements NestInterceptor {
  intercept(host: ExecutionContext, next: CallHandler): Observable<any> {
    if (host.getType() === 'http') {
      const httpCtx = host.switchToHttp();
      const req = httpCtx.getRequest();
      const res = httpCtx.getResponse();
      const mapping = {
        method: req?.context?.config?.method,
        url: req?.raw?.url,
        path: req?.context?.config?.url
      };
      httpTracingHandler(req.raw, res.raw, req.user, mapping);
    } else if (host.getType() === 'rpc') {
      const rpcCtx = host.switchToRpc();
      const rpcData = rpcCtx.getData();
      const rpcContext = rpcCtx.getContext();
      const rpcServerUnary = host.getArgByIndex(2);
      if (rpcServerUnary) {
        const { call: serverUnaryCall, call: { stream: serverHttp2Stream }} = rpcServerUnary;
        const mapping = {
          method: serverUnaryCall?.handler?.type,
          path: serverUnaryCall?.handler?.path,
          address: serverHttp2Stream?.session?.server?.address()
        };
        grpcTracingHandler(rpcData, rpcContext, serverUnaryCall, mapping);
      }
    }
    return next.handle();
  }
}

/**
 * tracing handler.
 * @see reference as `Sentry.Handlers.tracingHandler`
 */
function httpTracingHandler(req: http.IncomingMessage, res: http.ServerResponse, user: any, mapping: any): void {
  // If there is a trace header set, we extract the data from it (parentSpanId, traceId, and sampling decision)
  let traceparentData;
  if (req.headers && isString(req.headers['sentry-trace'])) {
    traceparentData = extractTraceparentData(req.headers['sentry-trace'] as string);
  }

  const extractRequestData = Sentry.Handlers.extractRequestData(req);
  const transaction = startTransaction(
    {
      name: extractExpressTransactionName(mapping, { method: true, path: true }),
      op: 'http.server',
      ...traceparentData,
    },
    { request: extractRequestData },
  );

  const currentUser = user ? { username: user.nikeName, uuid: user.uuid } : { username: 'anonymousUser' };

  // We put the transaction on the scope so users can attach children to it
  getCurrentHub().configureScope(scope => {
    scope.clear().setSpan(transaction)
      .setUser(currentUser)
      .setTag('url', extractRequestData.url)
      .setContext('Request', extractRequestData);
  });

  // We also set __sentry_transaction on the response so people can grab the transaction there to add
  // spans to it later.
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  (res as any).__sentry_transaction = transaction;

  res.once('finish', () => {
    setImmediate(() => {
      addExpressReqToTransaction(transaction, req, mapping);
      transaction.setHttpStatus(res.statusCode)
        .finish();
    });
  });
}

function grpcTracingHandler(data: any, context: Metadata, serverUnaryCall: Http2ServerCallStream<any, any>, mapping: any): void {
  const rpcData = extractRpcData({ ...data, ...context, ...mapping });
  const transaction = startTransaction(
    {
      name: extractExpressTransactionName(mapping, { method: true, path: true }),
      op: 'rpc.server',
    },
    {
      request: rpcData
    },
  );

  getCurrentHub().configureScope(scope => {
    scope.clear().setSpan(transaction)
      .setContext('Request', rpcData);
  });

  serverUnaryCall.once('callEnd', (code: status) => {
    setImmediate(() => {
      transaction.setTag('grpc.status_code', code)
        .setStatus(code === status.OK ? SpanStatus.Ok : SpanStatus.UnknownError)
        .finish();
    });
  });
}

function addExpressReqToTransaction(transaction: Transaction | undefined, req: Sentry.Handlers.ExpressRequest, mapping: any): void {
  if (!transaction) return;
  transaction.name = extractExpressTransactionName(mapping, { method: true, path: true });
  transaction.setData('url', req.originalUrl);
  transaction.setData('baseUrl', req.baseUrl);
  transaction.setData('query', req.query);
}

function extractExpressTransactionName(
  mapping: { method: string; url: string; path: string },
  options: { method?: boolean; url?: boolean; path?: boolean } = {},
): string {
  const method = mapping.method?.toUpperCase();

  let info = '';
  if (options.method && method) {
    info += method;
  }

  if (options.method && options.path && mapping.path) {
    info += ` ${mapping.path}`;
  } else if (options.method && options.url && mapping.url) {
    info += ` ${mapping.url}`;
  }
  return info;
}

const DEFAULT_REQUEST_KEYS = ['userAgent', 'cookies', 'requestType', 'roomId', 'address'];

function extractRpcData(
  req: { [key: string]: any },
  keys: string[] = DEFAULT_REQUEST_KEYS
): { [key: string]: any } {
  const requestData: { [key: string]: any } = {};
  keys.forEach(key => {
    switch (key) {
      case 'userAgent':
        requestData.userAgent = req?.internalRepr?.get('user-agent') || '';
        break;
      case 'cookies':
        requestData.cookies = req.cookie || '';
        break;
      case 'requestType':
        requestData.requestType = req.type || '';
        break;
      case 'roomId':
        requestData.roomId = req.roomId || '';
        break;
      default:
        if ({}.hasOwnProperty.call(req, key)) {
          requestData[key] = (req as { [key: string]: any })[key] || '';
        }
    }
  });
  return requestData;
}