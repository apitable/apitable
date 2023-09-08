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

import { useCallback, useMemo } from 'react';
import { FilterConjunction, FOperator, IField, IFilterInfo } from '@apitable/core';
import { FilterValue } from 'pc/components/tool_bar/view_filter/filter_value';

interface IFieldInputProps {
  field: IField;
  fop: FOperator;
  value: any;
  disabled?: boolean;
  onChange: (value: any) => void;
}
export const FieldInput = ({ field, disabled, fop, onChange, value }: IFieldInputProps) => {
  // Here the incoming value is converted to a single filterInfo, which has only one expression.
  // Our goal is to get the value of the input from filterValue.
  const filterInfo = useMemo(() => {
    return {
      conjunction: FilterConjunction.And,
      conditions: [
        {
          conditionId: 'random',
          fieldId: field.id,
          operator: fop,
          fieldType: field.type,
          value: value,
        },
      ],
    } as IFilterInfo;
  }, [value, field, fop]);

  // IExpression => IFilterCondition
  const condition = filterInfo.conditions[0];

  const handleChangeFilter = useCallback(
    (cb: any) => {
      const newFilterInfo = cb(filterInfo);
      onChange(newFilterInfo.conditions[0].value);
    },
    [filterInfo, onChange],
  );

  return (
    <FilterValue
      disabled={disabled}
      style={{ width: '100%' }}
      field={field}
      conditionIndex={0}
      condition={condition}
      changeFilter={handleChangeFilter}
      hiddenClientOption
    />
  );
};
