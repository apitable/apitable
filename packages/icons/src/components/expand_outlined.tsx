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

export const ExpandOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.75 3C1.33579 3 1 3.33579 1 3.75C1 4.16421 1.33579 4.5 1.75 4.5H10.25C10.6642 4.5 11 4.16421 11 3.75C11 3.33579 10.6642 3 10.25 3H1.75ZM1.75 7C1.33579 7 1 7.33579 1 7.75C1 8.16421 1.33579 8.5 1.75 8.5H12.5033L11.591 9.4123C11.2981 9.70519 11.2981 10.1801 11.591 10.473C11.8839 10.7659 12.3588 10.7659 12.6517 10.473L14.773 8.35164C15.0659 8.05874 15.0659 7.58387 14.773 7.29098L12.6517 5.16966C12.3588 4.87676 11.8839 4.87676 11.591 5.16966C11.2981 5.46255 11.2981 5.93742 11.591 6.23032L12.3607 7H1.75ZM1 11.75C1 11.3358 1.33579 11 1.75 11H10.25C10.6642 11 11 11.3358 11 11.75C11 12.1642 10.6642 12.5 10.25 12.5H1.75C1.33579 12.5 1 12.1642 1 11.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'expand_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.75 3C1.33579 3 1 3.33579 1 3.75C1 4.16421 1.33579 4.5 1.75 4.5H10.25C10.6642 4.5 11 4.16421 11 3.75C11 3.33579 10.6642 3 10.25 3H1.75ZM1.75 7C1.33579 7 1 7.33579 1 7.75C1 8.16421 1.33579 8.5 1.75 8.5H12.5033L11.591 9.4123C11.2981 9.70519 11.2981 10.1801 11.591 10.473C11.8839 10.7659 12.3588 10.7659 12.6517 10.473L14.773 8.35164C15.0659 8.05874 15.0659 7.58387 14.773 7.29098L12.6517 5.16966C12.3588 4.87676 11.8839 4.87676 11.591 5.16966C11.2981 5.46255 11.2981 5.93742 11.591 6.23032L12.3607 7H1.75ZM1 11.75C1 11.3358 1.33579 11 1.75 11H10.25C10.6642 11 11 11.3358 11 11.75C11 12.1642 10.6642 12.5 10.25 12.5H1.75C1.33579 12.5 1 12.1642 1 11.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
