import { Module } from '@nestjs/common';
import { NotificationGateway } from '../gateway/notification.gateway';
import { ServiceModule } from './service.module';
import { RoomGateway } from '../gateway/room.gateway';

@Module({
  imports: [ServiceModule],
  providers: [NotificationGateway, RoomGateway],
  exports: [RoomGateway],
})
export class GatewayModule {
}
