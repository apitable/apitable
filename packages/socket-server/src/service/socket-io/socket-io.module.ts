import { Module } from '@nestjs/common';
import { SocketIoService } from './socket-io.service';
import { RedisModule } from '../redis/redis.module';
import { NestModule } from '../nest/nest.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [RedisModule, NestModule, RoomModule],
  providers: [SocketIoService],
  exports: [SocketIoService],
})
export class SocketIoModule { }
