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

import * as React from 'react';
import { IconButtonStyle } from './styled';
import { IIconButtonProps } from './interface';

export const IconButton: React.FC<React.PropsWithChildren<IIconButtonProps>> = ({
  icon: IconComponent, 
  size = 'small',
  variant = 'default',
  disabled = false,
  active = false,
  component = 'div',
  ...restProps
}) => {
  if (!IconComponent) return null;
  const sizeMap = {
    small: 16,
    large: 24
  };
  const extraProps = component === 'button' ? { type: 'button' } : {};
  return (
    <IconButtonStyle as={component as any} size={size} variant={variant} disabled={disabled} active={active} {...restProps} {...extraProps}>
      <IconComponent size={sizeMap[size]} currentColor />
    </IconButtonStyle >
  );
};
