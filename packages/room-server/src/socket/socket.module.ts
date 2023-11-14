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

import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcModule } from 'grpc/grpc.module';
import { DatasheetController } from 'socket/controller/datasheet.controller';
import { NodeController } from 'socket/controller/node.controller';
import { SocketController } from 'socket/controller/socket.controller';
import { SocketGrpcController } from 'socket/controller/socket.grpc.controller';
import { NotificationGateway } from 'socket/gateway/notification.gateway';
import { RoomGateway } from 'socket/gateway/room.gateway';
import { GrpcClientModule } from 'socket/grpc/client/grpc.client.module';
import { NestService } from 'socket/services/nest/nest.service';
import { NotificationService } from 'socket/services/notification/notification.service';
import { RedisModule } from 'socket/services/redis/redis.module';
import { RoomService } from 'socket/services/room/room.service';
import { SocketIoService } from 'socket/services/socket-io/socket-io.service';

@Module({})
export class SocketModule {
  static register(enabled: boolean): DynamicModule {
    if (!enabled) {
      return {
        module: SocketModule,
      };
    }

    return {
      module: SocketModule,
      imports: [
        GrpcClientModule,
        GrpcModule,
        HttpModule,
        RedisModule,
        TerminusModule,
      ],
      controllers: [
        SocketController,
        NodeController,
        DatasheetController,
        SocketGrpcController,
      ],
      providers: [
        SocketIoService,
        RoomService,
        NotificationService,
        NestService,
        NotificationGateway,
        RoomGateway,
      ],
    };
  }
}

