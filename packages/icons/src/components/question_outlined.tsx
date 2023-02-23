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

export const QuestionOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 4C6.89543 4 6 4.89543 6 6C6 6.41421 5.66421 6.75 5.25 6.75C4.83579 6.75 4.5 6.41421 4.5 6C4.5 4.067 6.067 2.5 8 2.5C9.933 2.5 11.5 4.067 11.5 6C11.5 7.67556 10.3226 9.07612 8.75 9.41946V10.25C8.75 10.6642 8.41421 11 8 11C7.58579 11 7.25 10.6642 7.25 10.25V8.75C7.25 8.33579 7.58579 8 8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M8.99994 13C8.99994 13.5523 8.55223 14 7.99994 14C7.44766 14 6.99994 13.5523 6.99994 13C6.99994 12.4477 7.44766 12 7.99994 12C8.55223 12 8.99994 12.4477 8.99994 13Z" fill={ colors[0] }/>

  </>,
  name: 'question_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 4C6.89543 4 6 4.89543 6 6C6 6.41421 5.66421 6.75 5.25 6.75C4.83579 6.75 4.5 6.41421 4.5 6C4.5 4.067 6.067 2.5 8 2.5C9.933 2.5 11.5 4.067 11.5 6C11.5 7.67556 10.3226 9.07612 8.75 9.41946V10.25C8.75 10.6642 8.41421 11 8 11C7.58579 11 7.25 10.6642 7.25 10.25V8.75C7.25 8.33579 7.58579 8 8 8C9.10457 8 10 7.10457 10 6C10 4.89543 9.10457 4 8 4Z', 'M8.99994 13C8.99994 13.5523 8.55223 14 7.99994 14C7.44766 14 6.99994 13.5523 6.99994 13C6.99994 12.4477 7.44766 12 7.99994 12C8.55223 12 8.99994 12.4477 8.99994 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
