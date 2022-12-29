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

export interface ILinkButtonProps extends React.LinkHTMLAttributes<any> {
  children?: any;
  /**
   * Whether full width
   */
  block?: boolean;
  /**
   * Whether disabled or not
   */
   disabled?: boolean;
  /**
   * Use the specified HTML element to render the component
   */
   component?: ElementType;
  /**
   * Prefix icon component
   */
  prefixIcon?: React.ReactNode;
  /**
   * Suffix icon component
   */
   suffixIcon?: React.ReactNode;
  /**
   * link href
   */
  href?: string;
  /**
   * Whether with underline or not
   */
  underline?: boolean;
  /**
   * Text color, default is primary color
   */
  color?: string;
  /**
   * Specify how to open the link
   */
  target?: string;
}