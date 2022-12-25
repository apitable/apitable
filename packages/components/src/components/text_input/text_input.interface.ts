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
export interface ITextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  className?: string;
  /**
   * Size, default is middle
   */
  size?: 'large' | 'middle' | 'small';
  /**
   * Whether check error ot not
   */
  error?: boolean;
  /**
   * Whether disabled or not
   */
  disabled?: boolean;
  /**
   * Whether use Underline style input
   */
  lineStyle?: boolean;
  /**
   * Prefix icon
   */
  prefix?: React.ReactNode;
  /**
   * Suffix icon
   */
  suffix?: React.ReactNode;
  /**
   * Whether full width or not
   */
  block?: boolean;
  /**
   * Addon component ui after text input
   */
  addonAfter?: React.ReactNode;
  /**
   * Addon component ui before text input
   */
  addonBefore?: React.ReactNode;
  /**
   * The ref ot text input
   */
  wrapperRef?: React.RefObject<HTMLDivElement>;
}