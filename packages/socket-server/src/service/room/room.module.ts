import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { NestModule } from '../nest/nest.module';
import { GrpcClientModule } from 'src/grpc/client/grpc.client.module';

@Module({
  imports: [NestModule, GrpcClientModule],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {
}
