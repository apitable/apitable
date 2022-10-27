import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BroadcastTypes } from 'src/socket/enum/broadcast-types.enum';
import { NestService } from '../nest/nest.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ServerErrorCode, SocketEventEnum } from 'src/socket/enum/socket.enum';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { logger } from 'src/socket/common/helper';
import { RequestTypes } from 'src/socket/enum/request-types.enum';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { NodeShareDisableRo } from 'src/socket/model/ro/node/node.ro';
import { FieldPermissionChangeRo } from 'src/socket/model/ro/datasheet/datasheet.ro';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { NestClient } from 'src/grpc/client/nest.client';
import { Retryable } from '../../../grpc/util/retry.decorator';
import { getGlobalGrpcMetadata } from '../../../grpc/util/utils';

@Injectable()
export class RoomService {
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
    await this.nestClient.leaveRoom(this.injectMessage(socket, { clientId: socket.id }), getGlobalGrpcMetadata());
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
    const grpcMetadata = getGlobalGrpcMetadata();
    const cTraceId = grpcMetadata.get('X-C-TraceId')[0];

    logger(`C-TraceId[${cTraceId}] WatchRoom`).log(`Watch Room: ${message.roomId}`);

    if (isExistRoom) {
      logger(`C-TraceId[${cTraceId}] User are already in room`)
        .log(`socketId: ${socket.id} has already in room: ${JSON.stringify(socket.rooms[room])}`);
    }
    // 通知 NestServer 处理消息
    const result = await this.nestClient.watchRoom(this.injectMessage(socket, message, true, true), grpcMetadata);

    if ('success' in result && result.success) {
      // 当 client 在 room 中不存在的时候，进行 join 和 userEnter 的广播
      if (!isExistRoom) {
        socket.join(room);
        logger(`C-TraceId[${cTraceId}] User are join in room`).log({ room, socketId: socket.id });
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
    logger(`C-TraceId[${cTraceId}] WatchRoom`).log(`Watch Room: ${message.roomId} Success，总耗时: ${endTime - createTime}ms`);

    return result;
  }

  private complementaryCollaborator(server: any, message: any, socket: Socket, spaceId: string) {
    // 获取数表资源的所有房间
    const roomIds = [message.roomId];
    // custom request to get multiple service node pod sockets
    server.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async(_err: any, replies: string | any[]) => {
      logger('WatchRoom:ServerSideEmit').log({ replies });
      // 没有 room 连接，直接结束
      if (!replies.length) {
        return;
      }
      const socketIds = [];
      for (const ids of replies) {
        if (ids?.length > 0) {
          socketIds.push(...ids);
        }
      }
      // 没有客户端连接，直接结束
      if (!socketIds.length) {
        return;
      }
      const grpcMetadata = getGlobalGrpcMetadata();
      const _message = this.injectMessage(socket, message, true, true);
      _message.socketIds = [...new Set([..._message.socketIds, ...socketIds])];
      _message.spaceId = spaceId;
      const result = await this.nestClient.getActiveCollaborators(_message, grpcMetadata);
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
      logger('User are leave room').log({ room, socketId: socket.id });
    }
    return Promise.resolve(true);
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
    tags: (args) => { return { clientId: args[0]?.clientId } },
    extra: (args) => { return { roomId: args[0]?.roomId, clientId: args[0]?.clientId, cookie: args[0]?.cookie } },
    },
    callback: () => ({ code: ServerErrorCode.ServerError, success: false, message: 'Server Error' }),
    })
  async roomChange(message: any, socket: Socket): Promise<any> {
    const room = message.roomId;
    const grpcMetadata = getGlobalGrpcMetadata();

    // notify nest server to process the message
    const result = await this.nestClient.roomChange(this.injectMessage(socket, message, true), grpcMetadata);
    if ('success' in result && result.success) {
      const changesets = this.broadcastServerChange(room, result.data, socket);
      result.data = { changesets };
    }
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
   * 绑定client的信息到message
   *
   * @param socket socket连接信息
   * @param message 客户端发送的消息
   * @param isNeedCookie 是否需要cookie信息
   * @return
   * @author Zoe Zheng
   * @date 2020/6/30 6:18 下午
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

  async broadcastNodeShareDisabled(server: any, message: NodeShareDisableRo[]) {
    // 不存在通信房间，直接结束
    if (!Object.keys(server.sockets).length) {
      return;
    }
    // 广播到各个节点的房间
    await message.map(ro => {
      server.to(ro.nodeId).emit(BroadcastTypes.NODE_SHARE_DISABLED, { shareIds: ro.shareIds });
      return;
    });
  }

  async broadcastFieldPermissionChange(server: any, message: FieldPermissionChangeRo) {
    // 获取数表资源的所有房间
    const roomIds = await this.nestService.getResourceRelateRoomIds(message.datasheetId);
    const { event, changes, ...args } = message;
    // 字段权限关闭或属性变更，直接广播到各个房间
    if (event === BroadcastTypes.FIELD_PERMISSION_DISABLE || event === BroadcastTypes.FIELD_PERMISSION_SETTING_CHANGE) {
      roomIds.map(roomId => {
        server.to(roomId).emit(event, args);
        return;
      });
      return;
    }
    // custom request to get multiple service node pod sockets
    server.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async(err: string, replies: string | any[]) => {
      if (err) {
        throw new RuntimeException(err);
      }
      logger('FieldPermission:ServerSideEmit').log({ replies });
      // 没有 room 连接，直接结束
      if (!replies.length) {
        return;
      }
      const socketIds = [];
      for (const ids of replies) {
        if (ids?.length > 0) {
          socketIds.push(...ids);
        }
      }
      // 没有客户端连接，直接结束
      if (!socketIds.length) {
        return;
      }
      // 获取 socket 信息
      const infos = await this.nestService.getSocketInfos(socketIds);
      // 构建 用户ID - 权限 Map
      const uuidToPermissionInfoMap = new Map<string, any>();
      for (const { uuids, ...permissionInfo } of changes) {
        for (const uuid of uuids) {
          uuidToPermissionInfoMap.set(uuid, permissionInfo);
        }
      }
      // 广播到各个 socket
      await infos.map(info => {
        // 分享页面的连接，仅广播字段权限开启
        if (info.shareId) {
          if (event === BroadcastTypes.FIELD_PERMISSION_ENABLE) {
            server.to(info.socketId).emit(event, args);
          }
          return;
        }
        // 站内的连接，只对发生权限变更的用户广播
        if (info.userId && uuidToPermissionInfoMap.has(info.userId)) {
          server.to(info.socketId).emit(event, { ...uuidToPermissionInfoMap.get(info.userId), ...args });
        }
        return;
      });
    });
  }

}
