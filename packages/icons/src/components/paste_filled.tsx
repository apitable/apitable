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

export const PasteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.75 1C6.05964 1 5.5 1.55964 5.5 2.25V4H3.25C2.55964 4 2 4.55964 2 5.25V13.75C2 14.4404 2.55964 15 3.25 15H9.75C10.4404 15 11 14.4404 11 13.75V11H12.75C13.4404 11 14 10.4404 14 9.75V2.25C14 1.55964 13.4404 1 12.75 1H6.75ZM11 9.5H12.5V2.5H7V4H9.75C10.4404 4 11 4.55964 11 5.25V9.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'paste_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.75 1C6.05964 1 5.5 1.55964 5.5 2.25V4H3.25C2.55964 4 2 4.55964 2 5.25V13.75C2 14.4404 2.55964 15 3.25 15H9.75C10.4404 15 11 14.4404 11 13.75V11H12.75C13.4404 11 14 10.4404 14 9.75V2.25C14 1.55964 13.4404 1 12.75 1H6.75ZM11 9.5H12.5V2.5H7V4H9.75C10.4404 4 11 4.55964 11 5.25V9.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
