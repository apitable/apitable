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
import { getRequestLanguage, getValueFromCookie, isBackendServer, isNestServer, isRoomConnect } from '../../common/helper';
import { SocketConstants } from '../../constants/socket-constants';
import { USER_LANGUAGE } from '../../enum/redis-key.enum';
import { AuthenticatedSocket } from '../../interface/socket/authenticated-socket.interface';
import { NestService } from '../nest/nest.service';
import { RedisService } from '../redis/redis.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class SocketIoService {
  private readonly logger = new Logger(SocketIoService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly nestService: NestService,
    private readonly roomService: RoomService,
  ) { }

  public saveUserLanguage(socket: AuthenticatedSocket) {
    // filtered [java、nest-server、room] connection
    if (!isBackendServer(socket) && !isNestServer(socket) && !isRoomConnect(socket)) {
      const headers = socket.handshake.headers;
      let lang: string;
      if (!isNil(headers.cookie) && headers.cookie.includes(SocketConstants.SOCKET_COOKIE_LANGUAGE_KEY)) {
        lang = getValueFromCookie(headers.cookie, SocketConstants.SOCKET_COOKIE_LANGUAGE_KEY);
      } else {
        lang = getRequestLanguage(headers);
      }
      // store user client language in redis
      this.redisService.saveValue(USER_LANGUAGE.PREFIX + socket.auth.userId, lang, USER_LANGUAGE.EXPIRE);
    }
  }

  public joinRoom(socket: AuthenticatedSocket) {
    // nest-server room
    if (isNestServer(socket)) {
      socket.join(SocketConstants.NEST_SERVER_PREFIX);
      this.nestService.setSocket(socket);
    } else if (isBackendServer(socket)) {
      // java-server room
      socket.join(SocketConstants.JAVA_SERVER_PREFIX);
    } else {
      // TODO: authentication
      // connection with user id joins room user room
      if (!isNil(socket.auth.userId)) {
        socket.join(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      }
    }
  }

  public async leaveRoom(socket: AuthenticatedSocket) {
    if (isNestServer(socket)) {
      socket.leave(SocketConstants.NEST_SERVER_PREFIX);
      await this.nestService.removeSocket(socket);
    } else if (isBackendServer(socket)) {
      socket.leave(SocketConstants.JAVA_SERVER_PREFIX);
    } else if (isRoomConnect(socket)) {
      await this.roomService.clientDisconnect(socket);
    } else {
      // exit the user room
      socket.leave(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      this.logger.log({ message: 'SocketIoService:UserLeaveRoom', room: SocketConstants.USER_SOCKET_ROOM + socket.auth.userId, socketId: socket.id });
    }
  }
}
