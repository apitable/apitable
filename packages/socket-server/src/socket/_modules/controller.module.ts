import { GatewayModule } from 'src/socket/_modules/gateway.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from '../controller/health.controller';
import { ServiceModule } from './service.module';
import { SocketController } from '../controller/socket.controller';
import { NodeController } from '../controller/node.controller';
import { DatasheetController } from '../controller/datasheet.controller';
import { SocketGrpcController } from 'src/socket/controller/socket.grpc.controller';

@Module({
  imports: [TerminusModule, ServiceModule, GatewayModule],
  controllers: [HealthController, SocketController, NodeController, DatasheetController, SocketGrpcController],
})
export class ControllerModule {}
