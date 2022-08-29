import { Module } from '@nestjs/common';
import { GrpcSocketService } from 'modules/grpc_service/grpc.socket.service';
import { OtModule } from 'modules/ot/ot.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';
import { ResourceServiceModule } from 'modules/services/resource/resource.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';

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
