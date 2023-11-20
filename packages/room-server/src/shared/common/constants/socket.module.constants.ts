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

import { CronExpression } from '@nestjs/schedule';

export class SocketConstants {
  public static readonly SOCKET_TYPES = ['CONNECT', 'DISCONNECT', 'EVENT', 'ACK', 'ERROR', 'BINARY_EVENT', 'BINARY_ACK'];

  public static readonly SOCKET_REQUEST_TIMEOUT = parseInt(process.env.SOCKET_REQUEST_TIMEOUT || '10000', 10);

  public static readonly JAVA_SERVER_PREFIX = 'java';

  public static readonly NEST_SERVER_PREFIX = 'nest_server';
  public static readonly USER_SOCKET_ROOM = 'user:';

  public static readonly SOCKET_COOKIE_LANGUAGE_KEY = 'vika-i18n';

  /**
   * space room prefix
   */
  public static readonly SPACE_ROOM_PREFIX = 'space:';

  /**
   * GRPC_OPTIONS gRPC parameter options
   */
  public static readonly GRPC_OPTIONS = {
    // Maximum message length a channel can send
    maxSendMessageLength: 1024 * 1024 * 100,
    // Maximum message length a channel can receive
    maxReceiveMessageLength: 1024 * 1024 * 100,

    // Channel (channel) strategy
    channelOptions: {
      // Minimum time between subsequent connection attempts, in milliseconds
      'grpc.min_reconnect_backoff_ms': 500,
      // Maximum time between subsequent connection attempts, in milliseconds
      'grpc.max_reconnect_backoff_ms': 15000,
    },

    // Watchdog Strategy
    keepalive: {
      // After this time, the client/server pings its peer to see if the transfer is still valid
      keepaliveTimeMs: 7200000,
      // After waiting this time, if the keepalive ping sender does not receive the ping ack, it will close the transmission
      keepaliveTimeoutMs: 10000,
      // Whether to allow keepalive ping to be sent without any outstanding streams
      keepalivePermitWithoutCalls: 0,
      // How many pings can we send before we need to send data/header frames
      http2MaxPingsWithoutData: 2,
    },

    // Retry strategy
    retryPolicy: {
      // Maximum number of attempts
      maxAttempts: parseInt(process.env.GRPC_RETRY_MAX_ATTEMPTS || '5', 10),
    },
  };

  public static readonly GRPC_DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH = 4 * 1024 * 1024;
  public static readonly GRPC_DEFAULT_MAX_SEND_MESSAGE_LENGTH = 4 * 1024 * 1024;

  // authentication token
  public static readonly AUTH_TOKEN = 'FutureIsComing';
}

export class GatewayConstants {
  public static readonly NOTIFICATION_PORT: number = parseInt(process.env.NOTIFICATION_PORT || '3002', 10);
  public static readonly NOTIFICATION_PATH: string = '/notification';
  public static readonly SOCKET_NAMESPACE = '/';
  public static readonly ROOM_PORT: number = parseInt(process.env.ROOM_PORT || '3005', 10);
  public static readonly ROOM_PATH: string = '/room';
  public static readonly ROOM_NAMESPACE: string = 'room';
  public static readonly DOCUMENT_PORT: number = parseInt(process.env.DOCUMENT_PORT || '3006', 10);

  /**
   * ack timeout default 30000ms(30s)
   */
  public static readonly ACK_TIMEOUT = parseInt(process.env.ACK_TIMEOUT || '30000', 10);

  public static readonly PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT || '120000', 10);

  public static readonly SOCKET_SERVER_NOTIFY_PATH = '/socket/notify';

}

export class HealthConstants {
  public static readonly NEST_HEALTH_CHECK_CRON_EXPRESSION = process.env.NEST_HEALTH_CHECK_CRON_EXPRESSION || CronExpression.EVERY_5_SECONDS;
  public static readonly NEST_HEALTH_CHECK_TIMEOUT = parseInt(process.env.NEST_HEALTH_CHECK_TIMEOUT || '1500', 10);

  public static readonly ROOM_MAX_OFFLINE_TIMES: number = parseInt(process.env.GRPC_TIMEOUT_MAX_TIMES || '20', 10);
}

export class RedisConstants {
  public static readonly CONNECT_TIMEOUT = 15000;
  public static readonly RE_CONNECT_MAX_TIMES = 10;
  public static readonly REDIS_CLIENT = 'REDIS_COMMON_CLIENT';
  public static readonly REDIS_PUBLISHER_CLIENT = 'REDIS_PUBLISHER_CLIENT';
  public static readonly REDIS_SUBSCRIBER_CLIENT = 'REDIS_SUBSCRIBER_CLIENT';
  public static readonly REDIS_PREFIX = 'apitable:';
  // redis config factory
  public static readonly REDIS_CONFIG = 'REDIS_CONFIG';

  // socket.io-adapter of key
  public static readonly CHANNEL_PREFIX_ENV = process.env.WEB_SOCKET_CHANNEL_ENV || 'local';
  public static readonly CHANNEL_PREFIX = 'vika-' + this.CHANNEL_PREFIX_ENV;

  // public static readonly VIKA_NEST_LOAD_HEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':health:%s';
  // public static readonly VIKA_NEST_LOAD_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV;
  // public static readonly VIKA_NEST_LOAD_UNHEALTH_KEY = 'load:nest:' + process.env.WEB_SOCKET_CHANNEL_ENV + ':unhealth:%s';

  public static readonly ROOM_POOL_LOAD_KEY = 'load:room_pool:' + this.CHANNEL_PREFIX_ENV;
  public static readonly ROOM_POOL_LOAD_HEALTHY_KEY = 'load:room_pool:' + this.CHANNEL_PREFIX_ENV + ':healthy';
  public static readonly ROOM_POOL_LOAD_UNHEALTHY_KEY = 'load:room_pool:' + this.CHANNEL_PREFIX_ENV + ':unhealthy';

  public static readonly ROOM_POOL_CHANNEL = 'apitable:room_pool:' + this.CHANNEL_PREFIX_ENV;
}