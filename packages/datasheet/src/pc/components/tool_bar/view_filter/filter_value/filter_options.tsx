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

import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { FieldType, FOperator } from '@apitable/core';
import { ViewFilterContext } from 'pc/components/tool_bar/view_filter/view_filter_context';
import { IFilterOptionProps } from '../interface';
import { FilterGeneralSelect } from './filter_general_select';

export const FilterOptions: React.FC<React.PropsWithChildren<IFilterOptionProps>> = (props) => {
  const { condition, disabled, field, onChange } = props;
  const [isMulti, setIsMulti] = useState(false);
  // The field passed in here is the entity field. fieldType inside the condition is the real field.
  const fieldType = condition.fieldType === FieldType.LookUp ? FieldType.MultiSelect : condition.fieldType;
  const fieldValue = field.property.options;
  const { isViewLock: isViewLockOrigin } = useContext(ViewFilterContext);
  const isViewLock = isViewLockOrigin || disabled;
  const filterValue = condition.value ? fieldValue.filter((item: { id: any }) => condition.value.includes(item.id)) : [];

  useEffect(() => {
    if (fieldType === FieldType.MultiSelect) {
      setIsMulti(true);
    } else if (
      fieldType === FieldType.SingleSelect &&
      (condition.operator === FOperator.Contains || condition.operator === FOperator.DoesNotContain)
    ) {
      setIsMulti(true);
    } else {
      setIsMulti(false);
    }
  }, [condition.operator, fieldType]);

  function _onChange(value: string | string[] | null) {
    if (value && !Array.isArray(value)) {
      value = [value];
    }
    onChange(value);
  }

  return (
    <FilterGeneralSelect
      field={field}
      isMulti={isMulti}
      disabled={isViewLock}
      onChange={_onChange}
      cellValue={filterValue.map((item: { id: any }) => item.id)}
      listData={field.property.options}
      isViewLock={isViewLock}
    />
  );
};
