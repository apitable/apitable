import { IRobotTaskRuntimeContext, OperatorEnums } from 'automation_manager/interface';
import { Field } from 'model';
import { IReduxState } from 'store';
import { FOperator } from 'types/view_types';

// 和上下文相关的函数
export function getNodeOutput(_context: IRobotTaskRuntimeContext, nodeId: string) {
  if (!_context.executedNodeIds.includes(nodeId)) {
    throw Error(`${nodeId} Does Not Executed!`);
  }
  return _context.context[nodeId].output;
}

/**
 * 「当符合匹配条件时」trigger filter 相关的处理函数，bool 运算符相关。 桥接到 FOperator 上。
 *  「记录更新」和「记录创建」事件会走到这里来。所以这 2 个事件需要提供 state。
 */

interface IEventContext {
  datasheetId: string;
  recordId: string;
  fields: object;
  state: IReduxState;
}

const getFieldValue = (context: IEventContext, fieldId: string) => {
  return context.fields[fieldId];
};

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
  const func = (...args) => {
    const [ctx, fieldId, b] = args;
    const fieldMap = ctx.state.datasheetMap[ctx.datasheetId].datasheet?.snapshot.meta.fieldMap!;
    const field = fieldMap[fieldId];
    // 存在字段被删除的情况，这种时候应该使过滤失效。返回 false
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

