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

export const ChartBarStackFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M39 23V13C39 12.4477 38.5523 12 38 12L13 12C12.4477 12 12 12.4477 12 13V23C12 23.5523 12.4477 24 13 24H38C38.5523 24 39 23.5523 39 23Z" fill={ colors[2] }/>
    <path d="M20 12V24H13C12.4477 24 12 23.5523 12 23V13C12 12.4477 12.4477 12 13 12H20Z" fill={ colors[0] }/>
    <path d="M32 24V12H20V24H32Z" fill={ colors[1] }/>
    <path d="M68 45V35C68 34.4477 67.5523 34 67 34H13C12.4477 34 12 34.4477 12 35V45C12 45.5523 12.4477 46 13 46H67C67.5523 46 68 45.5523 68 45Z" fill={ colors[2] }/>
    <path d="M45 34V46H13C12.4477 46 12 45.5523 12 45V35C12 34.4477 12.4477 34 13 34H45Z" fill={ colors[0] }/>
    <path d="M56 46V34H45V46H56Z" fill={ colors[1] }/>
    <path d="M51 67V57C51 56.4477 50.5523 56 50 56H13C12.4477 56 12 56.4477 12 57V67C12 67.5523 12.4477 68 13 68H50C50.5523 68 51 67.5523 51 67Z" fill={ colors[2] }/>
    <path d="M32 56V68H13C12.4477 68 12 67.5523 12 67V57C12 56.4477 12.4477 56 13 56H32Z" fill={ colors[0] }/>
    <path d="M40 68V56H32V68H40Z" fill={ colors[1] }/>

  </>,
  name: 'chart_bar_stack_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M39 23V13C39 12.4477 38.5523 12 38 12L13 12C12.4477 12 12 12.4477 12 13V23C12 23.5523 12.4477 24 13 24H38C38.5523 24 39 23.5523 39 23Z', 'M20 12V24H13C12.4477 24 12 23.5523 12 23V13C12 12.4477 12.4477 12 13 12H20Z', 'M32 24V12H20V24H32Z', 'M68 45V35C68 34.4477 67.5523 34 67 34H13C12.4477 34 12 34.4477 12 35V45C12 45.5523 12.4477 46 13 46H67C67.5523 46 68 45.5523 68 45Z', 'M45 34V46H13C12.4477 46 12 45.5523 12 45V35C12 34.4477 12.4477 34 13 34H45Z', 'M56 46V34H45V46H56Z', 'M51 67V57C51 56.4477 50.5523 56 50 56H13C12.4477 56 12 56.4477 12 57V67C12 67.5523 12.4477 68 13 68H50C50.5523 68 51 67.5523 51 67Z', 'M32 56V68H13C12.4477 68 12 67.5523 12 67V57C12 56.4477 12.4477 56 13 56H32Z', 'M40 68V56H32V68H40Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
