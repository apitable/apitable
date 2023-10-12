import { formatError, formatHttpRequest, formatHttpResponse, stringify, version } from '@elastic/ecs-helpers';
import { trace } from '@opentelemetry/api';
import fecha from 'fecha';
import { isEmpty } from 'lodash';
import { FormatWrap, TransformableInfo } from 'logform';
import { MESSAGE } from 'triple-beam';
import { format } from 'winston';

const reservedFields = {
  level: true,
  'log.level': true,
  ecs: true,
  '@timestamp': true,
  err: true,
  req: true,
  res: true,
};

// Create a Winston format for ecs-logging output.
//
// @param {Object} opts - Optional.
//    - {Boolean} opts.convertErr - Whether to convert a logged `err` field
//      to ECS error fields. Default true.
//    - {Boolean} opts.convertReqRes - Whether to convert logged `req` and `res`
//      HTTP request and response fields to ECS HTTP, User agent, and URL
//      fields. Default false.
function ecsTransform(
  info: TransformableInfo,
  opts: {
    convertErr?: boolean;
    convertReqRes?: boolean;
    format?: string | (() => string);
  }) {
  const { convertErr = true, convertReqRes = false } = opts || {};

  const ecsFields: any = {
    '@timestamp': typeof opts.format === 'function' ?
      opts.format() :
      fecha.format(new Date(), opts.format),
    'log.level': info.level,
    message: info.message,
    ecs: { version },
    // No apm integration, here we customize
    traceId: trace.getActiveSpan()?.spanContext()?.traceId,
    spanId: trace.getActiveSpan()?.spanContext()?.spanId,
  };

  // Add all unreserved fields.
  const keys = Object.keys(info);
  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i]!;
    if (!reservedFields[key]) {
      ecsFields[key] = info[key];
    }
  }

  if (!ecsFields['@timestamp']) {
    info['@timestamp'] = new Date().toISOString();
  }

  // https://www.elastic.co/guide/en/ecs/current/ecs-error.html
  if (info.err !== undefined) {
    if (convertErr) {
      formatError(ecsFields, info.err);
    } else {
      ecsFields.err = info.err;
    }
  }

  // https://www.elastic.co/guide/en/ecs/current/ecs-http.html
  if (info.req !== undefined) {
    if (convertReqRes) {
      formatHttpRequest(ecsFields, info.req);
    } else {
      ecsFields.req = info.req;
    }
  }
  if (info.res !== undefined) {
    if (convertReqRes) {
      formatHttpResponse(ecsFields, info.res);
    } else {
      ecsFields.res = info.res;
    }
  }

  info[MESSAGE as any] = stringify(ecsFields);
  return info;
}

export const escFormat: FormatWrap = format(ecsTransform);

export const tracingFormat: FormatWrap = format((info, _opts = {}) => {
  const tracingFields: any = {
    // No apm integration, here we customize
    traceId: trace.getActiveSpan()?.spanContext()?.traceId,
    spanId: trace.getActiveSpan()?.spanContext()?.spanId,
  };

  for (const key in tracingFields) {
    const value = tracingFields[key];
    if (!isEmpty(value)) {
      info[key] = value;
    }
  }

  return info;
});
