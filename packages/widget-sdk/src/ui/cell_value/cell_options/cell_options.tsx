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
import { ISelectFieldBaseOpenValue } from '@apitable/core';
import { black } from '@apitable/components';
import { compact, find } from 'lodash';
import { OptionItemStyled, OptionsWrapperStyled } from './styled';
import { ICellOptions, IOptionItem } from './interface';

const COLOR_INDEX_THRESHOLD = 30;

const OptionItem = (props: IOptionItem) => {
  const { text, ...rest } = props;
  return (
    <OptionItemStyled {...rest}>
      {text}
    </OptionItemStyled>
  );
};

export const CellOptions = (props: ICellOptions) => {
  const { options, selectOptions, className, style, cellClassName, cellStyle } = props;
  const renderOption = (option: ISelectFieldBaseOpenValue) => {
    const color = find(options, { id: option.id })?.color;
    const textColor = color && color >= COLOR_INDEX_THRESHOLD ? black[50] : black[1000];
    return (
      <OptionItem
        key={option.id}
        bg={option.color.value}
        text={option.name}
        textColor={textColor}
        className={cellClassName}
        style={cellStyle}
      />
    );
  };
  if (!selectOptions) {
    return null;
  }
  if (Array.isArray(selectOptions)) {
    return (
      <OptionsWrapperStyled className={className} style={style}>
        {compact(selectOptions).map(renderOption)}
      </OptionsWrapperStyled>
    );
  }
  return renderOption(selectOptions);
};

