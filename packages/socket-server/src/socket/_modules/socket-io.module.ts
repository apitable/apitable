import { Module } from '@nestjs/common';
import { SocketIoService } from '../service/socket-io/socket-io.service';
import { RedisModule } from './redis.module';
import { NestModule } from './nest.module';
import { RoomModule } from './room.module';

@Module({
  imports: [RedisModule, NestModule, RoomModule],
  providers: [SocketIoService],
  exports: [SocketIoService],
})
export class SocketIoModule { }
