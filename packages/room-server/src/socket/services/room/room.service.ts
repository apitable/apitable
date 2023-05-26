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

import { MetadataValue } from '@grpc/grpc-js';
import { Injectable, Logger } from '@nestjs/common';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { showAnonymous } from 'app.environment';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { CHANGESETS_CMD, CHANGESETS_MESSAGE_ID } from 'shared/common';
import { GatewayConstants, SocketConstants } from 'shared/common/constants/socket.module.constants';
import { Retryable } from 'shared/decorator/retry.decorator';
import { BroadcastTypes } from 'shared/enums/broadcast-types.enum';
import { RequestTypes } from 'shared/enums/request-types.enum';
import { ServerErrorCode, SocketEventEnum } from 'shared/enums/socket.enum';
import { initGlobalGrpcMetadata } from 'shared/helpers/grpc.helper';
import { Socket } from 'socket.io';
import { GrpcClient } from 'socket/grpc/client/grpc.client';
import { FieldPermissionChangeRo } from 'socket/ros/datasheet/datasheet.ro';
import { NodeShareDisableRo } from 'socket/ros/node/node.ro';
import { NestService } from 'socket/services/nest/nest.service';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    private readonly nestService: NestService,
    private readonly nestClient: GrpcClient
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
      if (socketsIds && socketsIds.has(socket.id)) {
        this.leaveRoom({ roomId: room }, socket);
      }
    }
    // notify nest server actions
    await this.nestClient.leaveRoom(this.injectMessage(socket, { clientId: socket.id }), initGlobalGrpcMetadata());
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: args => {
        return { clientId: args![0]?.clientId };
      },
      extra: args => {
        return { roomId: args![0]?.roomId, clientId: args![0]?.clientId, cookie: args![0]?.cookie };
      },
    },
    callback: () => ({ code: ServerErrorCode.NetworkError, success: false, message: 'Network Error' }),
  })
  async watchRoom(message: any, socket: Socket): Promise<any | null> {
    const room = message.roomId;
    const createTime = Date.now();
    const isExistRoom = socket.rooms.has(room);
    const _grpcMetadata = initGlobalGrpcMetadata();

    this.logger.log({
      action: 'WatchRoom',
      message: `WatchRoom Start roomId:[${message.roomId}]`,
    });

    if (isExistRoom) {
      this.logger.log(`User are already in room,
      socketId: ${socket.id} has already in room: ${JSON.stringify(socket.rooms[room])}`);
    }
    // notifies nest-server to handle `WatchRoom` messages
    const result = await this.nestClient.watchRoom(this.injectMessage(socket, message, true, true), _grpcMetadata);

    if ('success' in result && result.success) {
      // Broadcast join and userEnter when the client does not exist in the room
      if (!isExistRoom) {
        void socket.join(room);
        this.logger.log({ room, socketId: socket.id, message: 'User are join in room' });
        if (!showAnonymous && !result.data.collaborator) {
          this.logger.log('Ignored Anonymous');
        } else {
          // Notify the client that all connected new users join the room
          socket.broadcast.to(room).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
            collaborators: [
              {
                socketId: socket.id,
                createTime,
                ...result.data.collaborator,
              },
            ],
          });
        }
        result.data.collaborator = undefined;

        // Call an asynchronous customRequest to get the collaborator given to the other nodes,
        // broadcasting the new user and joining the room for that client
        this.complementaryCollaborator(message, socket, result.data.spaceId);
      }
    } else if (isExistRoom) {
      // Authentication failed and is already in `room`, disconnect
      this.leaveRoom({ roomId: room }, socket);
    }

    const endTime = +new Date();
    this.logger.log({
      action: 'WatchRoom',
      ms: endTime - createTime,
      message: `WatchRoom End roomId:[${message.roomId}] Success, total time: ${endTime - createTime}ms`,
    });
    return result;
  }

  private complementaryCollaborator(message: any, socket: Socket, spaceId: string) {
    // get all rooms of the datasheet resource
    const roomIds = [message.roomId];
    // custom request to get multiple service node pod sockets
    socket.nsp.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async(_err: any, replies: string | any[]) => {
      this.logger.log({ message: 'WatchRoom:ServerSideEmit', replies, err: `${_err}` });
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
      const _message = this.injectMessage(socket, message, true);
      _message.socketIds = socketIds;
      _message.spaceId = spaceId;
      const result = await this.nestClient.getActiveCollaborators(_message, _grpcMetadata);
      socket.broadcast.to(socket.id).emit(BroadcastTypes.ACTIVATE_COLLABORATORS, {
        collaborators: result.data?.collaborators || [],
      });
    });
  }

  leaveRoom(message: any, socket: Socket) {
    const room = message.roomId;
    // to prevent when you are the only one, disconnection will report an error
    if (socket.nsp.adapter.rooms.has(room)) {
      void socket.leave(room);
      socket.broadcast.to(room).emit(BroadcastTypes.DEACTIVATE_COLLABORATOR, { socketId: socket.id, ...message });
      this.logger.log({ message: 'User are leave room', room, socketId: socket.id });
    }
  }

  @Retryable({
    maxAttempts: SocketConstants.GRPC_OPTIONS.retryPolicy.maxAttempts,
    sentryScopeContext: {
      tags: args => {
        return { clientId: args![0]?.clientId };
      },
      extra: args => {
        return { roomId: args![0]?.roomId, clientId: args![0]?.clientId, cookie: args![0]?.cookie };
      },
    },
    callback: () => ({ code: ServerErrorCode.ServerError, success: false, message: 'Server Error' }),
  })
  async roomChange(message: any, socket: Socket): Promise<any> {
    const createTime = Date.now();
    const room = message.roomId;
    const _grpcMetadata = initGlobalGrpcMetadata(this.changesetToGrpcMeta(message.changesets));

    this.logger.log({
      action: 'RoomChange',
      message: `RoomChange Start roomId:[${message.roomId}]`,
    });

    // notifies nest-server to handle `RoomChange` messages
    const result = await this.nestClient.roomChange(this.injectMessage(socket, message, true), _grpcMetadata);
    if ('success' in result && result.success) {
      const changesets = this.broadcastServerChange(room, Value.decode(result.data.value).listValue, socket);
      result.data = { changesets };
    }

    const endTime = +new Date();
    this.logger.log({
      action: 'RoomChange',
      ms: endTime - createTime,
      message: `RoomChange End roomId:[${message.roomId}] Success, total time: ${endTime - createTime}ms`,
    });
    return result;
  }

  broadcastServerChange(roomId: string, results: any, server: any): any[] {
    // traverse and broadcast to rooms where each resource has changed
    const roomToCsMap = new Map<string, any[]>();
    for (const result of results) {
      for (const roomId of result.roomIds) {
        if (roomToCsMap.has(roomId)) {
          roomToCsMap.set(roomId, [...roomToCsMap.get(roomId)!, ...[result.changeset]]);
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
    return roomToCsMap.get(roomId)!;
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
        message.socketIds = [...[socket.id], ...socket.nsp.adapter.rooms.get(message.roomId)!];
      } else {
        message.socketIds = [socket.id];
      }
    }
    return message;
  }

  /**
   * Node sharing is turned off
   */
  broadcastNodeShareDisabled(server: any, message: NodeShareDisableRo[]) {
    // there is no communication room return directly
    if (!Object.keys(server.sockets).length) {
      return;
    }

    message.forEach(ro => {
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
    const { event, ...args } = message;
    // Field permission closures or attribute changes are broadcast directly to each room
    if (event === BroadcastTypes.FIELD_PERMISSION_DISABLE || event === BroadcastTypes.FIELD_PERMISSION_SETTING_CHANGE) {
      roomIds.map(roomId => {
        server.to(roomId).emit(event, args);
        return;
      });
      return;
    }
    if (server.adapter.rooms.has(message.datasheetId)) {
      await this.broadcastFieldPermissionChangeToUser(server, message, [...server.adapter.rooms.get(message.datasheetId)]);
    }
    // custom request to get multiple service node pod sockets
    server.serverSideEmit(SocketEventEnum.CLUSTER_SOCKET_ID_EVENT, roomIds, async(err: string, replies: string | any[]) => {
      this.logger.log({ message: 'FieldPermission:ServerSideEmit', replies, err: `${err}` });
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
      await this.broadcastFieldPermissionChangeToUser(server, message, socketIds);
    });
  }

  private async broadcastFieldPermissionChangeToUser(server: any, message: FieldPermissionChangeRo, socketIds: string[]) {
    const { event, changes, ...args } = message;
    const infos = await this.nestService.getSocketInfos(socketIds);
    // Build User ID - Permission Map
    const uuidToPermissionInfoMap = new Map<string, any>();
    for (const { uuids, ...permissionInfo } of changes!) {
      for (const uuid of uuids) {
        uuidToPermissionInfoMap.set(uuid, permissionInfo);
      }
    }
    // broadcast to each socket
    infos.forEach(info => {
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
  }

  private changesetToGrpcMeta(changesets: any): { [key: string]: MetadataValue } | undefined {
    try {
      const [
        {
          messageId,
          operations: [{ cmd }],
        },
      ] = changesets;
      return { [CHANGESETS_MESSAGE_ID]: messageId, [CHANGESETS_CMD]: cmd };
    } catch {
      return undefined;
    }
  }
}
