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

export const AlarmFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 7C2 3.68629 4.68629 1 8 1C11.3137 1 14 3.68629 14 7V10.75C14 11.4404 13.4404 12 12.75 12H3.25C2.55964 12 2 11.4404 2 10.75V7ZM6.25 7C6.25 6.0335 7.0335 5.25 8 5.25C8.41421 5.25 8.75 4.91421 8.75 4.5C8.75 4.08579 8.41421 3.75 8 3.75C6.20507 3.75 4.75 5.20507 4.75 7C4.75 7.41421 5.08579 7.75 5.5 7.75C5.91421 7.75 6.25 7.41421 6.25 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M2.75 13.5C2.33579 13.5 2 13.8358 2 14.25C2 14.6642 2.33579 15 2.75 15H13.25C13.6642 15 14 14.6642 14 14.25C14 13.8358 13.6642 13.5 13.25 13.5H2.75Z" fill={ colors[0] }/>

  </>,
  name: 'alarm_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2 7C2 3.68629 4.68629 1 8 1C11.3137 1 14 3.68629 14 7V10.75C14 11.4404 13.4404 12 12.75 12H3.25C2.55964 12 2 11.4404 2 10.75V7ZM6.25 7C6.25 6.0335 7.0335 5.25 8 5.25C8.41421 5.25 8.75 4.91421 8.75 4.5C8.75 4.08579 8.41421 3.75 8 3.75C6.20507 3.75 4.75 5.20507 4.75 7C4.75 7.41421 5.08579 7.75 5.5 7.75C5.91421 7.75 6.25 7.41421 6.25 7Z', 'M2.75 13.5C2.33579 13.5 2 13.8358 2 14.25C2 14.6642 2.33579 15 2.75 15H13.25C13.6642 15 14 14.6642 14 14.25C14 13.8358 13.6642 13.5 13.25 13.5H2.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
