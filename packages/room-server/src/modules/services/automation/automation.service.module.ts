import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRobotRepository } from 'modules/repository/automation.robot.repository';
import { AutomationTriggerRepository } from 'modules/repository/automation.trigger.repository';
import { AutomationRunHistoryRepository } from 'modules/repository/automation.run.history.repository';
import { AutomationService } from './automation.service';
import { NodeRepository } from 'modules/repository/node.repository';
import { AutomationServiceRepository } from 'modules/repository/automation.service.repository';
import { AutomationTriggerTypeRepository } from 'modules/repository/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from 'modules/repository/automation.action.type.repository';

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
