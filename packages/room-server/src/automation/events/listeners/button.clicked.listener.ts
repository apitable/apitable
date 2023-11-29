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
import { ButtonClickedEvent, ButtonClickedEventContext } from 'automation/events/domains/button.clicked.event';
import { isNull } from 'lodash';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { ResourceRobotTriggerDto } from '../../dtos/trigger.dto';
import { AutomationService } from '../../services/automation.service';
import { RobotTriggerService } from '../../services/robot.trigger.service';
import { isHandleEvent } from '../helpers/listener.helper';
import { IShouldFireRobot, TriggerEventHelper } from '../helpers/trigger.event.helper';

@Injectable()
export class ButtonClickedListener {
  private readonly options: IEventListenerOptions;

  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
    private readonly automationService: AutomationService,
    private readonly robotTriggerService: RobotTriggerService,
    private readonly triggerEventHelper: TriggerEventHelper,
  ) {
    this.options = defaultEventListenerOptions;
  }

  @OnEvent(OPEventNameEnums.ButtonClicked, { async: true })
  public async handleButtonClickedEvent(event: ButtonClickedEvent): Promise<string | void> {
    if (!isHandleEvent(event, event.beforeApply, this.options)) {
      return;
    }

    const eventContext = event.context;
    const resourceId = eventContext.datasheetId;
    if (!resourceId) return;
    return await this.automationEventHandler(eventContext);
  }

  private async automationEventHandler(context: ButtonClickedEventContext): Promise<string | void> {
    const trigger = await this.robotTriggerService.getTriggerByTriggerId(context.triggerId);
    if (!trigger || isNull(trigger.input)) {
      return;
    }
    const shouldFireRobot = this.getRenderTrigger(trigger, context);
    if (shouldFireRobot) {
      return await this.automationService.handleTask(shouldFireRobot.robotId, shouldFireRobot.trigger);
    }
  }

  public getRenderTrigger(trigger: ResourceRobotTriggerDto, eventContext: ButtonClickedEventContext): IShouldFireRobot | null {
    const triggerInput = this.triggerEventHelper.renderInput(trigger.input!);
    if (triggerInput.datasheetId === eventContext.datasheetId) {
      return {
        robotId: trigger.robotId,
        trigger: {
          triggerId: trigger.triggerId,
          input: triggerInput,
          output: eventContext,
        },
      };
    }
    return null;
  }
}
