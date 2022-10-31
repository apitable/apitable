import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationRobotRepository } from '../automation/repositories/automation.robot.repository';
import { AutomationTriggerRepository } from '../automation/repositories/automation.trigger.repository';
import { AutomationRunHistoryRepository } from '../automation/repositories/automation.run.history.repository';
import { AutomationService } from '../automation/services/automation.service';
import { NodeRepository } from '../database/repositories/node.repository';
import { AutomationServiceRepository } from '../automation/repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from '../automation/repositories/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from '../automation/repositories/automation.action.type.repository';

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
