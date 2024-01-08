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

export const BankFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V5H1V3.75Z" fill={ colors[0] }/>
    <path d="M1 6.5H15V12.25C15 12.9404 14.4404 13.5 13.75 13.5H2.25C1.55964 13.5 1 12.9404 1 12.25V6.5ZM9.9099 9C9.67156 9 9.46635 9.16823 9.41961 9.40194L9.11961 10.9019C9.05773 11.2113 9.29438 11.5 9.6099 11.5H11.8401C12.0784 11.5 12.2836 11.3318 12.3304 11.0981L12.6304 9.59806C12.6923 9.28866 12.4556 9 12.1401 9H9.9099Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'bank_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V5H1V3.75Z', 'M1 6.5H15V12.25C15 12.9404 14.4404 13.5 13.75 13.5H2.25C1.55964 13.5 1 12.9404 1 12.25V6.5ZM9.9099 9C9.67156 9 9.46635 9.16823 9.41961 9.40194L9.11961 10.9019C9.05773 11.2113 9.29438 11.5 9.6099 11.5H11.8401C12.0784 11.5 12.2836 11.3318 12.3304 11.0981L12.6304 9.59806C12.6923 9.28866 12.4556 9 12.1401 9H9.9099Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
