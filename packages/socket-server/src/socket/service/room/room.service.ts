import { MetadataValue } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { Socket } from 'socket.io';
import { NestClient } from 'src/grpc/client/nest.client';
import { Retryable } from 'src/grpc/util/retry.decorator';
import { initGlobalGrpcMetadata } from 'src/grpc/util/utils';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { CHANGESETS_CMD, CHANGESETS_MESSAGE_ID, SocketConstants, TRACE_ID } from 'src/socket/constants/socket-constants';
import { BroadcastTypes } from 'src/socket/enum/broadcast-types.enum';
import { RequestTypes } from 'src/socket/enum/request-types.enum';
import { ServerErrorCode, SocketEventEnum } from 'src/socket/enum/socket.enum';
import { FieldPermissionChangeRo } from 'src/socket/model/ro/datasheet/datasheet.ro';
import { NodeShareDisableRo } from 'src/socket/model/ro/node/node.ro';
import { NestService } from '../nest/nest.service';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    private readonly nestService: NestService,
    private readonly nestClient: NestClient,
  ) {
  }

  async clientDisconnect(socket: Socket) {
    const rooms = socket.rooms;
    if (rooms.size == 0) {
      return;
    }
    for (const room of rooms) {
      // avoid multi-node errors and filter out nest-server rooms
      if (room == SocketConstants.NEST_SERVER_PREFIX || room.startsWith(GatewayConstants.ROOM_PATH)) {
        continue;
      }
      const socketsIds = socket.nsp.adapter.rooms.get(room);
      // notify the user's room that the client has left
      if (socketsIds.has(socket.id)) {
        this.leaveRoom({ roomId: room }, socket);
      }
    }
    // notify nest server actions
    await this.nestClient.leaveRoom(this.injectMessage(socket, { clientId: socket.id }), initGlobalGrpcMetadata());
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: (args) => { return { clientId: args[0]?.clientId }; },
      extra: (args) => { return { roomId: args[0]?.roomId, clientId: args[0]?.clientId, cookie: args[0]?.cookie }; },
    },
    callback: () => ({ code: ServerErrorCode.NetworkError, success: false, message: 'Network Error' }),
  })
  async watchRoom(message: any, socket: Socket, server?: any): Promise<any | null> {
    const room = message.roomId;
    const createTime = Date.now();
    const isExistRoom = socket.rooms.has(room);
    const _grpcMetadata = initGlobalGrpcMetadata();
    const traceId = _grpcMetadata.get(TRACE_ID)[0];

    this.logger.log({
      action: 'WatchRoom',
      traceId: traceId,
      message: `WatchRoom Start roomId:[${message.roomId}]`
    });

    if (isExistRoom) {
      this.logger.log(`traceId[${traceId}] User are already in room，
      socketId: ${socket.id} has already in room: ${JSON.stringify(socket.rooms[room])}`);
    }
    // notifies nest-server to handle `WatchRoom` messages
    const result = await this.nestClient.watchRoom(this.injectMessage(socket, message, true, true), _grpcMetadata);

    if ('success' in result && result.success) {
      // 当 client 在 room 中不存在的时候，进行 join 和 userEnter 的广播
      if (!isExistRoom) {
        socket.join(room);
        this.logger.log({ room, socketId: socket.id, message: `traceId[${traceId}] User are join in room` });
        // 通知客户端所有连接新用户加入房间
        socket.broadcast.to(room).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
          collaborators: [{
            socketId: socket.id,
            createTime, ...result.data.collaborator,
          }],
        });
        result.data.collaborator = undefined;

        // 调用异步的 customRequest，获取给其他节点的协同者，广播该客户端新用户和加入房间的消息
        this.complementaryCollaborator(server, message, socket, result.data.spaceId);
      }
    } else if (isExistRoom) {
      // 鉴权失败，且已存在 room 中，断开连接
      await this.leaveRoom({ roomId: room }, socket);
    }

    const endTime = +new Date();
    this.logger.log({
      action: 'WatchRoom',
      traceId: traceId,
      ms: endTime - createTime,
      message: `WatchRoom End roomId:[${message.roomId}] Success，total time: ${endTime - createTime}ms`
    });
    return result;
  }

  private complementaryCollaborator(server: any, message: any, socket: Socket, spaceId: string) {
    // get all rooms of the datasheet resource
    const roomIds = [message.roomId];
    // custom request to get multiple service node pod sockets
    server.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async (_err: any, replies: string | any[]) => {
      this.logger.log({ message: 'WatchRoom:ServerSideEmit', replies });
      // no room connection return directly
      if (!replies.length) {
        return;
      }
      const socketIds = [];
      for (const ids of replies) {
        if (ids?.length > 0) {
          socketIds.push(...ids);
        }
      }
      // no client connection return directly
      if (!socketIds.length) {
        return;
      }
      const _grpcMetadata = initGlobalGrpcMetadata();
      const _message = this.injectMessage(socket, message, true, true);
      _message.socketIds = [...new Set([..._message.socketIds, ...socketIds])];
      _message.spaceId = spaceId;
      const result = await this.nestClient.getActiveCollaborators(_message, _grpcMetadata);
      socket.broadcast.to(socket.id).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
        collaborators: result.data?.collaborators || [],
      });
    });
  }

  async leaveRoom(message: any, socket: Socket): Promise<boolean> {
    const room = message.roomId;
    // to prevent when you are the only one, disconnection will report an error
    if (socket.nsp.adapter.rooms.has(room)) {
      socket.leave(room);
      await socket.broadcast.to(room).emit(BroadcastTypes.DEACTIVATE_COLLABORATOR, { socketId: socket.id, ...message });
      this.logger.log({ message: 'User are leave room', room, socketId: socket.id });
    }
    return Promise.resolve(true);
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: (args) => { return { clientId: args[0]?.clientId }; },
      extra: (args) => { return { roomId: args[0]?.roomId, clientId: args[0]?.clientId, cookie: args[0]?.cookie }; },
    },
    callback: () => ({ code: ServerErrorCode.ServerError, success: false, message: 'Server Error' }),
  })
  async roomChange(message: any, socket: Socket): Promise<any> {
    const createTime = Date.now();
    const room = message.roomId;
    const _grpcMetadata = initGlobalGrpcMetadata(this.changesetToGrpcMeta(message.changesets));
    const traceId = _grpcMetadata.get(CHANGESETS_MESSAGE_ID)[0];

    this.logger.log({
      action: 'RoomChange',
      traceId: traceId,
      message: `RoomChange Start roomId:[${message.roomId}]`
    });

    // notifies nest-server to handle `RoomChange` messages
    const result = await this.nestClient.roomChange(this.injectMessage(socket, message, true), _grpcMetadata);
    if ('success' in result && result.success) {
      const changesets = this.broadcastServerChange(room, result.data, socket);
      result.data = { changesets };
    }

    const endTime = +new Date();
    this.logger.log({
      action: 'RoomChange',
      traceId: traceId,
      ms: endTime - createTime,
      message: `RoomChange End roomId:[${message.roomId}] Success，total time: ${endTime - createTime}ms`
    });
    return result;
  }

  broadcastServerChange(roomId: string, results: any, server: any): any[] {
    // traverse and broadcast to rooms where each resource has changed
    const roomToCsMap = new Map<string, any[]>();
    for (const result of results) {
      for (const roomId of result.roomIds) {
        if (roomToCsMap.has(roomId)) {
          roomToCsMap.set(roomId, [...roomToCsMap.get(roomId), ...[result.changeset]]);
        } else {
          roomToCsMap.set(roomId, [result.changeset]);
        }
      }
    }
    for (const [roomId, changesets] of roomToCsMap.entries()) {
      server.to(roomId).emit(BroadcastTypes.SERVER_ROOM_CHANGE, {
        changesets,
        type: BroadcastTypes.SERVER_ROOM_CHANGE,
      });
    }
    return roomToCsMap.get(roomId);
  }

  moveCursor(message: any, socket: Socket) {
    const { datasheetId, ...rest } = message;
    const data = {
      type: RequestTypes.ENGAGEMENT_CURSOR,
      socketId: socket.id,
      cursorInfo: {
        datasheetId,
        ...rest,
      },
    };
    socket.broadcast.to(datasheetId).emit(BroadcastTypes.ENGAGEMENT_CURSOR, data);
  }

  /**
   * bind client information to message
   *
   * @param socket socket connection information
   * @param message message sent by client
   * @param isNeedCookie whether cookie information is required
   */
  private injectMessage(socket: Socket, message: any, isNeedCookie = false, isNeedSocketIds = false): any {
    if (isNeedCookie) {
      message.cookie = socket.handshake.headers.cookie;
    }
    message.clientId = socket.id;
    if (!isNil(message.roomId) && isNeedSocketIds) {
      if (socket.nsp.adapter.rooms.has(message.roomId)) {
        message.socketIds = [...[socket.id], ...Object.keys(socket.nsp.adapter.rooms.get(message.roomId))];
      } else {
        message.socketIds = [socket.id];
      }
    }
    return message;
  }

  /**
   * Node sharing is turned off
   */
  async broadcastNodeShareDisabled(server: any, message: NodeShareDisableRo[]) {
    // there is no communication room return directly
    if (!Object.keys(server.sockets).length) {
      return;
    }

    await message.map(ro => {
      server.to(ro.nodeId).emit(BroadcastTypes.NODE_SHARE_DISABLED, { shareIds: ro.shareIds });
      return;
    });
  }

  /**
   * Field configuration property changes
   */
  async broadcastFieldPermissionChange(server: any, message: FieldPermissionChangeRo) {
    // get all rooms of the datasheet resource
    const roomIds = await this.nestService.getResourceRelateRoomIds(message.datasheetId);
    const { event, changes, ...args } = message;
    // Field permission closures or attribute changes are broadcast directly to each room
    if (event === BroadcastTypes.FIELD_PERMISSION_DISABLE || event === BroadcastTypes.FIELD_PERMISSION_SETTING_CHANGE) {
      roomIds.map(roomId => {
        server.to(roomId).emit(event, args);
        return;
      });
      return;
    }
    // custom request to get multiple service node pod sockets
    server.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async (err: string, replies: string | any[]) => {
      if (err) {
        throw new RuntimeException(err);
      }
      this.logger.log({ message: 'FieldPermission:ServerSideEmit', replies });

      // no room connection return directly
      if (!replies.length) {
        return;
      }
      const socketIds = [];
      for (const ids of replies) {
        if (ids?.length > 0) {
          socketIds.push(...ids);
        }
      }
      // no client connection return directly
      if (!socketIds.length) {
        return;
      }

      const infos = await this.nestService.getSocketInfos(socketIds);
      // Build User ID - Permission Map
      const uuidToPermissionInfoMap = new Map<string, any>();
      for (const { uuids, ...permissionInfo } of changes) {
        for (const uuid of uuids) {
          uuidToPermissionInfoMap.set(uuid, permissionInfo);
        }
      }
      // broadcast to each socket
      await infos.map(info => {
        // Sharing page connection, only broadcast field permission is on
        if (info.shareId) {
          if (event === BroadcastTypes.FIELD_PERMISSION_ENABLE) {
            server.to(info.socketId).emit(event, args);
          }
          return;
        }
        // The connection within the station is broadcast only to the user whose privileges have changed
        if (info.userId && uuidToPermissionInfoMap.has(info.userId)) {
          server.to(info.socketId).emit(event, { ...uuidToPermissionInfoMap.get(info.userId), ...args });
        }
        return;
      });
    });
  }

  private changesetToGrpcMeta(changesets: any): { [key: string]: MetadataValue } {
    try {
      const [{ messageId, operations: [{ cmd }] }] = changesets;
      return { [CHANGESETS_MESSAGE_ID]: messageId, [CHANGESETS_CMD]: cmd };
    } catch {
      return null;
    }
  }

}
