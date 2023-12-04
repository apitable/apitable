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
  AstNode,
  AstNodeType,
  BinaryOperatorNode,
  UnaryOperatorNode,
  ValueOperandNode,
  StringOperandNode,
  CallOperandNode,
  NumberOperandNode,
  PureValueOperandNode,
} from '../parser/ast';
import { TokenType } from '../lexer/token';
import { Functions } from '../functions';
import { IFormulaContext, FormulaBaseError, getBlankValueByType } from 'formula_parser/functions/basic';
import { Field } from 'model/field';
import { ArrayValueField } from 'model/field/array_field';
import { BasicValueType, FormulaFuncType } from 'types';
import { plus, minus, times, divide } from 'utils';
import { isNumber, isNull } from 'util';
import { t, Strings } from 'exports/i18n';
import { isString } from 'lodash';

export type ResolverFunction = (value: string, originValue?: boolean) => any;

export class Interpreter {
  readonly resolver: ResolverFunction;
  readonly context: IFormulaContext;

  constructor(resolver: ResolverFunction, scope: IFormulaContext) {
    this.resolver = resolver;
    this.context = scope;
  }

  private transformNodeValue(node: AstNode, value: any, tokenType: TokenType) {
    // Nodes of field value types need to perform dedicated string conversion logic
    if (node.name === AstNodeType.ValueOperandNode || node.name === AstNodeType.PureValueOperandNode) {
      const field = (node as ValueOperandNode).field;
      const fieldBasicValueType = Field.bindContext(field, this.context.state).basicValueType;
      /**
       * DateTime type is for comparison operators and needs to be compared in timestamp format,
       * @example {start time} = TODAY()
       */
      if (
        [BasicValueType.Number, BasicValueType.Boolean, BasicValueType.String].includes(fieldBasicValueType) ||
        (
          fieldBasicValueType === BasicValueType.DateTime &&
          [
            TokenType.Equal,
            TokenType.NotEqual,
            TokenType.Less,
            TokenType.LessEqual,
            TokenType.Greater,
            TokenType.GreaterEqual,
          ].includes(tokenType)
        )
      ) {
        return value;
      }

      if (fieldBasicValueType === BasicValueType.Array) {
        if (!value?.length) return null;
        switch (node.innerValueType) {
          // directly take the first value for calculation
          case BasicValueType.Number: {
            if (value.length > 1) {
              throw new FormulaBaseError('');
            }
            return Number(value[0]);
          }
          default:
            return (Field.bindContext(field, this.context.state) as ArrayValueField).arrayValueToString(value);
        }
      }

      return Field.bindContext(field, this.context.state).cellValueToString(value);
    }
    return value;
  }

  /**
   * Evaluate by accessing the abstract syntax tree
   * @param {AstNode} node
   * @param isErrorScope
   * @returns {any}
   * @memberof Interpreter
   */
  visit(node: AstNode, isErrorScope = false): any {
    if (!node) {
      throw new TypeError('A AST Node is required to visit');
    }
    try {
      switch (node.name) {
        case AstNodeType.BinaryOperatorNode: {
          return this.visitBinaryOperatorNode(node as BinaryOperatorNode);
        }
        case AstNodeType.StringOperandNode: {
          return this.visitStringOperatorNode(node as StringOperandNode);
        }
        case AstNodeType.CallOperandNode: {
          return this.visitCallOperatorNode(node as CallOperandNode, isErrorScope);
        }
        case AstNodeType.NumberOperandNode: {
          return this.visitNumberOperatorNode(node as NumberOperandNode);
        }
        case AstNodeType.UnaryOperatorNode: {
          return this.visitUnaryOperatorNode(node as UnaryOperatorNode);
        }
        case AstNodeType.ValueOperandNode: {
          return this.visitValueOperandNode(node as ValueOperandNode);
        }
        case AstNodeType.PureValueOperandNode: {
          return this.visitPureValueOperandNode(node as PureValueOperandNode);
        }
        default: return;
      }
    } catch (e) {
      if (isErrorScope) {
        return e;
      }
      throw e;
    }

    throw new TypeError(`Unexpected AST Node Type: ${node.name}`);
  }

