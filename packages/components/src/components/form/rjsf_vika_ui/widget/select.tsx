import { WidgetProps } from '@rjsf/core';
import React from 'react';
import styled from 'styled-components';
import { Select } from '../../../select';
import { applyDefaultTheme } from 'theme';

const ErrorText = styled.div.attrs(applyDefaultTheme)`
  font-size: 10px;
  padding: 4px 0 0 8px;
  color: ${(props) => props.theme.palette.danger};
`;

export const SelectWidget = ({
  options: { enumOptions }, value, onChange, rawErrors, placeholder
}: WidgetProps) => {
  const hasError = Boolean(rawErrors?.length);
  const style = hasError ? { border: '1px solid red', width: '100%' } : { width: '100%' };

  return (
    <>
      <Select
        placeholder={placeholder}
        options={(enumOptions || []) as any}
        value={value}
        onSelected={(option) => {
          onChange(option.value);
        }}
        dropdownMatchSelectWidth
        triggerStyle={style}
      />
      {
        rawErrors?.map(error => <ErrorText>{error}</ErrorText>)
      }
    </>
  );
};
