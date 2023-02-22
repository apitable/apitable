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

export const KanbanMirrorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H4.5V6.62951C3.92506 7.01055 3.51765 7.6527 3.50056 8.44887C2.77454 8.65128 2.09974 8.97656 1.5 9.4009V2.75Z" fill={ colors[0] }/>
    <path d="M9.76196 11.8511C10.0122 11.6509 10.0122 11.2704 9.76196 11.0702L6.06235 8.1105C5.73497 7.8486 5.25 8.08169 5.25 8.50094V9.96063C2.62665 9.96063 0.5 12.0873 0.5 14.7106V15.1236C0.5 15.3041 0.733734 15.3753 0.836928 15.2272C1.82302 13.8124 3.44454 12.9606 5.1691 12.9606H5.25V14.4203C5.25 14.8396 5.73497 15.0727 6.06235 14.8107L9.76196 11.8511Z" fill={ colors[0] }/>
    <path d="M7.15556 6.7441L10 9.01964V1.5H6V6.25984C6.3994 6.30349 6.79833 6.45831 7.15556 6.7441Z" fill={ colors[0] }/>
    <path d="M13.25 1.5H11.5V9.5H13.25C13.9404 9.5 14.5 8.94036 14.5 8.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5Z" fill={ colors[0] }/>

  </>,
  name: 'kanban_mirror_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H4.5V6.62951C3.92506 7.01055 3.51765 7.6527 3.50056 8.44887C2.77454 8.65128 2.09974 8.97656 1.5 9.4009V2.75Z', 'M9.76196 11.8511C10.0122 11.6509 10.0122 11.2704 9.76196 11.0702L6.06235 8.1105C5.73497 7.8486 5.25 8.08169 5.25 8.50094V9.96063C2.62665 9.96063 0.5 12.0873 0.5 14.7106V15.1236C0.5 15.3041 0.733734 15.3753 0.836928 15.2272C1.82302 13.8124 3.44454 12.9606 5.1691 12.9606H5.25V14.4203C5.25 14.8396 5.73497 15.0727 6.06235 14.8107L9.76196 11.8511Z', 'M7.15556 6.7441L10 9.01964V1.5H6V6.25984C6.3994 6.30349 6.79833 6.45831 7.15556 6.7441Z', 'M13.25 1.5H11.5V9.5H13.25C13.9404 9.5 14.5 8.94036 14.5 8.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
