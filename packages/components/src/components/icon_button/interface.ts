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

import React, { ElementType } from 'react';
import { IIconProps } from '@apitable/icons';

export interface IIconButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom inline styles
   */
  style?: React.CSSProperties;
  /**
   * Button shape
   */
  shape?: 'square';
  /**
   * Use the specified HTML element to render the component
   */
  component?: ElementType;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Variant type
   */
  variant?: 'default' | 'background' | 'blur';
  /** 
   * Icon component
   */
  icon: React.FC<React.PropsWithChildren<IIconProps>>;
  /**
   * Icon size
   */
  size?: 'small' | 'large';
  /**
   * Click callback
   */
  onClick?: (e: any) => void;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether active or not
   */
  active?: boolean;
}

export type IIconButtonWrapperProps = Pick<IIconButtonProps, 'disabled' | 'variant' | 'size' | 'active' | 'shape'>;

