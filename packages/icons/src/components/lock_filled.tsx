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

export const LockFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1C5.79086 1 4 2.79086 4 5V6H3.25C2.55964 6 2 6.55964 2 7.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V7.25C14 6.55964 13.4404 6 12.75 6H12V5C12 2.79086 10.2091 1 8 1ZM10.5 6V5C10.5 3.61929 9.38071 2.5 8 2.5C6.61929 2.5 5.5 3.61929 5.5 5V6H10.5ZM9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94772 9 10.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'lock_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1C5.79086 1 4 2.79086 4 5V6H3.25C2.55964 6 2 6.55964 2 7.25V13.75C2 14.4404 2.55964 15 3.25 15H12.75C13.4404 15 14 14.4404 14 13.75V7.25C14 6.55964 13.4404 6 12.75 6H12V5C12 2.79086 10.2091 1 8 1ZM10.5 6V5C10.5 3.61929 9.38071 2.5 8 2.5C6.61929 2.5 5.5 3.61929 5.5 5V6H10.5ZM9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94772 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94772 9 10.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
