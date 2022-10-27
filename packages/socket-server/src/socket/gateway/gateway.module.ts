import { Module } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { ServiceModule } from '../service/service.module';
import { RoomGateway } from './room.gateway';

@Module({
  imports: [ServiceModule],
  providers: [NotificationGateway, RoomGateway],
  exports: [RoomGateway],
})
export class GatewayModule {
}
