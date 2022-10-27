import { Module } from '@nestjs/common';
import { HealthController } from './controller/health.controller';
import { SocketController } from './controller/socket.controller';
import { NodeController } from './controller/node.controller';
import { DatasheetController } from './controller/datasheet.controller';
import { SocketGrpcController } from 'src/socket/controller/socket.grpc.controller';
import { NotificationGateway } from './gateway/notification.gateway';
import { RoomGateway } from './gateway/room.gateway';
import { LocalHealthIndicator } from './service/indicator/local-health.indicator';
import { NestService } from './service/nest/nest.service';
import { NotificationService } from './service/notification/notification.service';
import { RoomService } from './service/room/room.service';
import { SocketIoService } from './service/socket-io/socket-io.service';
import { Log4jsModule } from './_modules/log4js.module';
import { HttpModule } from '@nestjs/axios';
import { GrpcClientModule } from 'src/grpc/client/grpc.client.module';
import { RedisModule } from './_modules/redis.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [GrpcClientModule, HttpModule, RedisModule, Log4jsModule, TerminusModule, ],
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
export class SocketModule {}
