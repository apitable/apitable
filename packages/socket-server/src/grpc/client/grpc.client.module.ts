import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ClientGrpcProxy, ClientsModule } from '@nestjs/microservices';
import { join } from 'path';
import { NestClient } from 'src/grpc/client/nest.client';
import { VikaGrpcClientProxy } from 'src/grpc/client/vika.grpc.client.proxy';
import { VikaGrpcClientProxyXxlJob } from 'src/grpc/client/vika.grpc.client.proxy.xxljob';
import { RedisModule } from 'src/socket/_modules/redis.module';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { RedisService } from 'src/socket/service/redis/redis.service';
import { GrpcClient } from './grpc.client';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: GatewayConstants.NEST_SERVICE,
        imports: [RedisModule, HttpModule],
        inject: [RedisService, HttpService],
        useFactory: (redisService: RedisService, httpService: HttpService) => {
          const {
            maxSendMessageLength,
            maxReceiveMessageLength,
            keepalive,
            channelOptions,
          } = SocketConstants.GRPC_OPTIONS;
          return {
            customClass: SocketConstants.GRPC_CLIENT_PROXY_HEALTH_MODEL === 'DEFAULT' ? VikaGrpcClientProxy : VikaGrpcClientProxyXxlJob,
            options: {
              url: GatewayConstants.NEST_GRPC_URL,
              maxSendMessageLength: maxSendMessageLength,
              maxReceiveMessageLength: maxReceiveMessageLength,
              keepalive: keepalive,
              channelOptions: channelOptions,
              package: [GatewayConstants.GRPC_PACKAGE],
              protoPath: [join(__dirname, '../proto/socket.service.proto'), join(__dirname, '../proto/socket.message.proto')],
              protoLoader: '@grpc/proto-loader',
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
              package: ["grpc.serving"],
              protoPath: [join(__dirname, '../proto/backend.serving.service.proto'), join(__dirname, '../proto/socket.message.proto')],
              loader: {
                json: true,
              },
            },
          };
        },
      },
    ]),
  ],
  providers: [NestClient, GrpcClient],
  exports: [NestClient, GrpcClient],
})
export class GrpcClientModule {
}
