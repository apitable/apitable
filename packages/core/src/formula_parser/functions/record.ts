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

import { FormulaFunc, IFormulaParam, IFormulaContext } from './basic';
import { BasicValueType, FormulaFuncType } from 'types';
import { AstNode } from 'formula_parser/parser';

class RecordFunc extends FormulaFunc {
  static override readonly type = FormulaFuncType.Record;
}

export class RecordId extends RecordFunc {
  static override validateParams(_params: AstNode[]) {
    //
  }

  static override getReturnType(params?: AstNode[]) {
    params && this.validateParams(params);
    return BasicValueType.String;
  }

  static override func(_params: [IFormulaParam<number>], context: IFormulaContext): string {
    return context ? context.record.id : '';
  }
}
