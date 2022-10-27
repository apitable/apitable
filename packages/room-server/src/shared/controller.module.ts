import { Module } from '@nestjs/common';
import { FusionApiModule } from '../fusion/fusion.api.module';
import { ActuatorModule } from '../actuator/actuator.module';
import { InternalModule } from '../datasheet/_modules/internal.module';

@Module({
  imports: [ActuatorModule, FusionApiModule, InternalModule],
  exports: [ActuatorModule, FusionApiModule, InternalModule],
  })
export class ControllerModule { }
