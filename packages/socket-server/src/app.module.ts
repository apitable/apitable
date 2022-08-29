import { Module } from '@nestjs/common';
import { ServiceModule } from './service/service.module';
import { GatewayModule } from './gateway/gateway.module';
import { Log4jsModule } from './adapter/log4js/log4js.module';
import { ControllerModule } from './controller/controller.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ServiceModule, GatewayModule, ControllerModule, Log4jsModule, ScheduleModule.forRoot()],
})
export class AppModule {}
