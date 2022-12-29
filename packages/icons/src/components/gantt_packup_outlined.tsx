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

export const GanttPackupOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5V8V11C4 11.5523 4.44772 12 5 12C5.55228 12 6 11.5523 6 11V8V5ZM10.4142 8L12.7071 5.70711C13.0976 5.31658 13.0976 4.68342 12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L8.29289 7.29289C7.90237 7.68342 7.90237 8.31658 8.29289 8.70711L11.2929 11.7071C11.6834 12.0976 12.3166 12.0976 12.7071 11.7071C13.0976 11.3166 13.0976 10.6834 12.7071 10.2929L10.4142 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gantt_packup_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6 5C6 4.44772 5.55228 4 5 4C4.44772 4 4 4.44772 4 5V8V11C4 11.5523 4.44772 12 5 12C5.55228 12 6 11.5523 6 11V8V5ZM10.4142 8L12.7071 5.70711C13.0976 5.31658 13.0976 4.68342 12.7071 4.29289C12.3166 3.90237 11.6834 3.90237 11.2929 4.29289L8.29289 7.29289C7.90237 7.68342 7.90237 8.31658 8.29289 8.70711L11.2929 11.7071C11.6834 12.0976 12.3166 12.0976 12.7071 11.7071C13.0976 11.3166 13.0976 10.6834 12.7071 10.2929L10.4142 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
