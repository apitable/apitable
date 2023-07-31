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

import { Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { SocketConstants } from 'shared/common/constants/socket.module.constants';
import { isBackendServer, isNestServer, isRoomConnect } from 'shared/helpers/socket.helper';
import { IAuthenticatedSocket } from 'socket/interface/socket/authenticated-socket.interface';
import { NestService } from 'socket/services/nest/nest.service';
import { RoomService } from 'socket/services/room/room.service';

@Injectable()
export class SocketIoService {
  private readonly logger = new Logger(SocketIoService.name);

  constructor(
    private readonly nestService: NestService,
    private readonly roomService: RoomService,
  ) { }

  public joinRoom(socket: IAuthenticatedSocket) {
    // nest-server room
    if (isNestServer(socket)) {
      void socket.join(SocketConstants.NEST_SERVER_PREFIX);
      void this.nestService.setSocket(socket);
    } else if (isBackendServer(socket)) {
      // java-server room
      void socket.join(SocketConstants.JAVA_SERVER_PREFIX);
    } else {
      // TODO: authentication
      // connection with user id joins room user room
      if (!isNil(socket.auth.userId)) {
        void socket.join(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      }
    }
  }

  public async leaveRoom(socket: IAuthenticatedSocket) {
    if (isNestServer(socket)) {
      void socket.leave(SocketConstants.NEST_SERVER_PREFIX);
      await this.nestService.removeSocket(socket);
    } else if (isBackendServer(socket)) {
      void socket.leave(SocketConstants.JAVA_SERVER_PREFIX);
    } else if (isRoomConnect(socket)) {
      await this.roomService.clientDisconnect(socket);
    } else {
      // exit the user room
      void socket.leave(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      this.logger.log({ message: 'SocketIoService:UserLeaveRoom', room: SocketConstants.USER_SOCKET_ROOM + socket.auth.userId, socketId: socket.id });
    }
  }
}
