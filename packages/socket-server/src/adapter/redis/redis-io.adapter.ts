import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplicationContext, WebSocketAdapter } from '@nestjs/common';
import * as SocketIo from 'socket.io';
import { AuthenticatedSocket } from 'src/interface/socket/authenticated-socket.interface';
import * as SocketIORedis from 'socket.io-redis';
import { SocketEventEnum } from 'src/enum/socket.enum';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ipAddress, logger } from 'src/common/helper';
import { GatewayConstants } from 'src/constants/gateway.constants';
import { SocketIoService } from 'src/service/socket-io/socket-io.service';
import { socketConfig } from 'src/service/socket-io/socket_config.factory';

export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  constructor(private readonly app: INestApplicationContext, private readonly socketIoService: SocketIoService) {
    super(app);
  }

  createIOServer(port: number, options: SocketIo.ServerOptions = {}): SocketIo.Server {
    const server = super.createIOServer(port, options);
    // 改为单实例，因为redis不是集群模式，pub/sub client会有bug
    server.adapter(SocketIORedis(socketConfig.useFactory()));
    // 命名空间 /
    server.of(GatewayConstants.SOCKET_NAMESPACE).use(async (socket: AuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId, cookie: socket.handshake.headers?.cookie };
      return next();
    });
    // 命名空间 room
    server.of(GatewayConstants.ROOM_NAMESPACE).use(async (socket: AuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId, cookie: socket.handshake.headers?.cookie };
      return next();
    });
    // 自定义Hook, 返回当前服务 sockets
    server.of(GatewayConstants.ROOM_NAMESPACE).adapter.customHook = (roomIds, cb) => {
      if (server._path !== GatewayConstants.ROOM_PATH) {
        return cb(null);
      }
      const rooms = server.of(GatewayConstants.ROOM_NAMESPACE).adapter.rooms;
      const socketIds = [];
      for (const roomId of roomIds) {
        if (rooms[roomId]?.length) {
          socketIds.push(...Object.keys(rooms[roomId].sockets));
        }
      }
      logger('CustomHook').log({ ip: ipAddress(), socketIds });
      cb(socketIds);
    }
    logger('createIOServer').log(options);
    // 记录日志
    server.of(GatewayConstants.SOCKET_NAMESPACE).adapter.on('error', function(error: any) {
      logger('serverError').error(error);
    });
    server.of(GatewayConstants.ROOM_NAMESPACE).adapter.on('error', function(error: any) {
      logger('serverError').error(error);
    });
    return server;
  }

  public bindClientConnect(server: SocketIo.Server, callback: (socket: AuthenticatedSocket) => {}): void {
    server.on(SocketEventEnum.CONNECTION, (socket: AuthenticatedSocket) => {
      if (!isNil(socket.auth)) {
        logger('RedisIoAdapter:clientConnect').debug({ userId: socket.auth.userId, socketId: socket.id, nsp: socket.nsp.name });
        this.socketIoService.saveUserLanguage(socket);
        this.socketIoService.joinRoom(socket);
      } else {
        logger('RedisIoAdapter:bindClientConnect').error(socket.handshake, 'invalidUserIdForAuth');
        // 关闭连接
        socket.disconnect();
      }
      callback(socket);
    });
  }

  async bindClientDisconnect(socket: AuthenticatedSocket, callback: (socket: AuthenticatedSocket) => {}) {
    // 客户端断开连接
    socket.on(SocketEventEnum.DISCONNECTING, args => {
      // 移出房间，判断房间里面的人数是否为空，如果房间空了，删除房间
      logger('RedisIoAdapter:clientDisconnecting').log({ userId: socket.auth?.userId, socketId: socket.id, args });
      this.socketIoService.leaveRoom(socket);
    });
    // 客户端断开连接
    socket.on(SocketEventEnum.DISCONNECTION, args => {
      logger('RedisIoAdapter:clientDisconnect').log({ userId: socket.auth?.userId, socketId: socket.id, args });
      socket.removeAllListeners('disconnect');
      callback(socket);
    });
  }

  close(server: SocketIo.Server) {
    // 关闭sockets服务
    try {
      server.close();
    } catch (e) {
      // namespace会传入路由，没有关闭的属性
      logger('RedisIoAdapter:close').error(e.message, e);
    }
  }
}
