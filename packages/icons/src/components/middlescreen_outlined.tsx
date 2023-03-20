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

export const MiddlescreenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.75 5.25C4.47386 5.25 4.25 5.47386 4.25 5.75V10.25C4.25 10.5261 4.47386 10.75 4.75 10.75H11.25C11.5261 10.75 11.75 10.5261 11.75 10.25V5.75C11.75 5.47386 11.5261 5.25 11.25 5.25H4.75Z" fill={ colors[0] }/>
    <path d="M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 12.5V3.5H13.5V12.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'middlescreen_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.75 5.25C4.47386 5.25 4.25 5.47386 4.25 5.75V10.25C4.25 10.5261 4.47386 10.75 4.75 10.75H11.25C11.5261 10.75 11.75 10.5261 11.75 10.25V5.75C11.75 5.47386 11.5261 5.25 11.25 5.25H4.75Z', 'M2.25 2C1.55964 2 1 2.55964 1 3.25V12.75C1 13.4404 1.55964 14 2.25 14H13.75C14.4404 14 15 13.4404 15 12.75V3.25C15 2.55964 14.4404 2 13.75 2H2.25ZM2.5 12.5V3.5H13.5V12.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
