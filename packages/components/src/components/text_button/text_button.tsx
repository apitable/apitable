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

import { getCurrentColorIcon } from 'helper';
import React from 'react';
import { ITextButtonProps } from './interface';
import { IconSpanStyled, TextButtonBase } from './styled';

const _TextButton = ({
  children,
  size = 'middle',
  color = 'default',
  prefixIcon,
  suffixIcon,
  disabled,
  block,
  ...restProps

}: ITextButtonProps, ref: React.Ref<HTMLButtonElement>) => {
  const baseProps = {
    btnColor: color,
    size,
    disabled,
    block,
    ...restProps,
  };
  const PrefixIcon = getCurrentColorIcon(prefixIcon);
  const SuffixIcon = getCurrentColorIcon(suffixIcon);
  return (
    <>
      <TextButtonBase {...baseProps} ref={ref}>
        {Boolean(prefixIcon) && <IconSpanStyled existIcon={Boolean(prefixIcon)} position='prefix'>
          {PrefixIcon}
        </IconSpanStyled>}
        {children}
        {Boolean(suffixIcon) && <IconSpanStyled existIcon={Boolean(suffixIcon)} position='suffix'>
          {SuffixIcon}
        </IconSpanStyled>}
      </TextButtonBase>
    </>
  );
};

export const TextButton = React.forwardRef(_TextButton);