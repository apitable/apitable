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

import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonClickedListener } from 'automation/events/listeners/button.clicked.listener';
import { NodeModule } from 'node/node.module';
import { UserModule } from 'user/user.module';
import { DocumentServiceDynamicModule } from 'workdoc/services/document.service.dynamic.module';
import { RobotActionController } from './controller/action.controller';
import { RobotActionTypeController } from './controller/action.type.controller';
import { RobotController } from './controller/robot.controller';
import { RobotRunHistoryController } from './controller/run.history.controller';
import { RobotTriggerController } from './controller/trigger.controller';
import { RobotTriggerTypeController } from './controller/trigger.type.controller';
import { TriggerEventHelper } from './events/helpers/trigger.event.helper';
import { FormSubmittedListener } from './events/listeners/form.submitted.listener';
import { RecordCreatedListener } from './events/listeners/record.created.listener';
import { RecordUpdatedListener } from './events/listeners/record.updated.listener';
import { AutomationActionRepository } from './repositories/automation.action.repository';
import { AutomationActionTypeRepository } from './repositories/automation.action.type.repository';
import { AutomationRobotRepository } from './repositories/automation.robot.repository';
import { AutomationRunHistoryRepository } from './repositories/automation.run.history.repository';
import { AutomationServiceRepository } from './repositories/automation.service.repository';
import { AutomationTriggerRepository } from './repositories/automation.trigger.repository';
import { AutomationTriggerTypeRepository } from './repositories/automation.trigger.type.repository';
import { AutomationService } from './services/automation.service';
import { RobotActionService } from './services/robot.action.service';
import { RobotRobotService } from './services/robot.robot.service';
import { RobotServiceDynamicModule } from './services/robot.service.dynamic.module';
import { RobotTriggerService } from './services/robot.trigger.service';
import { RobotTriggerTypeService } from './services/robot.trigger.type.service';

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
    ]),
    NodeModule,
    UserModule,
    RobotServiceDynamicModule.forRoot(),
    DocumentServiceDynamicModule.forRoot(),
  ],
  controllers: [
    RobotController,
    RobotRunHistoryController,
    RobotActionTypeController,
    RobotTriggerTypeController,
    RobotActionController,
    RobotTriggerController,
  ],
  providers: [
    AutomationService,
    RobotTriggerService,
    RobotTriggerTypeService,
    FormSubmittedListener,
    ButtonClickedListener,
    TriggerEventHelper,
    RecordCreatedListener,
    RecordUpdatedListener,
    RobotActionService,
    RobotRobotService,
    AmqpConnection,
  ],
  exports: [AutomationService, RobotTriggerService, RobotTriggerTypeService, TriggerEventHelper, ButtonClickedListener],
})
export class RobotModule {}
