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

import { nanoid } from 'nanoid';

export function generateRowId() {
  return nanoid();
}

export function generateKeyedFormData(formData: any) {
  const { operands } = formData.value;
  const newOperands = operands.map((v: { key: any }) => ({ ...v, key: v.key || generateRowId() }));
  return {
    ...formData,
    value: {
      ...formData.value,
      operands: newOperands,
    },
  };
  // return Array.isArray(formData) ? formData.map(item => {
  //   return {
  //     key: generateRowId(),
  //     item,
  //   };
  // }) : [];
}

export function keyedToPlainFormData(keyedFormData: any) {
  const { operands } = keyedFormData.value;
  const newOperands = operands.map((v: any) => {
    // eslint-disable-next-line
    const { key, ...rest } = v;
    return { ...rest };
  });
  return {
    ...keyedFormData,
    value: {
      ...keyedFormData.value,
      operands: newOperands,
    },
  };
  // return keyedFormData.map((keyedItem: any) => keyedItem.item);
}

export const EmptyArrayOperand = {
  type: 'Expression',
  value: {
    operator: 'newArray',
    operands: [],
  },
};
