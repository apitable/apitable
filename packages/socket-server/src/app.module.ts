import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [SocketModule, ScheduleModule.forRoot()],
  })
export class AppModule {}
