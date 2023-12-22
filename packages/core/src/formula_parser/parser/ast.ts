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

import { Token, TokenType } from '../lexer/token';
import type { IFieldMap, IReduxState } from 'exports/store/interfaces';
import { Field } from 'model/field';
import { BasicValueType, IField } from 'types';
import { ROLLUP_KEY_WORDS } from 'formula_parser/consts';
import { t, Strings } from 'exports/i18n';

export enum AstNodeType {
  BinaryOperatorNode = 'BinaryOperatorNode',
  UnaryOperatorNode = 'UnaryOperatorNode',
  ValueOperandNode = 'ValueOperandNode',
  PureValueOperandNode = 'PureValueOperandNode',
  CallOperandNode = 'CallOperandNode',
  StringOperandNode = 'StringOperandNode',
  NumberOperandNode = 'NumberOperandNode',
}

export abstract class AstNode {
  readonly token: Token;
  readonly name!: AstNodeType;
  valueType!: BasicValueType;
  innerValueType?: BasicValueType;

  constructor(token: Token) {
    this.token = token;
  }

  get numNodes(): number {
    return 1;
  }

  toString() {
    return `AstNode: ${this.token}::${this.name}`;
  }
}

export class BinaryOperatorNode extends AstNode {
  readonly left: AstNode;
  readonly right: AstNode;
  override readonly name = AstNodeType.BinaryOperatorNode;

  constructor(left: AstNode, token: Token, right: AstNode) {
    super(token);

    this.left = left;
    this.right = right;

    // TokenType.And, TokenType.Or, TokenType.Add,
    // TokenType.Times, TokenType.Div, TokenType.Minus,
    // TokenType.Mod, TokenType.Concat,
    switch (token.type) {
    // Addition, subtraction, multiplication and division operator symbols are calculated correctly only when both sides are numbers.
      case TokenType.Add: {
        const isNumberType = ({ valueType, innerValueType, token }: AstNode) => {
          return valueType === BasicValueType.Number || innerValueType === BasicValueType.Number || token.value.toUpperCase() === 'BLANK';
        };
        if ([left, right].every(isNumberType)) {
          this.valueType = BasicValueType.Number;
          return;
        }

        this.valueType = BasicValueType.String;
        return;
      }

      case TokenType.Minus:
      case TokenType.Times:
      case TokenType.Mod:
      case TokenType.Div: {
        this.valueType = BasicValueType.Number;
        return;
      }

      case TokenType.Or:
      case TokenType.And:
      case TokenType.Equal:
      case TokenType.NotEqual:
      case TokenType.Greater:
      case TokenType.GreaterEqual:
      case TokenType.Less:
      case TokenType.LessEqual: {
        this.valueType = BasicValueType.Boolean;
        return;
      }

      case TokenType.Concat: {
        this.valueType = BasicValueType.String;
        return;
      }

      default: {
        throw new TypeError(t(Strings.function_err_unknown_operator, {
          type: token.type,
        }));
      }
    }
  }

  override get numNodes(): number {
    return 1 + this.left.numNodes + this.right.numNodes;
  }
}

export class UnaryOperatorNode extends AstNode {
  readonly child: AstNode;
  override readonly name = AstNodeType.UnaryOperatorNode;
  override readonly valueType: BasicValueType;

  constructor(child: AstNode, token: Token) {
    super(token);
    this.child = child;
    switch (token.type) {
      case TokenType.Minus:
        this.valueType = BasicValueType.Number;
        break;
      case TokenType.Not:
        this.valueType = BasicValueType.Boolean;
        break;
      case TokenType.Add:
        this.valueType = child.valueType;
        break;
      default:
        throw new Error(`unreachable ${token.value}`);
    }
  }

  override get numNodes(): number {
    return 1 + this.child.numNodes;
  }
}

export abstract class ValueOperandNodeBase extends AstNode {
  readonly value: string;
  override valueType!: BasicValueType;
  override readonly name!: AstNodeType;
  field!: IField;
  context!: { state: IReduxState, fieldMap: IFieldMap };

  constructor(token: Token) {
    super(token);
    this.value = token.value.replace(/\\(.)/g, '$1');
  }

  protected init(fieldId: string, context: { state: IReduxState, fieldMap: IFieldMap }, hostField?: IField) {
    this.context = context;
    fieldId = fieldId.replace(/\\(.)/g, '$1');
    if (fieldId === ROLLUP_KEY_WORDS && hostField) {
      this.field = hostField;
      this.valueType = BasicValueType.Array;
    } else {
      const field = context.fieldMap[fieldId];
      if (!field) {
        throw new Error(t(Strings.function_err_invalid_field_name, {
          fieldId,
        }));
      }
      this.field = field;
      this.valueType = Field.bindContext(field, context.state).basicValueType;
    }

    const innerValueType: BasicValueType | undefined = (Field.bindContext(this.field, context.state) as any).innerBasicValueType;
    this.innerValueType = innerValueType || BasicValueType.String;
  }
}

export class ValueOperandNode extends ValueOperandNodeBase {
  override readonly name = AstNodeType.ValueOperandNode;
  override readonly field!: IField;

  constructor(token: Token, context: { state: IReduxState, fieldMap: IFieldMap }, hostField?: IField) {
    super(token);
    const fieldId = token.value.slice(1, -1);
    this.init(fieldId, context, hostField);
  }
}

export class PureValueOperandNode extends ValueOperandNodeBase {
  override readonly name = AstNodeType.PureValueOperandNode;
  override readonly field!: IField;

  constructor(token: Token, context: { state: IReduxState, fieldMap: IFieldMap }, hostField?: IField) {
    super(token);
    const fieldId = token.value;
    this.init(fieldId, context, hostField);
  }
}

export class CallOperandNode extends AstNode {
  readonly value: string;
  override readonly name = AstNodeType.CallOperandNode;
  readonly params: AstNode[] = [];

  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }

  override get numNodes(): number {
    return this.params.reduce((num, node) => num + node.numNodes, 1);
  }
}

export class NumberOperandNode extends AstNode {
  readonly value: string;
  override readonly name = AstNodeType.NumberOperandNode;
  override valueType = BasicValueType.Number;

  constructor(token: Token) {
    super(token);
    this.value = token.value;
  }
}

export class StringOperandNode extends AstNode {
  readonly value: string;
  override readonly name = AstNodeType.StringOperandNode;
  override valueType = BasicValueType.String;

  constructor(token: Token) {
    super(token);

    let tokenValue = token.value;
    const terminatorMap = new Map([
      [/\\n/g, '\n'], // newline
      [/\\r/g, '\r'], // newline
      [/\\t/g, '\t'], // tab
    ]);

    terminatorMap.forEach((v, k) => {
      tokenValue = tokenValue.replace(k, v);
    });
    tokenValue = tokenValue.replace(/\\(.)/g, '$1');
    this.value = tokenValue;
  }
}
