import { Module } from '@nestjs/common';
import { GrpcSocketService } from 'shared/services/grpc/grpc.socket.service';
import { OtModule } from '../../../_modules/ot.module';
import { NodeServiceModule } from '../../../_modules/node.service.module';
import { ResourceServiceModule } from '../../../_modules/resource.service.module';
import { UserServiceModule } from '../../../_modules/user.service.module';

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
