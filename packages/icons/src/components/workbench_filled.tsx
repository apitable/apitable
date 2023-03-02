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

export const WorkbenchFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H7.25V13H4.75C4.33579 13 4 13.3358 4 13.75C4 14.1642 4.33579 14.5 4.75 14.5H11.25C11.6642 14.5 12 14.1642 12 13.75C12 13.3358 11.6642 13 11.25 13H8.75V11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75Z" fill={ colors[0] }/>

  </>,
  name: 'workbench_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V10.25C1.5 10.9404 2.05964 11.5 2.75 11.5H7.25V13H4.75C4.33579 13 4 13.3358 4 13.75C4 14.1642 4.33579 14.5 4.75 14.5H11.25C11.6642 14.5 12 14.1642 12 13.75C12 13.3358 11.6642 13 11.25 13H8.75V11.5H13.25C13.9404 11.5 14.5 10.9404 14.5 10.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
