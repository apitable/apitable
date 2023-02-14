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

import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BasicResult, ServerRoomChangeRo } from 'grpc/generated/common/Core';
import { Value } from 'grpc/generated/google/protobuf/struct';
import { protobufPackage } from 'grpc/generated/serving/SocketServingService';
import { GrpcExceptionFilter } from 'socket/filter/grpc.exception.filter';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { RoomService } from 'socket/services/room/room.service';

@UseFilters(new GrpcExceptionFilter())
@Controller(protobufPackage)
export class SocketGrpcController {
  constructor(
    private readonly roomGateway: RoomGateway,
    private readonly roomService: RoomService
  ) {}

  @GrpcMethod('SocketService', 'serverRoomChange')
  serverRoomChange(message: ServerRoomChangeRo): BasicResult {
    this.roomService.broadcastServerChange(message.roomId, Value.decode(message.data!.value).listValue, this.roomGateway.server);
    return {
      success: true,
      message: 'true',
      code: 200,
    };
  }
}
