import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { GrpcClientModule } from 'src/grpc/client/grpc.client.module';
import { SocketGrpcController } from 'src/socket/controller/socket.grpc.controller';
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
  imports: [GrpcClientModule, HttpModule, RedisModule, TerminusModule,],
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
