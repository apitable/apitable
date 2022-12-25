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

export enum TokenType {
  Call = 'Call',
  PureValue = 'PureValue',
  Value = 'Value',
  And = 'And',
  Comma = 'Comma',
  Number = 'Number',
  String = 'String',
  Less = 'Less',
  LessEqual = 'LessEqual',
  Greater = 'Greater',
  GreaterEqual = 'GreaterEqual',
  Equal = 'Equal',
  NotEqual = 'NotEqual',
  Add = 'Add',
  Minus = 'Minus',
  Times = 'Times',
  Mod = 'Mod',
  Div = 'Div',
  Concat = 'Concat',
  Or = 'Or',
  Not = 'Not',
  LeftParen = 'LeftParen',
  RightParen = 'RightParen',
  Blank = 'Blank',
  Unknown = 'Unknown',
}

export class Token {
  constructor(readonly type: TokenType, readonly index: number, readonly value: string) {
    // String and Value need to remove quotes and braces
    this.value = value;
  }

  toString() {
    return `${this.type}::${this.value}`;
  }
}
