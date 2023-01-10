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
  IExpressionOperand, InputParser, MagicVariableParser, OperandTypeEnums, OperatorEnums,
  TRIGGER_INPUT_FILTER_FUNCTIONS, TRIGGER_INPUT_PARSER_FUNCTIONS } from '@apitable/core';
import { Injectable } from '@nestjs/common';
import { getRecordUrl } from 'shared/helpers/env';
import { AutomationTriggerEntity } from '../../entities/automation.trigger.entity';
import { EventTypeEnums } from '../domains/event.type.enums';
import { AutomationService } from '../../services/automation.service';
import { Logger } from 'winston';
import { InjectLogger } from 'shared/common';
import { CommonEventContext, CommonEventMetaContext } from '../domains/common.event';

export const OFFICIAL_SERVICE_SLUG = 'vika';

export type IShouldFireRobot = {
  robotId: string;
  trigger: {
    input: any;
    output: any;
  }
};

@Injectable()
export class TriggerEventHelper {

  private _triggerInputParser: InputParser<any>;

  private _triggerFilterInputParser: InputParser<any>;

  constructor(
    @InjectLogger() private readonly logger: Logger,
    private readonly automationService: AutomationService,
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

  public recordCreatedTriggerHandler(eventContext: CommonEventContext, metaContext: CommonEventMetaContext) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    const { datasheetId, datasheetName, recordId } = eventContext;
    const triggerSlug = `${EventTypeEnums.RecordCreated}@${OFFICIAL_SERVICE_SLUG}`;
    const conditionalTriggers = this._getConditionalTriggers(dstIdTriggersMap[datasheetId], triggerSlugTypeIdMap[triggerSlug]);
    if (conditionalTriggers.length === 0) return;

    // resource bound to robot and form id in trigger input is identical
    const shouldFireRobots: IShouldFireRobot[] = conditionalTriggers
      .filter(item => Boolean(item.input))
      .reduce((prev, item) => {
        const triggerInput = this.renderInput(item.input!);
        if (triggerInput.datasheetId === datasheetId) {
          const triggerOutput = this.getTriggerOutput(datasheetId, datasheetName, recordId, eventContext);
          prev.push({
            robotId: item.robotId,
            trigger: {
              input: triggerInput,
              output: triggerOutput,
            }
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);

    this.logger.info('recordCreatedTriggerHandler', {
      msgIds,
      shouldFireRobotIds: shouldFireRobots.map(robot => robot.robotId),
    });

    shouldFireRobots.forEach(robot => {
      this.automationService.handleTask(robot.robotId, robot.trigger).then(_ => {});
    });
  }

  public recordMatchConditionsTriggerHandler(eventContext: CommonEventContext, metaContext: CommonEventMetaContext) {
    const { dstIdTriggersMap, triggerSlugTypeIdMap, msgIds } = metaContext;
    const { datasheetId, datasheetName, recordId } = eventContext;
    const triggerSlug = `${EventTypeEnums.RecordMatchesConditions}@${OFFICIAL_SERVICE_SLUG}`;
    const conditionalTriggers = this._getConditionalTriggers(dstIdTriggersMap[datasheetId], triggerSlugTypeIdMap[triggerSlug]);
    if (conditionalTriggers.length === 0) return;

    const shouldFireRobots: IShouldFireRobot[] = conditionalTriggers
      .filter(item => Boolean(item.input))
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
              input: triggerInput,
              output: triggerOutput
            }
          });
        }
        return prev;
      }, [] as IShouldFireRobot[]);

    this.logger.info('recordMatchConditionsTriggerHandler', {
      msgIds,
      shouldFireRobotIds: shouldFireRobots.map(robot => robot.robotId),
    });

    shouldFireRobots.forEach(robot => {
      this.automationService.handleTask(robot.robotId, robot.trigger).then(_ => {});
    });
  }

  private getTriggerOutput(datasheetId: string, datasheetName: string, recordId: string, eventContext: CommonEventContext) {
    return {
      // the old structure: left for Qianfan, should delete later
      datasheet: {
        id: datasheetId,
        name: datasheetName
      },
      record: {
        id: recordId,
        url: getRecordUrl(datasheetId, recordId),
        fields: eventContext.eventFields
      },
      // the new structure below: flat data structure
      datasheetId,
      datasheetName,
      recordId,
      recordUrl: getRecordUrl(datasheetId, recordId),
      ...eventContext.eventFields
    };
  }

  private _getConditionalTriggers(triggers: AutomationTriggerEntity[] | undefined, triggerTypeId: string | undefined): AutomationTriggerEntity[]{
    if (!triggers) {
      return [];
    }
    return triggers.filter(item => triggerTypeId === item.triggerTypeId);
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
        filter.operands.forEach(operand => {
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
    const isIntersect = filterFieldIds.some(item => eventContext.diffFields.includes(item));
    // triggerInput.filter is also an expression.
    return isIntersect && this._triggerFilterInputParser.expressionParser.exec(filter, eventContext);
  }

}