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

export const ViewGanttOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path opacity="0.6" d="M8 2.5C8 1.67157 8.67157 1 9.5 1H13.5C14.3284 1 15 1.67157 15 2.5C15 3.32843 14.3284 4 13.5 4H9.5C8.67157 4 8 3.32843 8 2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M1 7.5C1 6.67157 1.67157 6 2.5 6H13.5C14.3284 6 15 6.67157 15 7.5C15 8.32843 14.3284 9 13.5 9H2.5C1.67157 9 1 8.32843 1 7.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M1 12.5C1 11.6716 1.67157 11 2.5 11H8.5C9.32843 11 10 11.6716 10 12.5C10 13.3284 9.32843 14 8.5 14H2.5C1.67157 14 1 13.3284 1 12.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_gantt_outlined',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M8 2.5C8 1.67157 8.67157 1 9.5 1H13.5C14.3284 1 15 1.67157 15 2.5C15 3.32843 14.3284 4 13.5 4H9.5C8.67157 4 8 3.32843 8 2.5Z', 'M1 7.5C1 6.67157 1.67157 6 2.5 6H13.5C14.3284 6 15 6.67157 15 7.5C15 8.32843 14.3284 9 13.5 9H2.5C1.67157 9 1 8.32843 1 7.5Z', 'M1 12.5C1 11.6716 1.67157 11 2.5 11H8.5C9.32843 11 10 11.6716 10 12.5C10 13.3284 9.32843 14 8.5 14H2.5C1.67157 14 1 13.3284 1 12.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
