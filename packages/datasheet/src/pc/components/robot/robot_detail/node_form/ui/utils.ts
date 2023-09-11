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

import { IUiSchema } from '../core/interface';

// export const getObjectDepth = (props: ObjectFieldTemplateProps): number => {
//   const { idSchema } = props;
//   const ids = idSchema.$id.split('_');
//   return ids.length - 1;
// };

export const getOptions = (
  key: string,
  uiSchema: IUiSchema,
): {
  has: boolean;
  value?: any;
} => {
  if ('ui:options' in uiSchema && key in uiSchema['ui:options']!) {
    return {
      has: true,
      value: uiSchema['ui:options']![key],
    };
  }
  return {
    has: false,
  };
};

export const literal2Operand = (literal: any): object => {
  return {
    type: 'Literal',
    value: literal,
  };
};

export const operand2Literal = (operand: any): any => {
  if (operand == null) {
    return null;
  }
  if (operand.type === 'Literal') {
    return operand.value;
  }
  return operand;
};
