import { Module } from '@nestjs/common';
import { RedisModule } from './redis.module';
import { NotificationModule } from './notification.module';
import { IndicatorModule } from './indicator.module';
import { NestModule } from './nest.module';
import { SocketIoModule } from './socket-io.module';
import { RoomModule } from './room.module';

@Module({
  imports: [RedisModule, NotificationModule, IndicatorModule, NestModule, SocketIoModule, RoomModule],
  exports: [RedisModule, NotificationModule, IndicatorModule, NestModule, SocketIoModule, RoomModule],
})
export class ServiceModule { }
