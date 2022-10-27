import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ClientGrpcProxy, ClientsModule } from '@nestjs/microservices';
import { GatewayConstants } from 'src/socket/constants/gateway.constants';
import { join } from 'path';
import { NestClient } from 'src/grpc/client/nest.client';
import { RedisModule } from 'src/socket/service/redis/redis.module';
import { RedisService } from 'src/socket/service/redis/redis.service';
import { VikaGrpcClientProxy } from 'src/grpc/client/vika.grpc.client.proxy';
import { SocketConstants } from 'src/socket/constants/socket-constants';
import { VikaGrpcClientProxyXxlJob } from 'src/grpc/client/vika.grpc.client.proxy.xxljob';
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
// 默认url为集群服务访问地址
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
// default url
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
