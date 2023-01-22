/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'user/repositories/user.repository';
import { UserService } from 'user/services/user.service';
import { RobotActionController } from './controller/action.controller';
import { RobotActionTypeController } from './controller/action.type.controller';
import { AutomationActionRepository } from './repositories/automation.action.repository';
import { AutomationActionTypeRepository } from './repositories/automation.action.type.repository';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from './repositories/automation.run.history.repository';
import { AutomationServiceRepository } from './repositories/automation.service.repository';
import { AutomationTriggerRepository } from './repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from './repositories/automation.trigger.type.repository';
import { RobotController } from './controller/robot.controller';
import { RobotRunHistoryController } from './controller/run.history.controller';
import { RobotServiceController } from './controller/service.controller';
import { AutomationService } from './services/automation.service';
import { RobotTriggerController } from './controller/trigger.controller';
import { RobotTriggerTypeController } from './controller/trigger.type.controller';
import { RobotServiceDynamicModule } from './services/robot.service.dynamic.module';
import { RobotTriggerService } from './services/robot.trigger.service';
import { RobotTriggerTypeService } from './services/robot.trigger.type.service';
import { FormSubmittedListener } from './events/listeners/form.submitted.listener';
import { TriggerEventHelper } from './events/helpers/trigger.event.helper';
import { RecordCreatedListener } from './events/listeners/record.created.listener';
import { RecordUpdatedListener } from './events/listeners/record.updated.listener';
import { RobotServiceService } from './services/robot.service.service';
import { NodeModule } from 'node/node.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AutomationTriggerRepository,
      AutomationActionRepository,
      AutomationRobotRepository,
      AutomationRunHistoryRepository,
      AutomationServiceRepository,
      AutomationTriggerTypeRepository,
      AutomationActionTypeRepository,
      // TODO(Troy): stop using other modules's repositories, use service instead, via importing the module
      UserRepository
    ]),
    NodeModule,
    RobotServiceDynamicModule.forRoot(),
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
  providers: [
    AutomationService,
    RobotTriggerService,
    RobotTriggerTypeService,
    RobotServiceService,
    UserService,
    FormSubmittedListener,
    TriggerEventHelper,
    RecordCreatedListener,
    RecordUpdatedListener,
  ],
  exports: [
    AutomationService,
    RobotTriggerService,
    RobotTriggerTypeService,
  ],
})
export class RobotModule {
}
