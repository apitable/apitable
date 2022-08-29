import { and, concatParagraph, newArray, newObject, or, concatString, getObjectProperty } from './base';
import {
  equal, getNodeOutput, greaterThan, greaterThanOrEqual,
  includes, isNotNull, isNull, lessThan,
  lessThanOrEqual, notEqual, notIncludes
} from './context_base';

export * from './base';
export * from './context_base';

export const TRIGGER_INPUT_FILTER_FUNCTIONS = [
  greaterThan,
  greaterThanOrEqual,
  lessThan,
  lessThanOrEqual,
  equal,
  notEqual,
  isNull,
  isNotNull,
  includes,
  notIncludes,
  and,
  or,
];

const makeFunction = (func: any, funcName: string) => {
  Object.defineProperty(func, 'name', { writable: false, value: funcName });
  return func;
};

// !!!下面的导出为什么要这样写呢？
// core 的代码是 build 完之后，再给 pc 用的，function 会被编译一遍。name 信息会丢失。本地开发没问题, 但是 build 完之后表现异常

export const TRIGGER_INPUT_PARSER_FUNCTIONS = [
  makeFunction(newObject, 'newObject'),
  makeFunction(newArray, 'newArray'),
];

// 这个是给前端校验用的
export const ACTION_INPUT_PARSER_BASE_FUNCTIONS = [
  makeFunction(and, 'and'),
  makeFunction(or, 'or'),
  makeFunction(concatString, 'concatString'),
  makeFunction(concatParagraph, 'concatParagraph'),
  makeFunction(newObject, 'newObject'),
  makeFunction(newArray, 'newArray'),
  makeFunction(getObjectProperty, 'getObjectProperty'),
  makeFunction(getNodeOutput, 'getNodeOutput'),
];

// 也是给前端用的，在不知道上下文的情况下，不解析动态参数
export const ACTION_INPUT_PARSER_PASS_THROUGH_FUNCTIONS = [
  makeFunction(getNodeOutput, 'getNodeOutput')
];