  private visitBinaryOperatorNode(node: BinaryOperatorNode): any {
    const tokenType = node.token.type;
    let left = this.transformNodeValue(node.left, this.visit(node.left), tokenType);
    let right = this.transformNodeValue(node.right, this.visit(node.right), tokenType);

    // Perform value conversion processing on the BLANK function
    if (node.left.token?.value.toUpperCase() === 'BLANK') {
      left = getBlankValueByType(node.right.valueType, right);
    }
    if (node.right.token?.value.toUpperCase() === 'BLANK') {
      right = getBlankValueByType(node.left.valueType, left);
    }

    switch (tokenType) {
      case TokenType.And: {
        return Boolean(left && right);
      }
      case TokenType.Or: {
        return Boolean(left || right);
      }
      case TokenType.Add: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        if (isNumber(left) && isNumber(right)) {
          return plus(left, right);
        }
        return left + right;
      }
      case TokenType.Minus: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return minus(left, right);
      }
      case TokenType.Times: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return times(left, right);
      }
      case TokenType.Div: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return divide(left, right);
      }
      case TokenType.Mod: {
        left = left == null ? 0 : left;
        right = right == null ? 0 : right;
        return left % right;
      }
      case TokenType.Equal: {
        // tslint:disable-next-line: triple-equals
        return left == right; // eslint-disable-line eqeqeq
      }
      case TokenType.NotEqual: {
        // tslint:disable-next-line: triple-equals
        return left != right; // eslint-disable-line eqeqeq
      }
      case TokenType.Greater: {
        return left > right;
      }
      case TokenType.GreaterEqual: {
        return left >= right;
      }
      case TokenType.Less: {
        return left < right;
      }
      case TokenType.LessEqual: {
        return left <= right;
      }
      case TokenType.Concat: {
        return String(left == null ? '' : left) + String(right == null ? '' : right);
      }
      default: return;
    }
    throw new TypeError(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitUnaryOperatorNode(node: UnaryOperatorNode): number | boolean {
    if (node.token.type === TokenType.Not) {
      return !this.visit(node.child);
    }
    if (node.token.type === TokenType.Add) {
      return +this.visit(node.child);
    }
    if (node.token.type === TokenType.Minus) {
      return -this.visit(node.child);
    }
    throw new TypeError(`Visitor can't process AST Node Type: ${node.token.type}`);
  }

  private visitValueOperandNode(node: ValueOperandNode, originValue?: boolean): any {
    return this.resolver(node.value.slice(1, -1), originValue);
  }

  private visitPureValueOperandNode(node: PureValueOperandNode, originValue?: boolean): any {
    return this.resolver(node.value, originValue);
  }

  private visitStringOperatorNode(node: StringOperandNode): string {
    return node.value.slice(1, -1);
  }

  private visitCallOperatorNode(node: CallOperandNode, isErrorScope = false): any {
    const fnName = node.value.toUpperCase();
    const fnClass = Functions.get(fnName);
    if (!fnClass) {
      throw new TypeError(t(Strings.function_err_not_found_function_name_as, {
        fnName,
      }));
    }
    // The IS_ERROR function needs to monitor whether the internal equation will report an error,
    // and IF/SWITCH needs to execute until Error before reporting an error.
    // So here is a special mark for IS_ERROR/IF/SWITCH functions
    // TODO: Do ISERROR compatibility here first, and delete the user data after brushing
    if (fnName === 'ISERROR' || fnName === 'IS_ERROR' || fnName === 'IF' || fnName === 'SWITCH') {
      isErrorScope = true;
    }

    const params = node.params.map(param => {
      let value = this.visit(param, isErrorScope);
      let valueType = param.valueType;
      // Nodes of field value types need to perform dedicated string conversion logic
      if (param.name === AstNodeType.ValueOperandNode || param.name === AstNodeType.PureValueOperandNode) {
        const field = (param as ValueOperandNode).field;

        // If the parameter type is Array && is not accepted by the function parameter type
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.Array) {
          const innerValueType = param.innerValueType;

          // When the built-in type of the array is Number and there is only one item, the corresponding operation can be performed.
          // If there are multiple items, in order to avoid user misunderstanding, take the form of direct error reporting
          if (innerValueType === BasicValueType.Number) {
            if (value?.length > 1) {
              throw new FormulaBaseError('');
            }
            value = value && value[0];
          } else {
            // The built-in type of the array is not Number, directly converted to a string
            value = value?.length && value.filter((v: any) => !isNull(v)).join(', ');
          }
          innerValueType && (valueType = innerValueType);
        }

        /**
         * value value return rules (granularity is specific formula class):
         * 1. If acceptValueType does not contain valueType, it will be processed uniformly by the cellValueToString method;
         * 2. If you need to return the original value, you need to add the current valueType to acceptValueType;
         */
        if (!fnClass.func.acceptValueType.has(valueType)) {
          if (isString(value)) {
            value = value.split(', ');
          }
          value = Field.bindContext(field, this.context.state).cellValueToString(value as any);
        }
      } else {
        // Convert array type value to string type. (In theory, only field values will have array types, so this will not take effect)
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.Array) {
          value = String(value);
        }

        // Convert date type value to string type.
        if (!fnClass.func.acceptValueType.has(valueType) && valueType === BasicValueType.DateTime) {
          value = value == null ? value : new Date(value).toISOString();
        }
      }

      return { node: param, value };
    });

    fnClass.func.validateParams(node.params);
    // pre-check for DateTime class functions
    // LAST_MODIFIED_TIME is calculated based on record.recordMeta without the value of other cells
    if (fnClass.func.type === FormulaFuncType.DateTime && params.length && params[0]?.value == null && fnName !== 'LAST_MODIFIED_TIME') {
      return null;
    }
    return fnClass.func.func(params, this.context);
  }

  private visitNumberOperatorNode(node: NumberOperandNode): number {
    return Number(node.value);
  }
}
