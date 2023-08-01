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
import { TextInput } from 'components/text_input';
import React from 'react';
import styled, { css } from 'styled-components';
import { applyDefaultTheme } from 'theme';
import { useControllableValue } from 'ahooks';

const HelperText = styled.div.attrs(applyDefaultTheme) <{ error: boolean }>`
  height: 22px;
  font-size: 10px;
  padding: 4px 0 0 8px;
  ${props => props.error && css`
    color: ${props.theme.color.errorColor};
  `}
`;

export const TextWidget = (props: WidgetProps) => {
  // TODO: useControllableValue hook should support debounce
  const [state, setState] = useControllableValue<string>(props, {
    defaultValue: '',
  });
  const { rawErrors, placeholder } = props;
  const helperTextVisible = Boolean(rawErrors?.length);
  const helperText = rawErrors?.join(',');
  return (
    <>
      <TextInput
        placeholder={placeholder}
        value={state}
        onChange={e => setState(e.target.value)}
        block
      />
      {helperTextVisible &&
        <HelperText error>{helperText}</HelperText>
      }
    </>
  );
};
