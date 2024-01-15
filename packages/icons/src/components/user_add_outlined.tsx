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
    <path d="M4.5 5C4.5 3.067 6.067 1.5 8 1.5C9.933 1.5 11.5 3.067 11.5 5C11.5 6.933 9.933 8.5 8 8.5C6.68447 8.5 5.416 9.04502 4.47562 10.0263C3.70395 10.8315 3.20572 11.8764 3.05126 13L7.99999 13C8.4142 13 8.74999 13.3358 8.74999 13.75C8.74999 14.1642 8.4142 14.5 7.99999 14.5L2.74999 14.5C2.07708 14.5 1.46218 13.9422 1.52232 13.1907C1.64845 11.6146 2.30506 10.1233 3.39263 8.98843C4.01286 8.34123 4.74759 7.83703 5.54876 7.49828C4.90151 6.86315 4.5 5.97846 4.5 5ZM8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3Z" fill={ colors[0] }/>
    <path d="M12.25 9C12.6642 9 13 9.33579 13 9.75V11H14.25C14.6642 11 15 11.3358 15 11.75C15 12.1642 14.6642 12.5 14.25 12.5H13V13.75C13 14.1642 12.6642 14.5 12.25 14.5C11.8358 14.5 11.5 14.1642 11.5 13.75V12.5H10.25C9.83579 12.5 9.5 12.1642 9.5 11.75C9.5 11.3358 9.83579 11 10.25 11H11.5V9.75C11.5 9.33579 11.8358 9 12.25 9Z" fill={ colors[0] }/>

  </>,
  name: 'user_add_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.5 5C4.5 3.067 6.067 1.5 8 1.5C9.933 1.5 11.5 3.067 11.5 5C11.5 6.933 9.933 8.5 8 8.5C6.68447 8.5 5.416 9.04502 4.47562 10.0263C3.70395 10.8315 3.20572 11.8764 3.05126 13L7.99999 13C8.4142 13 8.74999 13.3358 8.74999 13.75C8.74999 14.1642 8.4142 14.5 7.99999 14.5L2.74999 14.5C2.07708 14.5 1.46218 13.9422 1.52232 13.1907C1.64845 11.6146 2.30506 10.1233 3.39263 8.98843C4.01286 8.34123 4.74759 7.83703 5.54876 7.49828C4.90151 6.86315 4.5 5.97846 4.5 5ZM8 3C6.89543 3 6 3.89543 6 5C6 6.10457 6.89543 7 8 7C9.10457 7 10 6.10457 10 5C10 3.89543 9.10457 3 8 3Z', 'M12.25 9C12.6642 9 13 9.33579 13 9.75V11H14.25C14.6642 11 15 11.3358 15 11.75C15 12.1642 14.6642 12.5 14.25 12.5H13V13.75C13 14.1642 12.6642 14.5 12.25 14.5C11.8358 14.5 11.5 14.1642 11.5 13.75V12.5H10.25C9.83579 12.5 9.5 12.1642 9.5 11.75C9.5 11.3358 9.83579 11 10.25 11H11.5V9.75C11.5 9.33579 11.8358 9 12.25 9Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
