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

import React from 'react';
import { SearchOutlined } from '@apitable/icons';
import { ILineSearchInputProps } from './interface';
import { PrefixIcon, StyledSearchInputContainer, SuffixIcon } from './styled';
import { useKeyPress } from 'ahooks';
import { useProviderTheme } from 'hooks';

export const LineSearchInputBase: React.ForwardRefRenderFunction<{}, ILineSearchInputProps> = (props, ref) => {
  const { onChange, value, onPressEnter, className, onFocus, size = 'default', placeholder, style, clearClick, showClearIcon } = props;
  const inputRef = React.useRef<HTMLInputElement>(null);
  const theme = useProviderTheme();

  React.useImperativeHandle(ref, () => {
    return {
      focus() {
        inputRef.current!.focus();
      },
    };
  });

  useKeyPress('Enter', (e) => {
    onPressEnter && onPressEnter(e);
  }, { target: inputRef });

  const onCancelClick = () => {
    if (!showClearIcon) {
      return;
    }
    if (clearClick && typeof clearClick === 'function') {
      return clearClick();
    }
    inputRef.current!.value = '';
  };

  return <StyledSearchInputContainer
    className={className}
    style={style}
    size={size}
  >
    <PrefixIcon>
      <SearchOutlined color={theme.color.black[300]} />
    </PrefixIcon>
    <input
      type="text"
      ref={inputRef}
      onFocus={onFocus}
      onChange={onChange}
      value={value}
      placeholder={placeholder || 'please input'}
      size={1}
    />
    <SuffixIcon onClick={onCancelClick}>
      {/* {Boolean(value && showClearIcon) && <CloseIcon />} */}
    </SuffixIcon>
  </StyledSearchInputContainer>;
};

export const LineSearchInput = React.forwardRef(LineSearchInputBase);
