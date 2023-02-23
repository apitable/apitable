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

export const UserAddOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5C12 7.20914 10.2091 9 8 9C5.20578 9 2.93427 10.9779 2.55568 13.5H8C8.41422 13.5 8.75 13.8358 8.75 14.25C8.75 14.6642 8.41422 15 8 15H2.25C1.57785 15 0.95925 14.4413 1.02413 13.686C1.24703 11.0912 2.98107 8.9348 5.3538 7.99966C4.5236 7.26673 4 6.19451 4 5ZM10.5 5C10.5 6.38071 9.38071 7.5 8 7.5C6.61929 7.5 5.5 6.38071 5.5 5C5.5 3.61929 6.61929 2.5 8 2.5C9.38071 2.5 10.5 3.61929 10.5 5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M12.25 9.25C12.6642 9.25 13 9.58579 13 10V11.25H14.25C14.6642 11.25 15 11.5858 15 12C15 12.4142 14.6642 12.75 14.25 12.75H13V14C13 14.4142 12.6642 14.75 12.25 14.75C11.8358 14.75 11.5 14.4142 11.5 14V12.75H10.25C9.83579 12.75 9.5 12.4142 9.5 12C9.5 11.5858 9.83579 11.25 10.25 11.25H11.5V10C11.5 9.58579 11.8358 9.25 12.25 9.25Z" fill={ colors[0] }/>

  </>,
  name: 'user_add_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4 5C4 2.79086 5.79086 1 8 1C10.2091 1 12 2.79086 12 5C12 7.20914 10.2091 9 8 9C5.20578 9 2.93427 10.9779 2.55568 13.5H8C8.41422 13.5 8.75 13.8358 8.75 14.25C8.75 14.6642 8.41422 15 8 15H2.25C1.57785 15 0.95925 14.4413 1.02413 13.686C1.24703 11.0912 2.98107 8.9348 5.3538 7.99966C4.5236 7.26673 4 6.19451 4 5ZM10.5 5C10.5 6.38071 9.38071 7.5 8 7.5C6.61929 7.5 5.5 6.38071 5.5 5C5.5 3.61929 6.61929 2.5 8 2.5C9.38071 2.5 10.5 3.61929 10.5 5Z', 'M12.25 9.25C12.6642 9.25 13 9.58579 13 10V11.25H14.25C14.6642 11.25 15 11.5858 15 12C15 12.4142 14.6642 12.75 14.25 12.75H13V14C13 14.4142 12.6642 14.75 12.25 14.75C11.8358 14.75 11.5 14.4142 11.5 14V12.75H10.25C9.83579 12.75 9.5 12.4142 9.5 12C9.5 11.5858 9.83579 11.25 10.25 11.25H11.5V10C11.5 9.58579 11.8358 9.25 12.25 9.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
