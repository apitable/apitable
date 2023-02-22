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

import { FieldType, IField, ISelectField, IMultiSelectField } from 'types/field_types';
import type { IFilterCondition } from 'types/view_types';

type ISelectFieldType = ISelectField | IMultiSelectField;

// Check that the column type switch causes the filter to fail
export const checkTypeSwitch = (item?: IFilterCondition<FieldType>, field?: IField) => {
  const isSameType = item?.fieldType === field?.type;
  if (!isSameType) {
    return true;
  }
  
  // After checking for two type switches (the type didn't change), but the option id changed
  if (item?.fieldType && [FieldType.SingleSelect, FieldType.MultiSelect].includes(item?.fieldType)) {
    const value = item?.value;
    const { options } = (field as ISelectFieldType).property;
    const ids = options.map(o => o.id);
    // value does not exist, indicating that it has not been selected
    // Determine whether value has a corresponding value in options id
    return Boolean(value) && (
      Array.isArray(value) ? !value.every(v => ids.includes(v)) : !ids.includes(value)
    );
  }
  return false;
};