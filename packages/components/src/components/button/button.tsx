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

import { Loading } from 'components';
import React from 'react';
import { ButtonBase, IconSpanStyled, TextSpanStyled } from './styled';
import { IButtonProps } from './interface';
import { getCurrentColorIcon } from 'helper';

export const Button = React.forwardRef(({
  children,
  size = 'middle',
  variant = 'fill',
  loading = false,
  suffixIcon,
  prefixIcon,
  color = 'default',
  disabled,
  block,
  htmlType = 'button',
  ...restProps
}: IButtonProps, ref: React.Ref<HTMLButtonElement>) => {

  const PrefixIcon = getCurrentColorIcon(prefixIcon);
  const SuffixIcon = getCurrentColorIcon(suffixIcon);
  return (
    <ButtonBase
      ref={ref}
      size={size}
      btnColor={color}
      variant={variant}
      disabled={loading ? true : disabled}
      block={block}
      type={htmlType}
      {...restProps}
    >
      {loading && (
        <span className="loading">
          <Loading currentColor strokeWidth={1} />
        </span>
      )}
      {prefixIcon && (
        <IconSpanStyled existIcon={Boolean(prefixIcon)} position='prefix' size={size}>
          {PrefixIcon}
        </IconSpanStyled>
      )}
      <TextSpanStyled>
        {children}
      </TextSpanStyled>
      {suffixIcon && (
        <IconSpanStyled existIcon={Boolean(suffixIcon)} position='suffix' size={size}>
          {SuffixIcon}
        </IconSpanStyled>
      )}
    </ButtonBase>
  );
});
