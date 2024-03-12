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

export const KanbanMirrorOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V9.4009C1.95951 9.07578 2.46309 8.80881 3 8.6107V3H5.25V6.30586C5.73673 6.1924 6.26485 6.23783 6.75 6.48268V3H9.25V8.41964L10.75 9.61964V9.5H13.25C13.9404 9.5 14.5 8.94036 14.5 8.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM13 8H10.75V3H13V8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M5.25 8.50094C5.25 8.08169 5.73497 7.8486 6.06235 8.1105L9.76196 11.0702C10.0122 11.2704 10.0122 11.6509 9.76196 11.8511L6.06235 14.8107C5.73497 15.0727 5.25 14.8396 5.25 14.4203V12.9606H5.1691C3.44454 12.9606 1.82302 13.8124 0.836928 15.2272C0.733734 15.3753 0.5 15.3041 0.5 15.1236V14.7106C0.5 12.0873 2.62665 9.96063 5.25 9.96063V8.50094Z" fill={ colors[0] }/>

  </>,
  name: 'kanban_mirror_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V9.4009C1.95951 9.07578 2.46309 8.80881 3 8.6107V3H5.25V6.30586C5.73673 6.1924 6.26485 6.23783 6.75 6.48268V3H9.25V8.41964L10.75 9.61964V9.5H13.25C13.9404 9.5 14.5 8.94036 14.5 8.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM13 8H10.75V3H13V8Z', 'M5.25 8.50094C5.25 8.08169 5.73497 7.8486 6.06235 8.1105L9.76196 11.0702C10.0122 11.2704 10.0122 11.6509 9.76196 11.8511L6.06235 14.8107C5.73497 15.0727 5.25 14.8396 5.25 14.4203V12.9606H5.1691C3.44454 12.9606 1.82302 13.8124 0.836928 15.2272C0.733734 15.3753 0.5 15.3041 0.5 15.1236V14.7106C0.5 12.0873 2.62665 9.96063 5.25 9.96063V8.50094Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
