import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationActionRepository } from 'modules/repository/automation.action.repository';
import { AutomationRobotRepository } from 'modules/repository/automation.robot.repository';
import { AutomationRunHistoryRepository } from 'modules/repository/automation.run.history.repository';
import { AutomationTriggerRepository } from 'modules/repository/automation.trigger.repository';
import { AutomationServiceModule } from 'modules/services/automation/automation.service.module';
import { UserServiceModule } from 'modules/services/user/user.service.module';
import { RobotActionController } from './action.controller';
import { RobotActionTypeController } from './action.type.controller';
import { RobotController } from './robot.controller';
import { RobotRunHistoryController } from './run.history.controller';
import { RobotServiceController } from './service.controller';
import { RobotTriggerController } from './trigger.controller';
import { RobotTriggerTypeController } from './trigger.type.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutomationTriggerRepository,
      AutomationActionRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
    ]),
    UserServiceModule,
    AutomationServiceModule,
  ],
  controllers: [
    RobotController,
    RobotRunHistoryController,
    RobotActionTypeController,
    RobotTriggerTypeController,
    RobotActionController,
    RobotTriggerController,
    RobotServiceController,
  ],
})
export class RobotModule { }
