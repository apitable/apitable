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

import { INestApplicationContext, Logger, WebSocketAdapter } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter, RedisAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { GatewayConstants, RedisConstants, SocketConstants } from 'shared/common/constants/socket.module.constants';
import { SocketEventEnum } from 'shared/enums/socket.enum';
import { getIPAddress } from 'shared/helpers/system.helper';
import * as SocketIo from 'socket.io';
import { IAuthenticatedSocket } from 'socket/interface/socket/authenticated-socket.interface';
import { redisConfig } from 'socket/services/redis/redis-config.factory';
import { SocketIoService } from 'socket/services/socket-io/socket-io.service';

export class RedisIoAdapter extends IoAdapter implements WebSocketAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(
    app: INestApplicationContext,
    private readonly socketIoService: SocketIoService
  ) {
    super(app);
  }

  override createIOServer(port: number, options: SocketIo.ServerOptions): SocketIo.Server {
    this.logger.log(options);

    options.allowEIO3 = true;
    options.maxHttpBufferSize = 1e8;
    const _nestedLogger = this.logger;

    const server = super.createIOServer(port, options);
    // Change to single instance, because redis is not in cluster mode, pub/sub client will have bugs
    server.adapter(this.createRedisAdapter());

    // namespaces '/'
    server.of(GatewayConstants.SOCKET_NAMESPACE).use((socket: IAuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId as string, cookie: socket.handshake.headers?.cookie! };
      return next();
    });
    // namespaces 'room'
    server.of(GatewayConstants.ROOM_NAMESPACE).use((socket: IAuthenticatedSocket, next: any) => {
      socket.auth = { userId: socket.handshake.query?.userId as string, cookie: socket.handshake.headers?.cookie! };
      return next();
    });
    // custom hook: return to current service sockets
    server.of(GatewayConstants.ROOM_NAMESPACE).on(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, (roomIds: string[], cb: (arg0: any[]) => void) => {
      if (server._path !== GatewayConstants.ROOM_PATH) {
        // @ts-ignore
        return cb(null);
      }
      const rooms = server.of(GatewayConstants.ROOM_NAMESPACE).adapter.rooms;
      const socketIds = [];
      for (const roomId of roomIds) {
        if (rooms.has(roomId)) {
          socketIds.push(...rooms.get(roomId));
        }
      }
      _nestedLogger.log({ message: 'CLUSTER_SOCKET_ID_EVENT', ip: getIPAddress(), socketIds });
      cb(socketIds);
    });

    // record error log
    server.of(GatewayConstants.SOCKET_NAMESPACE).adapter.on('error', function(error: any) {
      _nestedLogger.error(error.message, error?.stack);
    });
    server.of(GatewayConstants.ROOM_NAMESPACE).adapter.on('error', function(error: any) {
      _nestedLogger.error(error.message, error?.stack);
    });
    return server;
  }

  override bindClientConnect(server: SocketIo.Server, callback: (socket: IAuthenticatedSocket) => {}): void {
    server.on(SocketEventEnum.CONNECTION, (socket: IAuthenticatedSocket) => {
      if (!isNil(socket.auth)) {
        this.logger.debug({ message: 'RedisIoAdapter:clientConnect', userId: socket.auth.userId, socketId: socket.id, nsp: socket.nsp.name });
        this.socketIoService.joinRoom(socket);
      } else {
        this.logger.warn({ message: 'RedisIoAdapter:bindClientConnect:invalidUserIdForAuth', handshake: socket.handshake });
        // Close the connection
        socket.disconnect();
      }
      callback(socket);
    });
  }

  override bindClientDisconnect(socket: IAuthenticatedSocket, callback: (socket: IAuthenticatedSocket) => {}) {
    // Client disconnecting
    socket.on(SocketEventEnum.DISCONNECTING, async args => {
      // Move out of the room, determine whether the number of people inside the room is empty, if the room is empty, delete the room
      this.logger.log({ message: 'RedisIoAdapter:clientDisconnecting', userId: socket.auth?.userId, socketId: socket.id, args });
      await this.socketIoService.leaveRoom(socket);
    });
    // Client disconnect
    socket.on(SocketEventEnum.DISCONNECTION, args => {
      this.logger.warn({ message: 'RedisIoAdapter:clientDisconnect', userId: socket.auth?.userId, socketId: socket.id, args });
      socket.removeAllListeners('disconnect');
      callback(socket);
    });
  }

  override async close(server: SocketIo.Server): Promise<void> {
    // close the sockets service
    try {
      server.close();
      return await Promise.resolve();
    } catch (e) {
      this.logger.error('RedisIoAdapter:close', (e as Error)?.stack);
    }
  }

  private createRedisAdapter(): (nsp: any) => RedisAdapter {
    const pubClient = new Redis(redisConfig.useFactory(RedisConstants.REDIS_PUBLISHER_CLIENT, RedisConstants.REDIS_PREFIX));
    const subClient = new Redis(redisConfig.useFactory(RedisConstants.REDIS_SUBSCRIBER_CLIENT, RedisConstants.REDIS_PREFIX));
    const opts = {
      key: RedisConstants.CHANNEL_PREFIX,
      requestsTimeout: SocketConstants.SOCKET_REQUEST_TIMEOUT,
    };
    return createAdapter(pubClient, subClient, opts);
  }
}
