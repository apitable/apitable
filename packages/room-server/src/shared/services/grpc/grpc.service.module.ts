import { Module } from '@nestjs/common';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { OtModule } from '../../../database/_modules/ot.module';
import { NodeServiceModule } from '../../../database/_modules/node.service.module';
import { ResourceServiceModule } from '../../../database/_modules/resource.service.module';
import { UserServiceModule } from '../../../database/_modules/user.service.module';

@Module({
  imports: [
    OtModule,
    UserServiceModule,
    ResourceServiceModule,
    NodeServiceModule,
  ],
  exports: [GrpcSocketService],
  providers: [GrpcSocketService],
})
export class GrpcServiceModule {}
