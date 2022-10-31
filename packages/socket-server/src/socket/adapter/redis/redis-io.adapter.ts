import { INestApplicationContext, Logger, WebSocketAdapter } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter, RedisAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import * as SocketIo from 'socket.io';
import { ipAddress } from 'src/socket/common/helper';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { RedisConstants } from 'src/socket/constants/redis-constants';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { SocketEventEnum } from 'src/socket/enum/socket.enum';
import { AuthenticatedSocket } from 'src/socket/interface/socket/authenticated-socket.interface';
import { redisConfig } from 'src/socket/service/redis/redis-config.factory';
import { SocketIoService } from 'src/socket/service/socket-io/socket-io.service';

export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(
    private readonly app: INestApplicationContext,
    private readonly socketIoService: SocketIoService
  ) {
    super(app);
  }

  createIOServer(port: number, options: SocketIo.ServerOptions): SocketIo.Server {
    this.logger.log(options);

    options.allowEIO3 = true;
    options.maxHttpBufferSize = 1e8;
    const _nestedLogger = this.logger;

    const server = super.createIOServer(port, options);
    // Change to single instance, because redis is not in cluster mode, pub/sub client will have bugs
    server.adapter(this.createRedisAdapter());

    // namespaces '/'
    server.of(GatewayConstants.SOCKET_NAMESPACE).use((socket: AuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId as string, cookie: socket.handshake.headers?.cookie };
      return next();
    });
    // namespaces 'room'
    server.of(GatewayConstants.ROOM_NAMESPACE).use((socket: AuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId as string, cookie: socket.handshake.headers?.cookie };
      return next();
    });
    // custom hook: return to current service sockets
    server.on(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, (roomIds: string[], cb: (arg0: any[]) => void) => {
      if (server._path !== GatewayConstants.ROOM_PATH) {
        return cb(null);
      }
      const rooms = server.of(GatewayConstants.ROOM_NAMESPACE).adapter.rooms;
      const socketIds = [];
      for (const roomId of roomIds) {
        if (rooms.has(roomId)) {
          socketIds.push(...rooms.get(roomId));
        }
      }
      _nestedLogger.log({ message: 'CLUSTER_SOCKET_ID_EVENT', ip: ipAddress(), socketIds });
      cb(socketIds);
    });

    // record error log
    server.of(GatewayConstants.SOCKET_NAMESPACE).adapter.on('error', function (error: any) {
      _nestedLogger.error(error.message, error?.stack);
    });
    server.of(GatewayConstants.ROOM_NAMESPACE).adapter.on('error', function (error: any) {
      _nestedLogger.error(error.message, error?.stack);
    });
    return server;
  }

  bindClientConnect(server: SocketIo.Server, callback: (socket: AuthenticatedSocket) => {}): void {
    server.on(SocketEventEnum.CONNECTION, (socket: AuthenticatedSocket) => {
      if (!isNil(socket.auth)) {
        this.logger.debug({ message: 'RedisIoAdapter:clientConnect', userId: socket.auth.userId, socketId: socket.id, nsp: socket.nsp.name });
        this.socketIoService.saveUserLanguage(socket);
        this.socketIoService.joinRoom(socket);
      } else {
        this.logger.warn({ message: 'RedisIoAdapter:bindClientConnect:invalidUserIdForAuth', handshake: socket.handshake });
        // Close the connection
        socket.disconnect();
      }
      callback(socket);
    });
  }

  bindClientDisconnect(socket: AuthenticatedSocket, callback: (socket: AuthenticatedSocket) => {}) {
    // Client disconnecting
    socket.on(SocketEventEnum.DISCONNECTING, args => {
      // Move out of the room, determine whether the number of people inside the room is empty, if the room is empty, delete the room
      this.logger.log({ message: 'RedisIoAdapter:clientDisconnecting', userId: socket.auth?.userId, socketId: socket.id, args });
      this.socketIoService.leaveRoom(socket);
    });
    // Client disconnect
    socket.on(SocketEventEnum.DISCONNECTION, args => {
      this.logger.warn({ message: 'RedisIoAdapter:clientDisconnect', userId: socket.auth?.userId, socketId: socket.id, args });
      socket.removeAllListeners('disconnect');
      callback(socket);
    });
  }

  async close(server: SocketIo.Server) {
    // close the sockets service
    try {
      server.close();
      return await Promise.resolve();
    } catch (e) {
      this.logger.error('RedisIoAdapter:close', e?.stack);
    }
  }

  private createRedisAdapter(): (nsp: any) => RedisAdapter {
    const pubClient = new Redis(redisConfig.useFactory(RedisConstants.REDIS_DB, RedisConstants.REDIS_PUBLISHER_CLIENT, RedisConstants.REDIS_PREFIX));
    const subClient = new Redis(redisConfig.useFactory(RedisConstants.REDIS_DB, RedisConstants.REDIS_SUBSCRIBER_CLIENT, RedisConstants.REDIS_PREFIX));
    const opts = {
      key: RedisConstants.CHANNEL_PREFIX,
      requestsTimeout: SocketConstants.SOCKET_REQUEST_TIMEOUT,
    };
    return createAdapter(pubClient, subClient, opts);
  }
}
