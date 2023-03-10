import { FieldType, Strings, t } from '@apitable/core';
import React, { useMemo } from 'react';
import { IFilterTextProps } from './interface';
import { EditorNumber } from './editor/editor_number';
import { FilterInputWrap } from './styled';

export const FilterNumber: React.FC<IFilterTextProps> = props => {
  const { value, onChange, field } = props;

  const _value = value?.[0];

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

  return (
    <FilterInputWrap>
      <EditorNumber
        tooltip={toolTip}
        value={_value}
        placeholder=' '
        onChange={(value) => onChange(value ? [value] : null)}
        validate
      />
    </FilterInputWrap>
  );
};