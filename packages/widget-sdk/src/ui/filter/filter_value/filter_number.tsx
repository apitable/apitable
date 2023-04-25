import { divide, FieldType, Strings, t, times } from '@apitable/core';
import React, { useMemo } from 'react';
import { IFilterTextProps } from './interface';
import { EditorNumber } from './editor/editor_number';
import { FilterInputWrap } from './styled';

export const FilterNumber: React.FC<IFilterTextProps> = props => {
  const { value: _value, onChange: _onChange, field } = props;

  const value = useMemo(() => {
    const value = _value?.[0];
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return undefined;
    }
    if (field.type === FieldType.Percent) {
      return value == null ? value : String(times(Number(value), 100));
    }
    return value;
  }, [_value, field.type]);

  const toolTip = useMemo(() => {
    switch (field.type) {
      case FieldType.Number:
        return t(Strings.number_cell_input_tips);
      case FieldType.Currency:
        return t(Strings.currency_cell_input_tips);
      case FieldType.Percent:
        return t(Strings.percent_cell_input_tips);
      default:
        return t(Strings.number_cell_input_tips);
    }
  }, [field.type]);

  const onChange = (_value: string | null ) => {
    let value = _value;
    if (field.type === FieldType.Percent) {
      value = value == null ? '' : value;
      value = value === '' ? '' : String(divide(Number(value), 100));
    }
    _onChange(value ? [value] : null);
  };

  return (
    <FilterInputWrap>
      <EditorNumber
        tooltip={toolTip}
        value={value}
        placeholder=' '
        onChange={onChange}
        validate
      />
    </FilterInputWrap>
  );
};