import { Module } from '@nestjs/common';
import { ServiceModule } from './socket/service/service.module';
import { GatewayModule } from './socket/gateway/gateway.module';
import { Log4jsModule } from './socket/adapter/log4js/log4js.module';
import { ControllerModule } from './socket/controller/controller.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ServiceModule, GatewayModule, ControllerModule, Log4jsModule, ScheduleModule.forRoot()],
})
export class AppModule {}
