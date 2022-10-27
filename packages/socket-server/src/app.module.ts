import { Module } from '@nestjs/common';
import { ServiceModule } from './socket/_modules/service.module';
import { GatewayModule } from './socket/_modules/gateway.module';
import { Log4jsModule } from './socket/_modules/log4js.module';
import { ControllerModule } from './socket/_modules/controller.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ServiceModule, GatewayModule, ControllerModule, Log4jsModule, ScheduleModule.forRoot()],
})
export class AppModule {}
