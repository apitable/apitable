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

import { IRobotTaskRuntimeContext, OperatorEnums } from 'automation_manager/interface';
import type { IReduxState } from 'exports/store/interfaces';
import { Field } from 'model/field';
import { FOperator } from 'types/view_types';

/**
 * all functions under this file are context-based which means they will use something from context
 */

export function getNodeOutput(_context: IRobotTaskRuntimeContext, nodeId: string) {
  if (!_context.executedNodeIds.includes(nodeId) && !_context.executedNodeIds.includes(_context.robot.triggerId)) {
    throw Error(`${nodeId} Does Not Executed!`);
  }
  return _context.context[nodeId]?.output || _context.context[_context.robot.triggerId]?.output;
}

// for now we have 3 trigger of apitable, their output will be like this:
interface IEventContext {
  datasheetId: string;
  recordId: string;
  fields: object;
  state: IReduxState;
}

const getFieldValue = (context: IEventContext, fieldId: string) => {
  return context.fields[fieldId];
};

/**
 *  we already implement the interface of FOperator which can compare 2 cellValues, so we can use it directly.
 */
const IMagicOperatorMap = {
  [OperatorEnums.Equal]: FOperator.Is,
  [OperatorEnums.NotEqual]: FOperator.IsNot,
  [OperatorEnums.GreaterThan]: FOperator.IsGreater,
  [OperatorEnums.GreaterThanOrEqual]: FOperator.IsGreaterEqual,
  [OperatorEnums.LessThan]: FOperator.IsLess,
  [OperatorEnums.LessThanOrEqual]: FOperator.IsLessEqual,
  [OperatorEnums.IsNull]: FOperator.IsEmpty,
  [OperatorEnums.IsNotNull]: FOperator.IsNotEmpty,
  [OperatorEnums.Includes]: FOperator.Contains,
  [OperatorEnums.NotIncludes]: FOperator.DoesNotContain,
};

const makeFunction = (operator: OperatorEnums, funcName: string) => {
  const func = (...args: any[]) => {
    const [ctx, fieldId, b] = args;
    const fieldMap = ctx.state.datasheetMap[ctx.datasheetId].datasheet?.snapshot.meta.fieldMap!;
    const field = fieldMap[fieldId];
    // if the field is deleted, the filter should be invalid. return false
    if (!field) return false;
    return Field.bindContext(field, ctx.state).isMeetFilter(
      IMagicOperatorMap[operator],
      getFieldValue(ctx, fieldId),
      b
    );
  };
  Object.defineProperty(func, 'name', { writable: false, value: funcName });
  return func;
};

export const greaterThan = makeFunction(OperatorEnums.GreaterThan, 'greaterThan');
export const greaterThanOrEqual = makeFunction(OperatorEnums.GreaterThanOrEqual, 'greaterThanOrEqual');
export const lessThan = makeFunction(OperatorEnums.LessThan, 'lessThan');
export const lessThanOrEqual = makeFunction(OperatorEnums.LessThanOrEqual, 'lessThanOrEqual');
export const equal = makeFunction(OperatorEnums.Equal, 'equal');
export const notEqual = makeFunction(OperatorEnums.NotEqual, 'notEqual');
export const isNull = makeFunction(OperatorEnums.IsNull, 'isNull');
export const isNotNull = makeFunction(OperatorEnums.IsNotNull, 'isNotNull');
export const includes = makeFunction(OperatorEnums.Includes, 'includes');
export const notIncludes = makeFunction(OperatorEnums.NotIncludes, 'notIncludes');

