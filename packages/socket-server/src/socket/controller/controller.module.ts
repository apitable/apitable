import { GatewayModule } from 'src/socket/gateway/gateway.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { ServiceModule } from '../service/service.module';
import { SocketController } from './socket.controller';
import { NodeController } from './node.controller';
import { DatasheetController } from './datasheet.controller';
import { SocketGrpcController } from 'src/socket/controller/socket.grpc.controller';

@Module({
  imports: [TerminusModule, ServiceModule, GatewayModule],
  controllers: [HealthController, SocketController, NodeController, DatasheetController, SocketGrpcController],
})
export class ControllerModule {}
