import { Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { getRequestLanguage, getValueFromCookie, isBackendServer, isNestServer, isRoomConnect } from 'src/socket/common/helper';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { USER_LANGUAGE } from 'src/socket/enum/redis-key.enum';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
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
