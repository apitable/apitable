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

export const GanttMirrorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V9.40042C2.09974 8.97609 2.77454 8.65081 3.50056 8.4484C3.54034 6.59471 5.69598 5.57596 7.15556 6.74362L7.78853 7.25H11.25C11.6642 7.25 12 7.58579 12 8C12 8.41421 11.6642 8.75 11.25 8.75H9.66353L10.8552 9.70331C11.9811 10.604 11.9811 12.3165 10.8552 13.2172L9.2517 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM6 4.75C6 4.33579 6.33579 4 6.75 4H11.25C11.6642 4 12 4.33579 12 4.75C12 5.16421 11.6642 5.5 11.25 5.5H6.75C6.33579 5.5 6 5.16421 6 4.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M5.25 12.9606H5.1691C3.44454 12.9606 1.82302 13.8124 0.836928 15.2272C0.733734 15.3753 0.5 15.3041 0.5 15.1236V14.7106C0.5 13.6115 0.873289 12.5996 1.5 11.7948C2.36916 10.6786 3.72573 9.96027 5.25 9.96027V8.50094C5.25 8.08169 5.73497 7.8486 6.06235 8.1105L9.76196 11.0702C10.0122 11.2704 10.0122 11.6509 9.76196 11.8511L6.06235 14.8107C5.73497 15.0727 5.25 14.8396 5.25 14.4203V12.9606Z" fill={ colors[0] }/>

  </>,
  name: 'gantt_mirror_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 1.5C2.05964 1.5 1.5 2.05964 1.5 2.75V9.40042C2.09974 8.97609 2.77454 8.65081 3.50056 8.4484C3.54034 6.59471 5.69598 5.57596 7.15556 6.74362L7.78853 7.25H11.25C11.6642 7.25 12 7.58579 12 8C12 8.41421 11.6642 8.75 11.25 8.75H9.66353L10.8552 9.70331C11.9811 10.604 11.9811 12.3165 10.8552 13.2172L9.2517 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V2.75C14.5 2.05964 13.9404 1.5 13.25 1.5H2.75ZM6 4.75C6 4.33579 6.33579 4 6.75 4H11.25C11.6642 4 12 4.33579 12 4.75C12 5.16421 11.6642 5.5 11.25 5.5H6.75C6.33579 5.5 6 5.16421 6 4.75Z', 'M5.25 12.9606H5.1691C3.44454 12.9606 1.82302 13.8124 0.836928 15.2272C0.733734 15.3753 0.5 15.3041 0.5 15.1236V14.7106C0.5 13.6115 0.873289 12.5996 1.5 11.7948C2.36916 10.6786 3.72573 9.96027 5.25 9.96027V8.50094C5.25 8.08169 5.73497 7.8486 6.06235 8.1105L9.76196 11.0702C10.0122 11.2704 10.0122 11.6509 9.76196 11.8511L6.06235 14.8107C5.73497 15.0727 5.25 14.8396 5.25 14.4203V12.9606Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
