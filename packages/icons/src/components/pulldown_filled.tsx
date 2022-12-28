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

/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const PulldownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.8 3.46666C4.35817 3.46666 4 3.82483 4 4.26666C4 4.70849 4.35817 5.06666 4.8 5.06666H11.2C11.6418 5.06666 12 4.70849 12 4.26666C12 3.82483 11.6418 3.46666 11.2 3.46666H4.8ZM8.27136 12.3658C8.14603 12.5664 7.85397 12.5664 7.72864 12.3658L4.306 6.88959C4.17279 6.67646 4.32602 6.39999 4.57736 6.39999H11.4226C11.674 6.39999 11.8272 6.67646 11.694 6.88959L8.27136 12.3658Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'pulldown_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.8 3.46666C4.35817 3.46666 4 3.82483 4 4.26666C4 4.70849 4.35817 5.06666 4.8 5.06666H11.2C11.6418 5.06666 12 4.70849 12 4.26666C12 3.82483 11.6418 3.46666 11.2 3.46666H4.8ZM8.27136 12.3658C8.14603 12.5664 7.85397 12.5664 7.72864 12.3658L4.306 6.88959C4.17279 6.67646 4.32602 6.39999 4.57736 6.39999H11.4226C11.674 6.39999 11.8272 6.67646 11.694 6.88959L8.27136 12.3658Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
