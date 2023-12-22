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

import { handleNullArray } from 'model/utils';
import { FieldType } from 'types';
import { IFormulaParam } from './functions/basic';
import { AstNodeType, ValueOperandNode } from './parser';
import { produce } from 'immer';

/**
 * lookup cv now leaves null by default.
 * When the formula refers to the lookup field as a parameter, some functions need to convert the null value to make it as expected.
 */
export const handleLookupNullValue = (params: IFormulaParam<any>[]) => {
  return produce(params, draftParams => {
    draftParams.forEach(param => {
      if (param.node.name === AstNodeType.ValueOperandNode
        && (param.node as ValueOperandNode).field.type === FieldType.LookUp
        && handleNullArray(param.value) == null
      ) {
        param.value = null;
      }
    });
  });
};