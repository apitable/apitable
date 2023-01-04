import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerRepository } from 'automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'automation/repositories/automation.trigger.type.repository';
import { RobotModule } from 'automation/robot.module';
import { CommandModule } from 'database/command/command.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { EventService } from './services/event.service';

@Module({
  imports: [
    CommandModule,
    DatasheetModule,
    RobotModule,
    TypeOrmModule.forFeature([
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      AutomationTriggerRepository,
      AutomationTriggerTypeRepository,
    ]),
  ],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
