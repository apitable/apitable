import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationActionRepository } from './repositories/automation.action.repository';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from './repositories/automation.run.history.repository';
import { AutomationTriggerRepository } from './repositories/automation.trigger.repository';
import { AutomationServiceModule } from './services/automation.service.module';
import { UserServiceModule } from '../database/_modules/user.service.module';
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
