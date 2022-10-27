import { Injectable } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { getRequestLanguage, getValueFromCookie, isBackendServer, isRoomConnect, isNestServer, logger } from 'src/socket/common/helper';
import { USER_LANGUAGE } from 'src/socket/enum/redis-key.enum';
import { RedisService } from '../redis/redis.service';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { NestService } from '../nest/nest.service';
import { RoomService } from '../room/room.service';

@Injectable()
export class SocketIoService {
  constructor(
    private readonly redisService: RedisService,
    private readonly nestService: NestService,
    private readonly roomService: RoomService,
  ) { }
  /**
   * @param userId
   * @param headers
   * @return
   * @author zoe
   * @date 2020/5/14 2:35 下午
   */
  public saveUserLanguage(socket: AuthenticatedSocket) {
    // 过滤掉java、nest-server、room 的连接
    if (!isBackendServer(socket) && !isNestServer(socket) && !isRoomConnect(socket)) {
      const headers = socket.handshake.headers;
      let lang: string;
      if (!isNil(headers.cookie) && headers.cookie.includes(SocketConstants.SOCKET_COOKIE_LANGUAGE_KEY)) {
        lang = getValueFromCookie(headers.cookie, SocketConstants.SOCKET_COOKIE_LANGUAGE_KEY);
      } else {
        lang = getRequestLanguage(headers);
      }
      // 在redis里面存入用户客户端语言
      this.redisService.saveValue(USER_LANGUAGE.PREFIX + socket.auth.userId, lang, USER_LANGUAGE.EXPIRE);
    }
  }

  /**
   *
   * 加入房间
   *
   * @param socket
   * @return
   * @author Zoe Zheng
   * @date 2020/6/24 9:06 下午
   */
  public joinRoom(socket: AuthenticatedSocket) {
    // nest-server 的房间
    if (isNestServer(socket)) {
      socket.join(SocketConstants.NEST_SERVER_PREFIX);
      this.nestService.setSocket(socket);
    } else if (isBackendServer(socket)) {
      // java-server的房间
      socket.join(SocketConstants.JAVA_SERVER_PREFIX);
    } else {
      // todo 鉴权
      // 有userId的连接加入房间用户房间
      if (!isNil(socket.auth.userId)) {
        socket.join(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      }
    }
  }

  /**
   *
   * 离开房间
   *
   * @param socket
   * @return
   * @author Zoe Zheng
   * @date 2020/6/24 9:06 下午
   */
  public async leaveRoom(socket: AuthenticatedSocket) {
    if (isNestServer(socket)) {
      socket.leave(SocketConstants.NEST_SERVER_PREFIX);
      await this.nestService.removeSocket(socket);
    } else if (isBackendServer(socket)) {
      socket.leave(SocketConstants.JAVA_SERVER_PREFIX);
    } else if (isRoomConnect(socket)) {
      await this.roomService.clientDisconnect(socket);
    } else {
      // 退出用户的房间
      socket.leave(SocketConstants.USER_SOCKET_ROOM + socket.auth.userId);
      logger('SocketIoService:UserLeaveRoom').log({ room: SocketConstants.USER_SOCKET_ROOM + socket.auth.userId, socketId: socket.id });
    }
  }
}
