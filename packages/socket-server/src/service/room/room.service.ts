import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { promisify } from 'util';
import { BroadcastTypes } from 'src/enum/broadcast-types.enum';
import { NestService } from '../nest/nest.service';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { ServerErrorCode } from 'src/enum/socket.enum';
import { SocketConstants } from 'src/constants/socket-constants';
import { logger } from 'src/common/helper';
import { RequestTypes } from 'src/enum/request-types.enum';
import { GatewayConstants } from 'src/constants/gateway.constants';
import { NodeShareDisableRo } from 'src/model/ro/node/node.ro';
import { FieldPermissionChangeRo } from 'src/model/ro/datasheet/datasheet.ro';
import { RuntimeException } from '@nestjs/core/errors/exceptions/runtime.exception';
import { NestClient } from 'src/grpc/client/nest.client';
import { Retryable } from '../../grpc/util/retry.decorator';
import { getGlobalGrpcMetadata } from '../../grpc/util/utils';

@Injectable()
export class RoomService {
  constructor(
    private readonly nestService: NestService,
    private readonly nestClient: NestClient,
  ) {
  }

  public async clientDisconnect(client: Socket) {
    const rooms = Object.keys(client.adapter.rooms);
    if (!isNil(rooms)) {
      rooms.forEach(roomName => {
        // 避免多节点报错,并且过滤掉 nest-server 的房间
        if (roomName != SocketConstants.NEST_SERVER_PREFIX && !roomName.startsWith(GatewayConstants.ROOM_PATH)) {
          const socketsIds = Object.keys(client.adapter.rooms[roomName].sockets);
          // 通知用户所在房间的用户，这个client离开了
          if (socketsIds.includes(client.id)) {
            this.leaveRoom({ roomId: roomName }, client);
          }
        }
      });
      // 通知 nest-server 操作
      return await this.nestClient.leaveRoom(this.injectMessage(client, { clientId: client.id }), getGlobalGrpcMetadata());
    }
    return null;
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: (args) => {
        return { clientId: args[0]?.clientId };
      },
      extra: (args) => {
        return { roomId: args[0]?.roomId, clientId: args[0]?.clientId, cookie: args[0]?.cookie };
      },
    },
    callback: () => ({ code: ServerErrorCode.NetworkError, success: false, message: 'Network Error' }),
  })
  public async watchRoom(message: any, client: Socket, server?: any): Promise<any | null> {
    const room = message.roomId;
    const createTime = Date.now();
    const isExistRoom = client.rooms[room];
    const grpcMetadata = getGlobalGrpcMetadata();
    const cTraceId = grpcMetadata.get('X-C-TraceId')[0];

    logger(`C-TraceId[${cTraceId}] WatchRoom`).log(`Watch Room: ${message.roomId}`);

    if (isExistRoom) {
      logger(`C-TraceId[${cTraceId}] User are already in room`).log(`client: ${client.id} has already in room: ${JSON.stringify(client.rooms[room])}`);
    }
    // 通知 NestServer 处理消息
    const result = await this.nestClient.watchRoom(this.injectMessage(client, message, true, true), grpcMetadata);

    if ('success' in result && result.success) {
      // 当 client 在 room 中不存在的时候，进行 join 和 userEnter 的广播
      if (!isExistRoom) {
        await promisify(client.join.bind(client))(room);
        logger(`C-TraceId[${cTraceId}] User are join in room`).log({ room, socketId: client.id });
        // 通知客户端所有连接新用户加入房间
        client.broadcast.to(room).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
          collaborators: [{
            socketId: client.id,
            createTime, ...result.data.collaborator,
          }],
        });
        result.data.collaborator = undefined;

        // 调用异步的 customRequest，获取给其他节点的协同者，广播该客户端新用户和加入房间的消息
        this.complementaryCollaborator(server, message, client, result.data.spaceId);
      }
    } else if (isExistRoom) {
      // 鉴权失败，且已存在 room 中，断开连接
      await this.leaveRoom({ roomId: room }, client);
    }

    const endTime = +new Date();
    logger(`C-TraceId[${cTraceId}] WatchRoom`).log(`Watch Room: ${message.roomId} Success，总耗时: ${endTime - createTime}ms`);

    return result;
  }

  private async complementaryCollaborator(server: any, message: any, client: Socket, spaceId: string) {
    // 获取数表资源的所有房间
    const roomIds = [message.roomId];
    const cb = async (err, replies) => {
      if (err) {
        throw new RuntimeException(err);
      }
      logger('WatchRoom:CustomRequest').log({ replies });
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
      const _message = this.injectMessage(client, message, true, true);
      _message.socketIds = [...new Set([..._message.socketIds, ...socketIds])];
      _message.spaceId = spaceId;
      const result = await this.nestClient.getActiveCollaborators(_message, grpcMetadata);
      client.broadcast.to(client.id).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
        collaborators: result.data?.collaborators || [],
      });
    };
    // 自定义请求，获取多个服务节点 pod sockets
    server.adapter.customRequest(roomIds, cb);
  }

  public async leaveRoom(message: any, client: Socket): Promise<boolean> {
    const room = message.roomId;
    // 防止只有自己一个人的时候，断开连接会报错
    if (!isNil(client.adapter.rooms[room])) {
      await promisify(client.leave.bind(client))(room);
      await client.broadcast.to(room).emit(BroadcastTypes.DEACTIVATE_COLLABORATOR, { socketId: client.id, ...message });
      logger('User are leave room').log({ room, socketId: client.id });
    }
    return Promise.resolve(true);
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: (args) => {
        return { clientId: args[0]?.clientId };
      },
      extra: (args) => {
        return { roomId: args[0]?.roomId, clientId: args[0]?.clientId, cookie: args[0]?.cookie };
      },
    },
    callback: () => ({ code: ServerErrorCode.ServerError, success: false, message: 'Server Error' }),
  })
  async roomChange(message: any, client: Socket): Promise<any> {
    const room = message.roomId;
    const grpcMetadata = getGlobalGrpcMetadata();

    // 通知 NestServer 处理消息
    const result = await this.nestClient.roomChange(this.injectMessage(client, message, true), grpcMetadata);
    if ('success' in result && result.success) {
      const changesets = await this.broadcastServerChange(room, result.data, client);
      result.data = { changesets };
    }
    // 响应结果直接返回
    return result;
  }

  public async broadcastServerChange(roomId: string, results: any, server: any): Promise<any[]> {
    // 遍历广播到各个 resource 发生变化的room
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

  public async moveCursor(message: any, client: Socket): Promise<boolean> {
    const { datasheetId, ...rest } = message;
    const data = {
      type: RequestTypes.ENGAGEMENT_CURSOR,
      socketId: client.id,
      cursorInfo: {
        datasheetId,
        ...rest,
      },
    };
    client.broadcast.to(datasheetId).emit(BroadcastTypes.ENGAGEMENT_CURSOR, data);
    return Promise.resolve(true);
  }

  /**
   * 绑定client的信息到message
   *
   * @param client socket连接信息
   * @param message 客户端发送的消息
   * @param isNeedCookie 是否需要cookie信息
   * @return
   * @author Zoe Zheng
   * @date 2020/6/30 6:18 下午
   */
  private injectMessage(client: Socket, message: any, isNeedCookie = false, isNeedSocketIds = false): any {
    if (isNeedCookie) {
      message.cookie = client.handshake.headers.cookie;
    }
    message.clientId = client.id;
    if (!isNil(message.roomId) && isNeedSocketIds) {
      const room = client.adapter.rooms[message.roomId];
      if (room) {
        message.socketIds = [...[client.id], ...Object.keys(room.sockets)];
      } else {
        message.socketIds = [client.id];
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
    const cb = async (err, replies) => {
      if (err) {
        throw new RuntimeException(err);
      }
      logger('FieldPermission:CustomRequest').log({ replies });
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
    };
    // 自定义请求，获取多个服务节点 pod sockets
    server.adapter.customRequest(roomIds, cb);
  }

}
