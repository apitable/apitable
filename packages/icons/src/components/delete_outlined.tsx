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

export const DeleteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 3.75C5.25 2.23122 6.48122 1 8 1C9.51878 1 10.75 2.23122 10.75 3.75V4H14C14.4142 4 14.75 4.33579 14.75 4.75C14.75 5.16421 14.4142 5.5 14 5.5H13.25V13.75C13.25 14.4404 12.6904 15 12 15H4C3.30964 15 2.75 14.4404 2.75 13.75V5.5H2C1.58579 5.5 1.25 5.16421 1.25 4.75C1.25 4.33579 1.58579 4 2 4H5.25V3.75ZM4.25 5.5V13.5H11.75V5.5H4.25ZM9.25 4H6.75V3.75C6.75 3.05964 7.30964 2.5 8 2.5C8.69036 2.5 9.25 3.05964 9.25 3.75V4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'delete_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 3.75C5.25 2.23122 6.48122 1 8 1C9.51878 1 10.75 2.23122 10.75 3.75V4H14C14.4142 4 14.75 4.33579 14.75 4.75C14.75 5.16421 14.4142 5.5 14 5.5H13.25V13.75C13.25 14.4404 12.6904 15 12 15H4C3.30964 15 2.75 14.4404 2.75 13.75V5.5H2C1.58579 5.5 1.25 5.16421 1.25 4.75C1.25 4.33579 1.58579 4 2 4H5.25V3.75ZM4.25 5.5V13.5H11.75V5.5H4.25ZM9.25 4H6.75V3.75C6.75 3.05964 7.30964 2.5 8 2.5C8.69036 2.5 9.25 3.05964 9.25 3.75V4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
