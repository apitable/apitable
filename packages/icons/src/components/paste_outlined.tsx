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

export const PasteOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.25 1.5C6.55964 1.5 6 2.05964 6 2.75V4H2.75C2.05964 4 1.5 4.55964 1.5 5.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H9.75C10.4404 14.5 11 13.9404 11 13.25V11.25H13.25C13.9404 11.25 14.5 10.6904 14.5 10V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H7.25ZM11 9.75H13V3H7.5V4H9.75C10.4404 4 11 4.55964 11 5.25V9.75ZM3 13V5.5H9.5V13H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'paste_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.25 1.5C6.55964 1.5 6 2.05964 6 2.75V4H2.75C2.05964 4 1.5 4.55964 1.5 5.25V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H9.75C10.4404 14.5 11 13.9404 11 13.25V11.25H13.25C13.9404 11.25 14.5 10.6904 14.5 10V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H7.25ZM11 9.75H13V3H7.5V4H9.75C10.4404 4 11 4.55964 11 5.25V9.75ZM3 13V5.5H9.5V13H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
