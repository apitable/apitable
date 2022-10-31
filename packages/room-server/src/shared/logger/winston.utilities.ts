import { Format } from 'logform';
import { format } from 'winston';
import safeStringify from 'fast-safe-stringify';
import dayjs from 'dayjs';
import { currentAppInstanceId, isDevMode } from 'app.environment';
import { getSpanId, getTraceId } from '../helpers/fastify.zipkin.plugin';

/**
 * Custom format
 */
const nestLikeConsoleFormat = (appName = 'RoomServer'): Format =>
  format.printf(({ context, level, timestamp, message, ...meta }) => {
    // Select color based on level
    // const color = nestLikeColorScheme[level] || ((text: string): string => text);
    const traceId = getTraceId();
    const spanId = getSpanId();
    const title = isDevMode ? '<Local Log>' : 'Log';
    return (
      `${title} >>> ${appName} ` +
      `${level.charAt(0).toUpperCase() + level.slice(1)} ` +
      (currentAppInstanceId != 0 ? `${currentAppInstanceId} ` : '') +
      (spanId ? `SpanId[${spanId}] ` : '') +
      (traceId ? `TraceId[${traceId}] ` : '') +
      ('undefined' !== typeof timestamp ? `${dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss.SSS')} ` : '') +
      ('undefined' !== typeof context ? `${context} ` : '') +
      `${message} ` +
      `- ${safeStringify(meta)}`
    );
  });

export const utilities = {
  format: {
    nestLike: nestLikeConsoleFormat,
  },
};
