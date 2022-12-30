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

export const RetractFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.46666 11.2C3.46666 11.6418 3.82483 12 4.26666 12C4.70849 12 5.06666 11.6418 5.06666 11.2V4.8C5.06666 4.35817 4.70849 4 4.26666 4C3.82483 4 3.46666 4.35817 3.46666 4.8V11.2ZM12.3658 7.72864C12.5664 7.85397 12.5664 8.14603 12.3658 8.27136L6.88959 11.694C6.67646 11.8272 6.39999 11.674 6.39999 11.4226V4.57736C6.39999 4.32602 6.67646 4.17279 6.88959 4.306L12.3658 7.72864Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'retract_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M3.46666 11.2C3.46666 11.6418 3.82483 12 4.26666 12C4.70849 12 5.06666 11.6418 5.06666 11.2V4.8C5.06666 4.35817 4.70849 4 4.26666 4C3.82483 4 3.46666 4.35817 3.46666 4.8V11.2ZM12.3658 7.72864C12.5664 7.85397 12.5664 8.14603 12.3658 8.27136L6.88959 11.694C6.67646 11.8272 6.39999 11.674 6.39999 11.4226V4.57736C6.39999 4.32602 6.67646 4.17279 6.88959 4.306L12.3658 7.72864Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
