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
import { ClientGrpcProxy, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { VikaGrpcClientProxy } from 'grpc/client/vika.grpc.client.proxy';
import { VikaGrpcClientProxyXxlJob } from 'grpc/client/vika.grpc.client.proxy.xxljob';
import { protobufPackage } from 'grpc/generated/serving/RoomServingService';
import { RedisModule } from 'socket/_modules/redis.module';
import { GatewayConstants } from 'socket/constants/gateway.constants';
import { SocketConstants } from 'socket/constants/socket-constants';
import { RedisService } from 'socket/service/redis/redis.service';
import { GrpcClient } from './grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GatewayConstants.ROOM_SERVICE,
        imports: [RedisModule, HttpModule],
        inject: [RedisService, HttpService],
        useFactory: (redisService: RedisService, httpService: HttpService) => {
          const { maxSendMessageLength, maxReceiveMessageLength, keepalive, channelOptions } = SocketConstants.GRPC_OPTIONS;
          return {
            customClass: SocketConstants.GRPC_CLIENT_PROXY_HEALTH_MODEL === 'DEFAULT' ? VikaGrpcClientProxy : VikaGrpcClientProxyXxlJob,
            options: {
              url: GatewayConstants.ROOM_GRPC_URL,
              maxSendMessageLength: maxSendMessageLength,
              maxReceiveMessageLength: maxReceiveMessageLength,
              keepalive: keepalive,
              channelOptions: channelOptions,
              package: [protobufPackage],
              protoPath: [join(__dirname, '../generated/serving/RoomServingService.proto'), join(__dirname, '../generated/common/Core.proto')],
              loader: {
                json: true,
              },
              proxyClient: redisService,
              httpService: httpService,
            },
          };
        },
      },
      {
        name: GatewayConstants.BACKEND_SERVICE,
        useFactory: () => {
          return {
            customClass: ClientGrpcProxy,
            options: {
              url: GatewayConstants.BACKEND_GRPC_URL,
              maxSendMessageLength: SocketConstants.GRPC_OPTIONS.maxSendMessageLength,
              maxReceiveMessageLength: SocketConstants.GRPC_OPTIONS.maxReceiveMessageLength,
              package: [protobufPackage],
              protoPath: [join(__dirname, '../generated/serving/BackendServingService.proto'), join(__dirname, '../generated/common/Core.proto')],
              loader: {
                json: true,
              },
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
