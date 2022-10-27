import { Module } from '@nestjs/common';
import { GrpcController } from '../controllers/grpc.controller';
import { GrpcServiceModule } from '../../shared/services/grpc/grpc.service.module';
import { OtModule } from './ot.module';
import { NodeServiceModule } from './node.service.module';

@Module({
  imports: [OtModule, GrpcServiceModule, NodeServiceModule],
  controllers: [GrpcController],
})
export class GrpcModule {}
