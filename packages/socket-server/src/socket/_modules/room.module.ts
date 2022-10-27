import { Module } from '@nestjs/common';
import { RoomService } from '../service/room/room.service';
import { NestModule } from './nest.module';
import { GrpcClientModule } from 'src/grpc/client/grpc.client.module';

@Module({
  imports: [NestModule, GrpcClientModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {
}
