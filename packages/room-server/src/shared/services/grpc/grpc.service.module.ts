import { Module } from '@nestjs/common';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { OtModule } from '../../../datasheet/_modules/ot.module';
import { NodeServiceModule } from '../../../datasheet/_modules/node.service.module';
import { ResourceServiceModule } from '../../../datasheet/_modules/resource.service.module';
import { UserServiceModule } from '../../../datasheet/_modules/user.service.module';

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
