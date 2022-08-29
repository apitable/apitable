import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerRepository } from 'modules/repository/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from 'modules/repository/automation.trigger.type.repository';
import { AutomationServiceModule } from '../automation/automation.service.module';
import { CommandServiceModule } from '../command/command.service.module';
import { DatasheetServiceModule } from '../datasheet/datasheet.service.module';
import { EventService } from './event.service';

@Module({
  imports: [
    DatasheetServiceModule,
    CommandServiceModule,
    AutomationServiceModule,
    TypeOrmModule.forFeature([AutomationTriggerRepository, AutomationTriggerTypeRepository]),
  ],
  providers: [EventService],
  exports: [EventService],
})
export class EventServiceModule { }
