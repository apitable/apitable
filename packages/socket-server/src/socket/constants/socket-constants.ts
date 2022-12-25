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

/**
 * gRPC MetaData Constant Key
 */
export const TRACE_ID = 'x-trace-id';
export const CHANGESETS_MESSAGE_ID = 'x-changesets-message-id';
export const CHANGESETS_CMD = 'x-changesets-cmd';

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
   * GrpcClientProxy health check mode（
   *    DEFAULT：socket regularly maintains room ip pool by itself；
   *    XXL_JOB：java XXL JOB scheduled task maintenance roomIp pool；
   * ）
   *
   *  @deprecated prepare to delete xxl job
   */
  public static readonly GRPC_CLIENT_PROXY_HEALTH_MODEL = process.env.HEALTH_MODEL || 'DEFAULT';

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

}
