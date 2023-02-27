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

export const UnderlineFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.75 1.75C4.75 1.33579 4.41421 1 4 1C3.58579 1 3.25 1.33579 3.25 1.75V7.25C3.25 9.87335 5.37665 12 8 12C10.6234 12 12.75 9.87335 12.75 7.25V1.75C12.75 1.33579 12.4142 1 12 1C11.5858 1 11.25 1.33579 11.25 1.75V7.25C11.25 9.04493 9.79493 10.5 8 10.5C6.20507 10.5 4.75 9.04493 4.75 7.25V1.75Z" fill={ colors[0] }/>
    <path d="M2.75 13.5C2.33579 13.5 2 13.8358 2 14.25C2 14.6642 2.33579 15 2.75 15H13.25C13.6642 15 14 14.6642 14 14.25C14 13.8358 13.6642 13.5 13.25 13.5H2.75Z" fill={ colors[0] }/>

  </>,
  name: 'underline_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.75 1.75C4.75 1.33579 4.41421 1 4 1C3.58579 1 3.25 1.33579 3.25 1.75V7.25C3.25 9.87335 5.37665 12 8 12C10.6234 12 12.75 9.87335 12.75 7.25V1.75C12.75 1.33579 12.4142 1 12 1C11.5858 1 11.25 1.33579 11.25 1.75V7.25C11.25 9.04493 9.79493 10.5 8 10.5C6.20507 10.5 4.75 9.04493 4.75 7.25V1.75Z', 'M2.75 13.5C2.33579 13.5 2 13.8358 2 14.25C2 14.6642 2.33579 15 2.75 15H13.25C13.6642 15 14 14.6642 14 14.25C14 13.8358 13.6642 13.5 13.25 13.5H2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
