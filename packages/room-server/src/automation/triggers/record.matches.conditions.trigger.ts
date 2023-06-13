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
import { ITrigger, ITriggerFactory, IParam } from './trigger.factory';
import {
  BasicOpenValueType,
  IExpression,
  IExpressionOperand,
  IRecordCellValue,
  IReduxState,
  OperandTypeEnums,
  OperatorEnums
} from '@apitable/core';
import { getTriggerOutput, triggerFilterInputParser, triggerInputParser } from './trigger.helper';

export interface IRecordMatchesConditionsParamExtra {
  datasheetId: string;
  datasheetName: string;
  recordId: string;
  eventFields: { [fieldId: string]: BasicOpenValueType | null };
  fields: IRecordCellValue;
  diffFields: string[];
  state: IReduxState;
}

interface IFilterContext {
  fields: IRecordCellValue;
  diffFields: string[];
  state: IReduxState;
}

export class RecordMatchesConditionsTriggerFactory implements ITriggerFactory<IParam<IRecordMatchesConditionsParamExtra>> {
  createTrigger(param: IParam<IRecordMatchesConditionsParamExtra>): ITrigger | null {
    const triggerInput = triggerInputParser.render(param.input as IExpressionOperand, {});
    const isSameResource = triggerInput.datasheetId === param.extra.datasheetId;
    // TODO: Filter condition matching, robot is only triggered when condition is matched.
    const isMatchFilterConditions = filterExec(triggerInput.filter, param.extra);
    if (isSameResource && isMatchFilterConditions) {
      return {
        input: triggerInput,
        output: getTriggerOutput(param.extra.datasheetId, param.extra.datasheetName, param.extra.recordId, param.extra.eventFields),
      };
    }
    return null;
  }
}

const filterExec = (filter: IExpression, context: IFilterContext): boolean => {
  if (!filter) {
    return false;
  }
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
  const isIntersect = filterFieldIds.some(item => context.diffFields.includes(item));
  // triggerInput.filter is also an expression.
  return isIntersect && triggerFilterInputParser.expressionParser.exec(filter, context);
};
