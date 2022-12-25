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

export class GatewayConstants {
  public static readonly NOTIFICATION_PORT: number = parseInt(process.env.NOTIFICATION_PORT, 10) || 3002;
  public static readonly NOTIFICATION_PATH: string = '/notification';
  public static readonly API_PORT = parseInt(process.env.PORT, 10) || 3001;
  public static readonly SOCKET_NAMESPACE = '/';
  public static readonly ROOM_PORT: number = parseInt(process.env.ROOM_PORT, 10) || 3005;
  public static readonly ROOM_PATH: string = '/room';
  public static readonly ROOM_NAMESPACE: string = 'room';
  /**
   * ack timeout default 30000ms(30s)
   */
  public static readonly ACK_TIMEOUT = parseInt(process.env.ACK_TIMEOUT, 10) || 30000;

  public static readonly PING_TIMEOUT = parseInt(process.env.PING_TIMEOUT, 10) || 120000;

  public static readonly SOCKET_SERVER_NOTIFY_PATH = '/socket/notify';

  public static readonly GRPC_URL = process.env.GRPC_URL || '0.0.0.0:3007';

  public static readonly ROOM_SERVICE = 'ROOM_SERVICE';

  public static readonly BACKEND_SERVICE = 'BACKEND_SERVICE';

  public static readonly GRPC_PACKAGE = 'vika.grpc';

  public static readonly NEST_GRPC_PORT = 3334;

  public static readonly ROOM_GRPC_URL = process.env.NEST_GRPC_URL || '0.0.0.0:3334';

  public static readonly BACKEND_GRPC_URL = process.env.BACKEND_GRPC_URL || '0.0.0.0:8083';

  public static readonly GRPC_TIMEOUT_MAX_TIMES = parseInt(process.env.GRPC_TIMEOUT_MAX_TIMES, 10) || 3;
}
