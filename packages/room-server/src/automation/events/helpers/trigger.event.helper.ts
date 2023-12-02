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

import {
  IExpression,
  IExpressionOperand,
  InputParser,
  MagicVariableParser,
  OperandTypeEnums,
  OperatorEnums,
  TRIGGER_INPUT_FILTER_FUNCTIONS,
  TRIGGER_INPUT_PARSER_FUNCTIONS,
} from '@apitable/core';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { enableAutomationWorker } from 'app.environment';
import { InjectLogger } from 'shared/common';
import { RunHistoryStatusEnum } from 'shared/enums/automation.enum';
import { IdWorker } from 'shared/helpers';
import { getRecordUrl } from 'shared/helpers/env';
import { automationExchangeName, automationRunning } from 'shared/services/queue/queue.module';
import { QueueSenderBaseService } from 'shared/services/queue/queue.sender.base.service';
import { Logger } from 'winston';
import { AutomationTriggerEntity } from '../../entities/automation.trigger.entity';
import { AutomationService } from '../../services/automation.service';
import { CommonEventContext, CommonEventMetaContext } from '../domains/common.event';
import { EventTypeEnums } from '../domains/event.type.enums';

export const OFFICIAL_SERVICE_SLUG = process.env.ROBOT_OFFICIAL_SERVICE_SLUG ? process.env.ROBOT_OFFICIAL_SERVICE_SLUG : 'apitable';

export type IShouldFireRobot = {
  robotId: string;
  trigger: {
    triggerId: string;
    input: any;
    output: any;
  };
};

@Injectable()
export class TriggerEventHelper {
  private _triggerInputParser: InputParser<any>;

