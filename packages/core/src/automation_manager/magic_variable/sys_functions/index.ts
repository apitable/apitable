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

// we must redefine the name of function, otherwise the name will be random after building
// this will be fine in local development, but will cause some strange bugs in production

export const TRIGGER_INPUT_PARSER_FUNCTIONS = [
  makeFunction(newObject, 'newObject'),
  makeFunction(newArray, 'newArray'),
];

// This is for front-end validation
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

// It is also used for the front end, without parsing dynamic parameters without knowing the context
export const ACTION_INPUT_PARSER_PASS_THROUGH_FUNCTIONS = [
  makeFunction(getNodeOutput, 'getNodeOutput')
];