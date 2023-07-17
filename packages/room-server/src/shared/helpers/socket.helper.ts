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

import { isNil } from '@nestjs/common/utils/shared.utils';
import { BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { GatewayConstants, SocketConstants } from 'shared/common/constants/socket.module.constants';
import { IAuthenticatedSocket } from 'socket/interface/socket/authenticated-socket.interface';

/**
 * to judge whether 'room' connection
 *
 * @param socket
 */
export const isRoomConnect = (socket: IAuthenticatedSocket): boolean => {
  return !isNil(socket.auth.cookie) && socket.id.includes(GatewayConstants.ROOM_NAMESPACE);
};

/**
 * to judge whether 'java' connection
 *
 * @param socket
 */
export const isBackendServer = (socket: IAuthenticatedSocket): boolean => {
  return !isNil(socket.auth.userId) && socket.auth.userId.includes(SocketConstants.JAVA_SERVER_PREFIX);
};

/**
 * to judge whether 'nest-server' connection
 *
 * @param socket
 */
export const isNestServer = (socket: IAuthenticatedSocket): boolean => {
  // 'room_' 'nest-server' The prefix of the userId passed to the application startup must be consistent
  return !isNil(socket.auth.userId) && socket.auth.userId.includes('room_');
};

/**
 * NestServer Ip
 */
export const getSocketServerAddr = (serverIp: string) => {
  return 'http://' + serverIp + ':' + BootstrapConstants.SERVER_PORT;
};