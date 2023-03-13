import { TextInput } from '@apitable/components';
import React from 'react';
import { IFilterTextProps } from './interface';
import { FilterInputWrap } from './styled';

export const FilterText: React.FC<IFilterTextProps> = props => {
  const { value, onChange } = props;

  const _value = value?.[0];

  return (
    <FilterInputWrap>
      <TextInput
        className={'widgetFilterTextInput'}
        block
        value={_value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          onChange(value ? [value] : null);
        }}
        placeholder=''
      />
    </FilterInputWrap>
  );
};