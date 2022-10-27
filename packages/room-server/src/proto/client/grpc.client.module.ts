import { Global, Injectable, Module } from '@nestjs/common';
import { ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { ClientsModuleOptionsFactory } from '@nestjs/microservices/module/interfaces/clients-module.interface';
import { GRPC_MAX_PACKAGE_SIZE, SOCKET_GRPC_CLIENT } from '../../shared/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GrpcSocketClient } from 'proto/client/grpc.socket.client';

@Global()
@Injectable()
export class GrpcSocketClientModuleOption implements ClientsModuleOptionsFactory {
  constructor(private configService: ConfigService) {
  }
  createClientOptions(): Promise<ClientProvider> | ClientProvider {
    return {
      transport: Transport.GRPC,
      options: {
        url: process.env.SOCKET_GRPC_URL || this.configService.get<string>('socket.grpcUrl'),
        package: ['vika.grpc'],
        protoPath: [join(__dirname, '../changeset.service.proto')],
        // 100M
        maxSendMessageLength: GRPC_MAX_PACKAGE_SIZE,
        maxReceiveMessageLength: GRPC_MAX_PACKAGE_SIZE,
        loader: {
          json: true
        }
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

