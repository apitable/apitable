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

/*
 * Define the configuration required for the bootloader
 *
 * Usually store IP, port etc...
 */
export class BootstrapConstants {
  /*
   * The port on which the service starts listening，
   * Under `dual-mode` boot, the service port preference is 3333
   *
   *
   * For the explanation of the service port
   * 3333（default） : This port is used for both `dual-mode` boot and separate `room server` boot
   * 3001 : This port is used to start the `socket server` separately
   */
  public static readonly SERVER_PORT: number = parseInt(process.env.SERVER_PORT || '3333', 10);

  public static readonly ROOM_GRPC_PORT: number = parseInt(process.env.ROOM_GRPC_PORT!) || 3334;

  /**
   * Please use ROOM_GRPC_URL.
   *
   * NEST_GRPC_URL is reserved only for compatibility with private version environments.
   */
  public static readonly ROOM_GRPC_URL: string = process.env.ROOM_GRPC_URL || process.env.NEST_GRPC_URL || '0.0.0.0:3334';

  public static readonly SOCKET_GRPC_URL: string = process.env.SOCKET_GRPC_URL || '0.0.0.0:3007';

  /**
   * Please use BACKEND_GRPC_URL.
   *
   * SOCKET_BACKEND_GRPC_URL is reserved only for compatibility with private version environments.
   */
  public static readonly BACKEND_GRPC_URL: string = process.env.BACKEND_GRPC_URL || process.env.SOCKET_BACKEND_GRPC_URL || '0.0.0.0:8083';

}

/*
 * application type, could be one of the following
 */
export type ApplicationType =
  /** full functionality（default） **/
  | 'ROOM_SERVER'
  /** fusion API only **/
  | 'FUSION_SERVER'
  /** socket server（Data Collaboration Middleware） **/
  | 'SOCKET_SERVER'
  /** rest API only **/
  | 'NEST_REST_SERVER'
  /** schedule only **/
  | 'SCHEDULE_SERVER'
  /** document collaboration only **/
  | 'DOCUMENT_SERVER';

export const APPLICATION_NAME: ApplicationType = (process.env.APPLICATION_NAME || 'ROOM_SERVER') as ApplicationType;
