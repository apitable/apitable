import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutomationActionRepository } from './repositories/automation.action.repository';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from './repositories/automation.run.history.repository';
import { AutomationTriggerRepository } from './repositories/automation.trigger.repository';
// import { UserServiceModule } from '../_modules/user.service.module';
import { RobotActionController } from './action.controller';
import { RobotActionTypeController } from './action.type.controller';
import { RobotController } from './robot.controller';
import { RobotRunHistoryController } from './run.history.controller';
import { RobotServiceController } from './service.controller';
import { RobotTriggerController } from './trigger.controller';
import { RobotTriggerTypeController } from './trigger.type.controller';
import { SharedModule } from 'shared/shared.module';
import { AutomationService } from './services/automation.service';
import { NodeRepository } from 'database/repositories/node.repository';
import { AutomationServiceRepository } from './repositories/automation.service.repository';
import { AutomationTriggerTypeRepository } from './repositories/automation.trigger.type.repository';
import { AutomationActionTypeRepository } from './repositories/automation.action.type.repository';
import { UserRepository } from 'database/repositories/user.repository';
import { UserService } from 'database/services/user/user.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      AutomationTriggerRepository,
      AutomationActionRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
    ]),
    // UserServiceModule,
    TypeOrmModule.forFeature([UserRepository]),
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
  providers: [
    AutomationService,
    UserService,
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
