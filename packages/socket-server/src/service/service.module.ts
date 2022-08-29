import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notification/notification.module';
import { IndicatorModule } from './indicator/indicator.module';
import { NestModule } from './nest/nest.module';
import { SocketIoModule } from './socket-io/socket-io.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [RedisModule, NotificationModule, IndicatorModule, NestModule, SocketIoModule, RoomModule],
  exports: [RedisModule, NotificationModule, IndicatorModule, NestModule, SocketIoModule, RoomModule],
})
export class ServiceModule { }
