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

export const LockOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94771 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94771 9 10.5Z" fill={ colors[0] }/>
    <path d="M4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5V6H12.75C13.4404 6 14 6.55964 14 7.25V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V7.25C2 6.55964 2.55964 6 3.25 6H4V5ZM5.5 6H10.5V5C10.5 3.61929 9.38071 2.5 8 2.5C6.61929 2.5 5.5 3.61929 5.5 5V6ZM3.5 7.5V13.5H12.5V7.5H3.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'lock_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9 10.5C9 11.0523 8.55228 11.5 8 11.5C7.44772 11.5 7 11.0523 7 10.5C7 9.94771 7.44772 9.5 8 9.5C8.55228 9.5 9 9.94771 9 10.5Z', 'M4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5V6H12.75C13.4404 6 14 6.55964 14 7.25V13.75C14 14.4404 13.4404 15 12.75 15H3.25C2.55964 15 2 14.4404 2 13.75V7.25C2 6.55964 2.55964 6 3.25 6H4V5ZM5.5 6H10.5V5C10.5 3.61929 9.38071 2.5 8 2.5C6.61929 2.5 5.5 3.61929 5.5 5V6ZM3.5 7.5V13.5H12.5V7.5H3.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
