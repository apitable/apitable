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

import { defaultEventListenerOptions, FieldType, IEventListenerOptions, IWorkDocValue, OPEventNameEnums } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { DocumentBaseService } from 'workdoc/services/document.base.service';
import { ResourceRobotTriggerDto } from '../../dtos/trigger.dto';
import { AutomationService } from '../../services/automation.service';
import { RobotTriggerService } from '../../services/robot.trigger.service';
import { EventTypeEnums } from '../domains/event.type.enums';
import { FormSubmittedEvent, FormSubmittedEventContext } from '../domains/form.submitted.event';
import { isHandleEvent } from '../helpers/listener.helper';
import { IShouldFireRobot, TriggerEventHelper } from '../helpers/trigger.event.helper';

@Injectable()
export class FormSubmittedListener {
  private readonly options: IEventListenerOptions;

  constructor(
    // @ts-ignore
    @InjectLogger() private readonly logger: Logger,
    private readonly automationService: AutomationService,
    private readonly robotTriggerService: RobotTriggerService,
    private readonly triggerEventHelper: TriggerEventHelper,
    private readonly documentBaseService: DocumentBaseService,
  ) {
    this.options = defaultEventListenerOptions;
  }

  @OnEvent(OPEventNameEnums.FormSubmitted, { async: true })
  public async handleFormSubmittedEvent(event: FormSubmittedEvent) {
    if (!isHandleEvent(event, event.beforeApply, this.options)) {
      return;
    }

    const eventContext = event.context;
    const resourceId = eventContext.datasheetId;
    if (!resourceId) return;
    await Promise.all([this.automationEventHandler(resourceId, eventContext), this.workdocEventHandler(resourceId, eventContext)]);
  }

  private async automationEventHandler(datasheetId: string, context: FormSubmittedEventContext) {
    const triggers = await this.robotTriggerService.getTriggersByResourceAndEventType(datasheetId, context.formId, EventTypeEnums.FormSubmitted);
    if (triggers.length === 0) {
      return;
    }
    const shouldFireRobots = this.getRenderTriggers(triggers, context);
    this.logger.info('formSubmittedListener', {
      formId: context.formId,
      recordId: context.recordId,
      shouldFireRobotIds: shouldFireRobots.map((robot) => robot.robotId),
    });
    await Promise.all(
      shouldFireRobots.map((robot) => {
        return this.automationService.handleTask(robot.robotId, robot.trigger);
      }),
    );
  }

  public getRenderTriggers(triggers: ResourceRobotTriggerDto[], eventContext: FormSubmittedEventContext): IShouldFireRobot[] {
    return triggers
      .filter((item) => Boolean(item.input))
      .reduce((prev, item) => {
        const triggerInput = this.triggerEventHelper.renderInput(item.input!);
        if (triggerInput.formId === eventContext.formId) {
          prev.push({
            robotId: item.robotId,
            trigger: {
              triggerId: item.triggerId,
              input: triggerInput,
              output: eventContext,
            },
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);
  }

  private async workdocEventHandler(datasheetId: string, context: FormSubmittedEventContext) {
    if (!context.fieldTypeMap) {
      return;
    }
    const documentIds = [];
    for (const [fieldId, type] of (context.fieldTypeMap as Map<string, number>).entries()) {
      if (FieldType.WorkDoc !== type || !context[fieldId]) {
        continue;
      }
      const cellValue = context[fieldId] as IWorkDocValue[];
      for (const value of cellValue) {
        value.documentId && documentIds.push(value.documentId);
      }
    }
    if (documentIds.length === 0) {
      return;
    }
    await this.documentBaseService.updateRecordIdProps(datasheetId, documentIds, context.recordId);
  }
}
