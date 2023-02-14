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

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { BasicResult } from 'grpc/generated/common/Core';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { ApiServingService, NodeBrowsingRo } from 'grpc/generated/serving/BackendServingService';
import { LeaveRoomRo, RoomServingService, UserRoomChangeRo, WatchRoomRo } from 'grpc/generated/serving/RoomServingService';
import { lastValueFrom } from 'rxjs';
import { TRACE_ID } from 'shared/common';
import { GatewayConstants } from 'shared/common/constants/socket.module.constants';
import { GrpcClientProxy } from './grpc.client.proxy';

@Injectable()
export class GrpcClient implements OnModuleInit {
  // backend-server grpc service
  private backendService!: ApiServingService;
  // room-server grpc service
  private roomService!: RoomServingService;

  private readonly logger = new Logger(GrpcClient.name);

  constructor(
    @Inject(GatewayConstants.BACKEND_SERVICE) private readonly backendClient: ClientGrpcProxy,
    @Inject(GatewayConstants.ROOM_SERVICE) private readonly roomClient: GrpcClientProxy,
  ) {}

  async onModuleInit() {
    this.backendService = await this.backendClient.getService<ApiServingService>('ApiServingService');
    this.roomService = await this.roomClient.getService<RoomServingService>('RoomServingService');
  }

  async recordNodeBrowsing(message: NodeBrowsingRo): Promise<BasicResult> {
    return await lastValueFrom(this.backendService.recordNodeBrowsing(message));
  }

  async watchRoom(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'WatchRoom',
      traceId: String(metadata.get(TRACE_ID)),
      message: `WatchRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.watchRoom(message, metadata));
  }

  async getActiveCollaborators(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'GetActiveCollaborators',
      traceId: String(metadata.get(TRACE_ID)),
      message: `GetActiveCollaborators socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.getActiveCollaborators(message, metadata));
  }

  async leaveRoom(message: LeaveRoomRo, metadata: any): Promise<BasicResult> {
    this.logger.log({
      action: 'LeaveRoom',
      traceId: String(metadata.get(TRACE_ID)),
      message: `LeaveRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.leaveRoom(message, metadata));
  }

  async roomChange(message: UserRoomChangeRo, metadata: any): Promise<any> {
    this.logger.log({
      action: 'RoomChange',
      traceId: String(metadata.get(TRACE_ID)),
      message: `RoomChange socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    if (!message.changesets?.value) {
      message.changesets = Any.fromPartial({
        value: Value.encode(Value.wrap(message.changesets)).finish(),
      });
    }
    return await lastValueFrom(this.roomService.roomChange(message, metadata));
  }
}
