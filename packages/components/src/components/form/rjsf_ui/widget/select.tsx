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

import { WidgetProps } from '@rjsf/core';
import React from 'react';
import styled from 'styled-components';
import { DropdownSelect as Select } from '../../../select/dropdown';
import { applyDefaultTheme } from 'theme';

const ErrorText = styled.div.attrs(applyDefaultTheme)`
  font-size: 10px;
  padding: 4px 0 0 8px;
  color: ${(props) => props.theme.color.errorColor};
`;

export const SelectWidget = ({
  options: { enumOptions }, value, onChange, rawErrors, placeholder
}: WidgetProps) => {
  // const hasError = Boolean(rawErrors?.length);
  const style = { width: '100%' };
      // hasError ? { border: '1px solid red', width: '100%' } :

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