  private _triggerFilterInputParser: InputParser<any>;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    @Inject(forwardRef(() => AutomationService))
    private readonly automationService: AutomationService,
    private readonly queueService: QueueSenderBaseService,
  ) {
    // Convert trigger input to plain object
    this._triggerInputParser = TriggerEventHelper.MAKE_INPUT_PARSER(TRIGGER_INPUT_PARSER_FUNCTIONS);
    this._triggerFilterInputParser = TriggerEventHelper.MAKE_INPUT_PARSER(TRIGGER_INPUT_FILTER_FUNCTIONS);
  }

  public renderInput(input: object) {
    return this._triggerInputParser.render(input as IExpressionOperand, {});
  }

  private static MAKE_INPUT_PARSER(functions: any[]) {
    return new InputParser(new MagicVariableParser<any>(functions));
  }

  public async recordCreatedTriggerHandler(eventContext: CommonEventContext, metaContext: CommonEventMetaContext) {
    await this._recordTriggerHandler(EventTypeEnums.RecordCreated, eventContext, metaContext);
  }

  public async recordMatchConditionsTriggerHandler(eventContext: CommonEventContext, metaContext: CommonEventMetaContext) {
    await this._recordTriggerHandler(EventTypeEnums.RecordMatchesConditions, eventContext, metaContext);
  }

  private async _recordTriggerHandler(eventType: string, eventContext: CommonEventContext, metaContext: CommonEventMetaContext) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;

    const triggerSlug = `${eventType}@${OFFICIAL_SERVICE_SLUG}`;
    const conditionalTriggers = this._getConditionalTriggers(dstIdTriggersMap[eventContext.datasheetId], triggerSlugTypeIdMap[triggerSlug]);
    if (conditionalTriggers.length === 0) return;

    let shouldFireRobots;
    if (eventType === EventTypeEnums.RecordCreated) {
      shouldFireRobots = this.getRenderTriggers(EventTypeEnums.RecordCreated, conditionalTriggers, eventContext);
    } else {
      shouldFireRobots = this.getRenderTriggers(EventTypeEnums.RecordMatchesConditions, conditionalTriggers, eventContext);
    }

    this.logger.info(`messageIds: [${msgIds}]: Execute ${eventType} handler. `, {
      shouldFireRobotIds: shouldFireRobots.map((robot) => robot.robotId),
    });

    await Promise.all(
      shouldFireRobots.map((robot) => {
        if (enableAutomationWorker) {
          return this.fireRoot(robot);
        }
        return this.automationService.handleTask(robot.robotId, robot.trigger).then((_) => {});
      }),
    );
  }

  async fireRoot(fireRobot: IShouldFireRobot) {
    const taskId = IdWorker.nextId().toString();
    const robot = await this.automationService.getRobotById(fireRobot.robotId);
    await this.automationService.saveTaskContext(
      {
        taskId,
        robotId: fireRobot.robotId,
        triggerId: robot.triggerId,
        triggerInput: fireRobot.trigger.input,
        triggerOutput: fireRobot.trigger.output,
        status: RunHistoryStatusEnum.PENDING,
      },
      robot,
    );
    await this.queueService.sendMessageWithId(taskId, automationExchangeName, automationRunning, { taskId: taskId, triggerId: robot.triggerId });
  }

  public getRenderTriggers(eventType: string, conditionalTriggers: AutomationTriggerEntity[], eventContext: CommonEventContext): IShouldFireRobot[] {
    const { datasheetId, datasheetName, recordId } = eventContext;
    if (eventType == EventTypeEnums.RecordMatchesConditions) {
      return conditionalTriggers
        .filter((item) => Boolean(item.input))
        .reduce((prev, item) => {
          const triggerInput = this.renderInput(item.input!);
          const isSameResource = triggerInput.datasheetId === datasheetId;
          // TODO: Filter condition matching, robot is only triggered when condition is matched.
          const isMatchFilterConditions = this._filterExec(triggerInput.filter, eventContext);
          if (isSameResource && isMatchFilterConditions) {
            const triggerOutput = this.getTriggerOutput(datasheetId, datasheetName, recordId, eventContext);
            prev.push({
              robotId: item.robotId,
              trigger: {
                triggerId: item.triggerId,
                input: triggerInput,
                output: triggerOutput,
              },
            });
          }
          return prev;
        }, [] as IShouldFireRobot[]);
    }
    return conditionalTriggers
      .filter((item) => Boolean(item.input))
      .reduce((prev, item) => {
        const triggerInput = this.renderInput(item.input!);
        if (triggerInput.datasheetId === datasheetId) {
          const triggerOutput = this.getTriggerOutput(datasheetId, datasheetName, recordId, eventContext);
          prev.push({
            robotId: item.robotId,
            trigger: {
              triggerId: item.triggerId,
              input: triggerInput,
              output: triggerOutput,
            },
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);
  }

  public getTriggerOutput(datasheetId: string, datasheetName: string, recordId: string, eventContext: CommonEventContext) {
    return {
      // the old structure: left for Qianfan, should delete later
      datasheet: {
        id: datasheetId,
        name: datasheetName,
      },
      record: {
        id: recordId,
        url: getRecordUrl(datasheetId, recordId),
        fields: eventContext.eventFields,
      },
      // the new structure below: flat data structure
      datasheetId,
      datasheetName,
      recordId,
      recordUrl: getRecordUrl(datasheetId, recordId),
      ...eventContext.eventFields,
      clickedBy: eventContext.uuid,
    };
  }

  public getDefaultTriggerOutput(datasheetId: string, datasheetName: string) {
    return {
      // the new structure below: flat data structure
      datasheetId,
      datasheetName,
    };
  }

  private _getConditionalTriggers(triggers: AutomationTriggerEntity[] | undefined, triggerTypeId: string | undefined): AutomationTriggerEntity[] {
    if (!triggers) {
      return [];
    }
    return triggers.filter((item) => triggerTypeId === item.triggerTypeId);
  }

  // Field matches condition filter
  private _filterExec(filter: IExpression, eventContext: any) {
    if (!filter) return false;
    // Currently only non-group filters are implemented. obtain fieldId of each item in operands,
    // compute sets by groups, take each operand in each group as a fieldId
    const filterFieldIdsSet = new Set<string>();
    const getAllFilterFieldIds = (filter: IExpression) => {
      if (filter.operator === OperatorEnums.And || filter.operator === OperatorEnums.Or) {
        // When the operator is AND or OR, operands are always expressions.
        filter.operands.forEach((operand) => {
          if (operand.type === OperandTypeEnums.Expression) {
            getAllFilterFieldIds(operand.value);
          }
        });
      } else {
        // When the operator is neither OR nor AND, it is a comparison operator,
        // the first operand is always a literal and a field ID.
        if (filter.operands[0]!.type === OperandTypeEnums.Literal) {
          filterFieldIdsSet.add(filter.operands[0]!.value);
        }
      }
    };
    getAllFilterFieldIds(filter);
    const filterFieldIds = Array.from(filterFieldIdsSet);
    // const filterFieldIds: string[] = filter.operands.map(item => item.value.operands[0].value);
    // If intersection exists, only when listened-on field changes, trigger
    const isIntersect = filterFieldIds.some((item) => eventContext.diffFields.includes(item));
    // triggerInput.filter is also an expression.
    return isIntersect && this._triggerFilterInputParser.expressionParser.exec(filter, eventContext);
  }
}
