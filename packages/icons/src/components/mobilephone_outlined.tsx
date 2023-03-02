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

export const MobilephoneOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.5 11.25C6.08579 11.25 5.75 11.5858 5.75 12C5.75 12.4142 6.08579 12.75 6.5 12.75H9.5C9.91421 12.75 10.25 12.4142 10.25 12C10.25 11.5858 9.91421 11.25 9.5 11.25H6.5Z" fill={ colors[0] }/>
    <path d="M3 2.25C3 1.55964 3.55964 1 4.25 1H11.75C12.4404 1 13 1.55964 13 2.25V13.75C13 14.4404 12.4404 15 11.75 15H4.25C3.55964 15 3 14.4404 3 13.75V2.25ZM4.5 2.5V13.5H11.5V2.5H10C10 3.05228 9.55228 3.5 9 3.5H7C6.44772 3.5 6 3.05228 6 2.5H4.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'mobilephone_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.5 11.25C6.08579 11.25 5.75 11.5858 5.75 12C5.75 12.4142 6.08579 12.75 6.5 12.75H9.5C9.91421 12.75 10.25 12.4142 10.25 12C10.25 11.5858 9.91421 11.25 9.5 11.25H6.5Z', 'M3 2.25C3 1.55964 3.55964 1 4.25 1H11.75C12.4404 1 13 1.55964 13 2.25V13.75C13 14.4404 12.4404 15 11.75 15H4.25C3.55964 15 3 14.4404 3 13.75V2.25ZM4.5 2.5V13.5H11.5V2.5H10C10 3.05228 9.55228 3.5 9 3.5H7C6.44772 3.5 6 3.05228 6 2.5H4.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
