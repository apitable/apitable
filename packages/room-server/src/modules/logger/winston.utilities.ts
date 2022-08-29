import { Format } from 'logform';
import { format } from 'winston';
import safeStringify from 'fast-safe-stringify';
import dayjs from 'dayjs';
import { currentAppInstanceId, isDevMode } from 'app.environment';
import { getSpanId, getTraceId } from '../../helpers/fastify.zipkin.plugin';

// 自定义格式
const nestLikeConsoleFormat = (appName = 'RoomServer'): Format =>
  format.printf(({ context, level, timestamp, message, ...meta }) => {
    // 根据级别选择颜色
    // const color = nestLikeColorScheme[level] || ((text: string): string => text);
    const traceId = getTraceId();
    const spanId = getSpanId();
    const title = isDevMode ? '「本地日志」' : 'Log';
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
