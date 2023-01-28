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
import { StyledSearchInputWrapper } from './styled';
import { LineSearchInput } from './line_search_input';

export const ListSearch = (props: any) => {
  const { style, keyword, placeholder, inputRef, onSearchChange, setKeyword, onInputEnter } = props;
  const changInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target!.value);
    onSearchChange && onSearchChange(e, e.target!.value);
  };

  const onPressEnter = () => {
    onInputEnter && onInputEnter(() => {
      setKeyword('');
    });
  };

  return <StyledSearchInputWrapper
    style={style}
  >
    <LineSearchInput
      onPressEnter={onPressEnter}
      onChange={changInput}
      value={keyword}
      placeholder={placeholder || 'please input'}
      ref={inputRef}
    />
  </StyledSearchInputWrapper>;
};
