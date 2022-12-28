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

export const VisitorOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.00001 1C4.34315 1 3.00001 2.34315 3.00001 4C3.00001 4.95862 3.44963 5.81223 4.1495 6.36144C2.49149 7.03813 1.2874 8.59701 1.11995 10.4551C1.09517 10.7302 1.29803 10.9732 1.57306 10.998C1.84809 11.0228 2.09113 10.8199 2.11592 10.5449C2.295 8.55765 3.96588 7 6 7C8.03412 7 9.705 8.55765 9.88408 10.5449C9.90887 10.8199 10.1519 11.0228 10.4269 10.998C10.702 10.9732 10.9048 10.7302 10.88 10.4551C10.7126 8.59701 9.50851 7.03814 7.85051 6.36144C8.55038 5.81223 9.00001 4.95862 9.00001 4C9.00001 2.34315 7.65686 1 6.00001 1ZM4.00001 4C4.00001 2.89543 4.89544 2 6.00001 2C7.10457 2 8.00001 2.89543 8.00001 4C8.00001 5.10457 7.10457 6 6.00001 6C4.89544 6 4.00001 5.10457 4.00001 4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'visitor_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M6.00001 1C4.34315 1 3.00001 2.34315 3.00001 4C3.00001 4.95862 3.44963 5.81223 4.1495 6.36144C2.49149 7.03813 1.2874 8.59701 1.11995 10.4551C1.09517 10.7302 1.29803 10.9732 1.57306 10.998C1.84809 11.0228 2.09113 10.8199 2.11592 10.5449C2.295 8.55765 3.96588 7 6 7C8.03412 7 9.705 8.55765 9.88408 10.5449C9.90887 10.8199 10.1519 11.0228 10.4269 10.998C10.702 10.9732 10.9048 10.7302 10.88 10.4551C10.7126 8.59701 9.50851 7.03814 7.85051 6.36144C8.55038 5.81223 9.00001 4.95862 9.00001 4C9.00001 2.34315 7.65686 1 6.00001 1ZM4.00001 4C4.00001 2.89543 4.89544 2 6.00001 2C7.10457 2 8.00001 2.89543 8.00001 4C8.00001 5.10457 7.10457 6 6.00001 6C4.89544 6 4.00001 5.10457 4.00001 4Z'],
  width: '12',
  height: '12',
  viewBox: '0 0 12 12',
});
