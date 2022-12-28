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

export const ViewKanbanFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.99353 1.00002C1.44422 1.0035 1 1.44987 1 2V10C1 10.5523 1.44772 11 2 11H5L5 14C5 14.5523 5.44771 15 6 15H10C10.5523 15 11 14.5523 11 14L11 1H2C1.99784 1 1.99569 1.00001 1.99353 1.00002ZM3 3L3 9H5L5 3H3ZM9 13H7L7 3H9L9 13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path opacity="0.6" d="M13 3H11V1H14C14.5523 1 15 1.44772 15 2V7C15 7.55228 14.5523 8 14 8H11V6H13V3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'view_kanban_filled',
  defaultColors: ['#7B67EE'],
  colorful: false,
  allPathData: ['M1.99353 1.00002C1.44422 1.0035 1 1.44987 1 2V10C1 10.5523 1.44772 11 2 11H5L5 14C5 14.5523 5.44771 15 6 15H10C10.5523 15 11 14.5523 11 14L11 1H2C1.99784 1 1.99569 1.00001 1.99353 1.00002ZM3 3L3 9H5L5 3H3ZM9 13H7L7 3H9L9 13Z', 'M13 3H11V1H14C14.5523 1 15 1.44772 15 2V7C15 7.55228 14.5523 8 14 8H11V6H13V3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
