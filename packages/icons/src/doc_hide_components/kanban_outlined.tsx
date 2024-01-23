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

export const KanbanOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V8.25C14.5 8.94036 13.9404 9.5 13.25 9.5H10.75V13.25C10.75 13.9404 10.1904 14.5 9.5 14.5H6.5C5.80964 14.5 5.25 13.9404 5.25 13.25V11.5H2.75C2.05964 11.5 1.5 10.9404 1.5 10.25V2.75ZM9.25 3H6.75V13H9.25V3ZM10.75 8H13V3H10.75V8ZM3 3H5.25V10H3V3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'kanban_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V8.25C14.5 8.94036 13.9404 9.5 13.25 9.5H10.75V13.25C10.75 13.9404 10.1904 14.5 9.5 14.5H6.5C5.80964 14.5 5.25 13.9404 5.25 13.25V11.5H2.75C2.05964 11.5 1.5 10.9404 1.5 10.25V2.75ZM9.25 3H6.75V13H9.25V3ZM10.75 8H13V3H10.75V8ZM3 3H5.25V10H3V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
