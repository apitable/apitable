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

import { defaultEventListenerOptions, IEventListenerOptions, OPEventNameEnums } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ResourceRobotTriggerDto } from '../../dtos/resource.robot.trigger.dto';
import { AutomationService } from '../../services/automation.service';
import { RobotTriggerService } from '../../services/robot.trigger.service';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { EventTypeEnums } from '../domains/event.type.enums';
import { IShouldFireRobot, TriggerEventHelper } from '../helpers/trigger.event.helper';
import { isHandleEvent } from '../helpers/listener.helper';
import { FormSubmittedEvent, FormSubmittedEventContext } from '../domains/form.submitted.event';

@Injectable()
export class FormSubmittedListener {

  private readonly options: IEventListenerOptions;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly automationService: AutomationService,
    private readonly robotTriggerService: RobotTriggerService,
    private readonly triggerEventHelper: TriggerEventHelper,
  ) {
    this.options = defaultEventListenerOptions;
  }

  @OnEvent(OPEventNameEnums.FormSubmitted, { async: true })
  public async handleFormSubmittedEvent(event: FormSubmittedEvent) {
    if(!isHandleEvent(event, event.beforeApply, this.options)) {
      return;
    }

    const eventContext = event.context;
    const resourceId = eventContext.datasheetId;
    if (!resourceId) return;
    const triggers = await this.robotTriggerService.getTriggersByResourceAndEventType(resourceId, EventTypeEnums.FormSubmitted);
    if (triggers.length === 0) {
      return;
    }
    const shouldFireRobots = this._getRenderTriggers(triggers, eventContext);
    this.logger.info('formSubmittedListener', {
      formId: eventContext.formId,
      recordId: eventContext.recordId,
      shouldFireRobotIds: shouldFireRobots.map(robot => robot.robotId),
    });
    shouldFireRobots.forEach(robot => {
      this.automationService.handleTask(robot.robotId, robot.trigger);
    });
  }

  private _getRenderTriggers(triggers: ResourceRobotTriggerDto[], eventContext: FormSubmittedEventContext): IShouldFireRobot[] {
    return triggers.filter(item => Boolean(item.input))
      .reduce((prev, item) => {
        const triggerInput = this.triggerEventHelper.renderInput(item.input!);
        if (triggerInput.formId === eventContext.formId) {
          prev.push({
            robotId: item.robotId,
            trigger: {
              input: triggerInput,
              output: eventContext,
            }
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);
  }
}
