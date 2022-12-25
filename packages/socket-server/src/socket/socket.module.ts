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
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcClientModule } from 'grpc/client/grpc.client.module';
import { SocketGrpcController } from 'socket/controller/socket.grpc.controller';
import { RedisModule } from './_modules/redis.module';
import { DatasheetController } from './controller/datasheet.controller';
import { HealthController } from './controller/health.controller';
import { NodeController } from './controller/node.controller';
import { SocketController } from './controller/socket.controller';
import { NotificationGateway } from './gateway/notification.gateway';
import { RoomGateway } from './gateway/room.gateway';
import { LocalHealthIndicator } from './service/indicator/local-health.indicator';
import { NestService } from './service/nest/nest.service';
import { NotificationService } from './service/notification/notification.service';
import { RoomService } from './service/room/room.service';
import { SocketIoService } from './service/socket-io/socket-io.service';

@Module({
  imports: [GrpcClientModule, HttpModule, RedisModule, TerminusModule],
  controllers: [HealthController, SocketController, NodeController, DatasheetController, SocketGrpcController],
  providers: [
    SocketIoService,
    RoomService,
    NotificationService,
    NestService,
    LocalHealthIndicator,
    NotificationGateway,
    RoomGateway,
  ],
})
export class SocketModule {
}
