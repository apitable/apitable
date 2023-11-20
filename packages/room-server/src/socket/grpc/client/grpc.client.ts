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
import { BasicResult } from 'grpc/generated/common/Core';
import { Any } from 'grpc/generated/google/protobuf/any';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { LeaveRoomRo, RoomServingService, UserRoomChangeRo, WatchRoomRo } from 'grpc/generated/serving/RoomServingService';
import { lastValueFrom } from 'rxjs';
import { GrpcClientProxy } from './grpc.client.proxy';
import { ROOM_GRPC_CLIENT } from 'shared/common';

@Injectable()
export class GrpcClient implements OnModuleInit {
  // room-server grpc service
  private roomService!: RoomServingService;

  private readonly logger = new Logger(GrpcClient.name);

  constructor(
    // @ts-ignore
    @Inject(ROOM_GRPC_CLIENT) private readonly roomClient: GrpcClientProxy,
  ) {}

  async onModuleInit() {
    this.roomService = await this.roomClient.getService<RoomServingService>('RoomServingService');
  }

  async watchRoom(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'WatchRoom',
      message: `WatchRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.watchRoom(message, metadata));
  }

  async getActiveCollaborators(message: WatchRoomRo, metadata: any): Promise<any | null> {
    this.logger.log({
      action: 'GetActiveCollaborators',
      message: `GetActiveCollaborators socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.getActiveCollaborators(message, metadata));
  }

  async leaveRoom(message: LeaveRoomRo, metadata: any): Promise<BasicResult> {
    this.logger.log({
      action: 'LeaveRoom',
      message: `LeaveRoom socket-id:[${message.clientId}] To room-server:[${await this.roomClient.currentClientUrl}]`,
    });

    return await lastValueFrom(this.roomService.leaveRoom(message, metadata));
  }

  async roomChange(message: UserRoomChangeRo, metadata: any): Promise<any> {
    this.logger.log({
      action: 'RoomChange',
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
