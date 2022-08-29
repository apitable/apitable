import { Module } from '@nestjs/common';
import { GrpcController } from 'controllers/internal/grpc/grpc.controller';
import { GrpcServiceModule } from 'modules/grpc_service/grpc.service.module';
import { OtModule } from 'modules/ot/ot.module';
import { NodeServiceModule } from 'modules/services/node/node.service.module';

@Module({
  imports: [OtModule, GrpcServiceModule, NodeServiceModule],
  controllers: [GrpcController],
})
export class GrpcModule {}
