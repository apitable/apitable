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

export const Collapse2OpenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 12.75C1 13.4404 1.55964 14 2.25 14H5.75C6.44036 14 7 13.4404 7 12.75V3.25C7 2.55964 6.44036 2 5.75 2H2.25C1.55964 2 1 2.55964 1 3.25V12.75ZM2.5 12.5V3.5H5.5V12.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M9.20474 12.765C8.92033 12.4638 8.93389 11.9891 9.23503 11.7047L12.3636 8.75H8.75C8.33579 8.75 8 8.41421 8 8C8 7.58579 8.33579 7.25 8.75 7.25H12.3636L9.23503 4.29526C8.93389 4.01085 8.92033 3.53617 9.20474 3.23503C9.48915 2.93389 9.96383 2.92033 10.265 3.20474L14.7637 7.45358C14.9092 7.59038 15 7.78458 15 8C15 8.21542 14.9092 8.40962 14.7637 8.54642L10.265 12.7953C9.96383 13.0797 9.48915 13.0661 9.20474 12.765Z" fill={ colors[0] }/>

  </>,
  name: 'collapse_2_open_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1 12.75C1 13.4404 1.55964 14 2.25 14H5.75C6.44036 14 7 13.4404 7 12.75V3.25C7 2.55964 6.44036 2 5.75 2H2.25C1.55964 2 1 2.55964 1 3.25V12.75ZM2.5 12.5V3.5H5.5V12.5H2.5Z', 'M9.20474 12.765C8.92033 12.4638 8.93389 11.9891 9.23503 11.7047L12.3636 8.75H8.75C8.33579 8.75 8 8.41421 8 8C8 7.58579 8.33579 7.25 8.75 7.25H12.3636L9.23503 4.29526C8.93389 4.01085 8.92033 3.53617 9.20474 3.23503C9.48915 2.93389 9.96383 2.92033 10.265 3.20474L14.7637 7.45358C14.9092 7.59038 15 7.78458 15 8C15 8.21542 14.9092 8.40962 14.7637 8.54642L10.265 12.7953C9.96383 13.0797 9.48915 13.0661 9.20474 12.765Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
