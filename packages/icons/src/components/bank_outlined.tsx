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

export const BankOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.41961 8.90194C9.46635 8.66823 9.67156 8.5 9.9099 8.5H12.1401C12.4556 8.5 12.6923 8.78866 12.6304 9.09806L12.3304 10.5981C12.2836 10.8318 12.0784 11 11.8401 11H9.6099C9.29438 11 9.05773 10.7113 9.11961 10.4019L9.41961 8.90194Z" fill={ colors[0] }/>
    <path d="M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V12.25C15 12.9404 14.4404 13.5 13.75 13.5H2.25C1.55964 13.5 1 12.9404 1 12.25V3.75ZM2.5 6.75V12H13.5V6.75H2.5ZM2.5 5.25H13.5V4H2.5V5.25Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'bank_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.41961 8.90194C9.46635 8.66823 9.67156 8.5 9.9099 8.5H12.1401C12.4556 8.5 12.6923 8.78866 12.6304 9.09806L12.3304 10.5981C12.2836 10.8318 12.0784 11 11.8401 11H9.6099C9.29438 11 9.05773 10.7113 9.11961 10.4019L9.41961 8.90194Z', 'M1 3.75C1 3.05964 1.55964 2.5 2.25 2.5H13.75C14.4404 2.5 15 3.05964 15 3.75V12.25C15 12.9404 14.4404 13.5 13.75 13.5H2.25C1.55964 13.5 1 12.9404 1 12.25V3.75ZM2.5 6.75V12H13.5V6.75H2.5ZM2.5 5.25H13.5V4H2.5V5.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
