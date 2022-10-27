import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRobotRepository } from '../repositories/automation.robot.repository';
import { AutomationTriggerRepository } from '../repositories/automation.trigger.repository';
import { AutomationRunHistoryRepository } from '../repositories/automation.run.history.repository';
import { AutomationService } from './automation.service';
import { NodeRepository } from '../../database/repositories/node.repository';
import { AutomationServiceRepository } from '../repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../repositories/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from '../repositories/automation.action.type.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NodeRepository,
      AutomationTriggerRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
      AutomationServiceRepository,
      AutomationTriggerTypeRepository,
      AutomationActionTypeRepository
    ]),
  ],
  providers: [AutomationService],
  exports: [AutomationService],
})
export class AutomationServiceModule { }
