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

import { Global, Injectable, Module } from '@nestjs/common';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { ClientsModuleOptionsFactory } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { GrpcSocketClient } from 'grpc/client/grpc.socket.client';
import { protobufPackage } from 'grpc/generated/serving/SocketServingService';
import { join } from 'path';
import { GRPC_MAX_PACKAGE_SIZE, SOCKET_GRPC_CLIENT } from 'shared/common';

@Global()
@Injectable()
export class GrpcSocketClientModuleOption implements ClientsModuleOptionsFactory {
  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    return {
      transport: Transport.GRPC,
      options: {
        url: process.env.SOCKET_GRPC_URL,
        package: [protobufPackage],
        protoPath: [
          join(__dirname, '../generated/serving/SocketServingService.proto'),
          join(__dirname, '../generated/common/Core.proto')
        ],
        // 100M
        maxSendMessageLength: GRPC_MAX_PACKAGE_SIZE,
        maxReceiveMessageLength: GRPC_MAX_PACKAGE_SIZE,
        loader: {
          json: true,
        },
      },
    };
  }
}

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: SOCKET_GRPC_CLIENT,
        useClass: GrpcSocketClientModuleOption,
      },
    ]),
  ],
  providers: [GrpcSocketClient],
  exports: [GrpcSocketClient],
})
export class GrpcClientModule {}

