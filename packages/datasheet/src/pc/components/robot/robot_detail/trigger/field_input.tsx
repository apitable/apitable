import { FilterConjunction, FOperator, IField, IFilterInfo } from '@apitable/core';
import { FilterValue } from 'pc/components/tool_bar/view_filter/filter_value';
import { useCallback, useMemo } from 'react';

interface IFieldInputProps {
  field: IField;
  fop: FOperator;
  value: any;
  onChange: (value: any) => void;
}
export const FieldInput = ({ field, fop, onChange, value }: IFieldInputProps) => {

  // Here the incoming value is converted to a single filterInfo, which has only one expression. 
  // Our goal is to get the value of the input from filterValue.
  const filterInfo: IFilterInfo = useMemo(() => {
    return {
      conjunction: FilterConjunction.And,
      conditions: [{
        conditionId: 'random',
        fieldId: field.id,
        operator: fop,
        fieldType: field.type,
        value: value,
      }]
    };
  }, [value, field, fop]);

  // IExpression => IFilterCondition
  const condition = filterInfo.conditions[0];

  const handleChangeFilter = useCallback((cb) => {
    const newFilterInfo = cb(filterInfo);
    onChange(newFilterInfo.conditions[0].value);
  }, [filterInfo, onChange]);

  return (
    <FilterValue
      style={{ width: '100%' }}
      field={field}
      conditionIndex={0}
      condition={condition}
      changeFilter={handleChangeFilter}
      hiddenClientOption
    />
  );
};