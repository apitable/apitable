import { Module } from '@nestjs/common';
import { ActuatorModule } from 'actuator/actuator.module';
import { RobotModule } from 'automation/robot.module';
import { DatabaseModule } from 'database/database.module';
import { FusionApiModule } from 'fusion/fusion.api.module';
import { SharedModule } from 'shared/shared.module';

@Module({
  imports: [
  ActuatorModule,
  RobotModule,
  FusionApiModule,
  SharedModule, 
  DatabaseModule,
  ],
  controllers: [],
  })
export class EntryModule {}
