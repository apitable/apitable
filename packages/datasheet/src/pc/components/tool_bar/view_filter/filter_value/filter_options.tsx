import { FieldType, FOperator } from '@apitable/core';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { IFilterOptionProps } from '../interface';
import { FilterGeneralSelect } from './filter_general_select';

export const FilterOptions: React.FC<IFilterOptionProps> = props => {
  const { condition, field, onChange } = props;
  const [isMulti, setIsMulti] = useState(false);
  // The field passed in here is the entity field. fieldType inside the condition is the real field.
  const fieldType = condition.fieldType === FieldType.LookUp ? FieldType.MultiSelect : condition.fieldType;
  const fieldValue = field.property.options;
  const filterValue = condition.value ? fieldValue.filter(item => condition.value.includes(item.id)) : [];

  useEffect(() => {
    if (fieldType === FieldType.MultiSelect) {
      setIsMulti(true);
    } else if (
      fieldType === FieldType.SingleSelect &&
      (
        condition.operator === FOperator.Contains ||
        condition.operator === FOperator.DoesNotContain
      )
    ) {
      setIsMulti(true);
    } else {
      setIsMulti(false);
    }
  }, [condition.operator, fieldType]);

  function _onCHange(value: string | string[] | null) {
    if (value && !Array.isArray(value)) {
      value = [value];
    }
    onChange(value);
  }

  return (
    <FilterGeneralSelect
      field={field}
      isMulti={isMulti}
      onChange={_onCHange}
      cellValue={filterValue.map(item => item.id)}
      listData={field.property.options}
    />
  );
};
