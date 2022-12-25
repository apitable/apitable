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

import { IFontVariants } from 'helper';
import React from 'react';

export interface IDividerProps {
  /**
   * The direction of the split line, horizontal or vertical, the default is horizontal
   */
  orientation?: 'vertical' | 'horizontal';

  /**
   * Horizontal split line text position
   */
  textAlign?: 'left' | 'right';

  /**
   * Follow Typography component layout
   */
  typography?: IFontVariants;

  /**
   * whether show the split line
   */
  dashed?: boolean;

  /**
   * custom inline styles
   */
  style?: React.CSSProperties;

  /**
   * custom class name
   */
  className?: string;

  /**
   * The rendered node html type, which defaults to div tag
   * 
   */
   component?: 'li' | 'hr' | 'div'
}

export interface IDividerStyledType extends IDividerProps {
  hasChildren?: boolean;
}