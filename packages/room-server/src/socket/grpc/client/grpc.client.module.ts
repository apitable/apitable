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

import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PROJECT_DIR } from 'app.environment';
import { protobufPackage } from 'grpc/generated/serving/RoomServingService';
import { join } from 'path';
import { BootstrapConstants } from 'shared/common/constants/bootstrap.constants';
import { SocketConstants } from 'shared/common/constants/socket.module.constants';
import { RedisModule } from 'socket/services/redis/redis.module';
import { RedisService } from 'socket/services/redis/redis.service';
import { GrpcClient } from './grpc.client';
import { GrpcClientProxy } from './grpc.client.proxy';
import { ROOM_GRPC_CLIENT } from 'shared/common';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ROOM_GRPC_CLIENT,
        imports: [RedisModule, HttpModule],
        inject: [RedisService, HttpService],
        useFactory: (redisService: RedisService, httpService: HttpService) => {
          const { maxSendMessageLength, maxReceiveMessageLength, keepalive, channelOptions } = SocketConstants.GRPC_OPTIONS;
          return {
            customClass: GrpcClientProxy,
            options: {
              url: BootstrapConstants.ROOM_GRPC_URL,
              maxSendMessageLength: maxSendMessageLength,
              maxReceiveMessageLength: maxReceiveMessageLength,
              keepalive: keepalive,
              channelOptions: channelOptions,
              package: [protobufPackage],
              protoPath: [
                join(PROJECT_DIR, 'grpc/generated/serving/RoomServingService.proto'),
                join(PROJECT_DIR, 'grpc/generated/common/Core.proto'),
              ],
              loader: {
                json: true,
              },
              proxyClient: redisService,
              httpService: httpService,
            },
          };
        },
      },
    ]),
  ],
  providers: [GrpcClient],
  exports: [GrpcClient],
})
export class GrpcClientModule {}
