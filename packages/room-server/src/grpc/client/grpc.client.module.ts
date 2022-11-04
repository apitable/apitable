import { Global, Injectable, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { ClientsModuleOptionsFactory } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { GrpcSocketClient } from 'grpc/client/grpc.socket.client';
import { protobufPackage } from 'grpc/generated/serving/SocketServingService';
import { join } from 'path';
import { GRPC_MAX_PACKAGE_SIZE, SOCKET_GRPC_CLIENT } from 'shared/common';

@Global()
@Injectable()
export class GrpcSocketClientModuleOption implements ClientsModuleOptionsFactory {
  constructor(private configService: ConfigService) {}
  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    return {
      transport: Transport.GRPC,
      options: {
        url: process.env.SOCKET_GRPC_URL || this.configService.get<string>('socket.grpcUrl'),
        package: [protobufPackage],
        protoPath: [join(__dirname, '../generated/serving/SocketServingService.proto'), join(__dirname, '../generated/common/Core.proto')],
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

