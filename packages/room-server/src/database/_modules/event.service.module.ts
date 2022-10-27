import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationTriggerRepository } from '../../automation/repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from '../../automation/repositories/automation.trigger.type.repository';
import { AutomationServiceModule } from '../../automation/services/automation.service.module';
import { CommandServiceModule } from './command.service.module';
import { DatasheetServiceModule } from './datasheet.service.module';
import { EventService } from '../services/event/event.service';

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
