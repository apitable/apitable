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

export const CourseOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.61446 1.71204C8.2149 1.58302 7.78487 1.58302 7.38531 1.71204L1.48273 3.61805C-0.364509 4.21454 -0.364497 6.82803 1.48273 7.42452L2.00014 7.59159V12.1628C2.00014 12.4737 2.14471 12.7669 2.39132 12.9561C5.69956 15.495 10.3007 15.495 13.609 12.9561C13.8556 12.7669 14.0001 12.4737 14.0001 12.1628V7.59143L14.517 7.42452C16.3643 6.82802 16.3643 4.21454 14.517 3.61805L8.61446 1.71204ZM12.0001 8.23725L8.61446 9.33053C8.2149 9.45955 7.78487 9.45955 7.38531 9.33053L4.00014 8.23742V11.6497C6.41988 13.2639 9.58039 13.2639 12.0001 11.6497V8.23725ZM2.09731 5.52128L7.99988 3.61527L13.9025 5.52128L7.99988 7.42729L2.09731 5.52128Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'course_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.61446 1.71204C8.2149 1.58302 7.78487 1.58302 7.38531 1.71204L1.48273 3.61805C-0.364509 4.21454 -0.364497 6.82803 1.48273 7.42452L2.00014 7.59159V12.1628C2.00014 12.4737 2.14471 12.7669 2.39132 12.9561C5.69956 15.495 10.3007 15.495 13.609 12.9561C13.8556 12.7669 14.0001 12.4737 14.0001 12.1628V7.59143L14.517 7.42452C16.3643 6.82802 16.3643 4.21454 14.517 3.61805L8.61446 1.71204ZM12.0001 8.23725L8.61446 9.33053C8.2149 9.45955 7.78487 9.45955 7.38531 9.33053L4.00014 8.23742V11.6497C6.41988 13.2639 9.58039 13.2639 12.0001 11.6497V8.23725ZM2.09731 5.52128L7.99988 3.61527L13.9025 5.52128L7.99988 7.42729L2.09731 5.52128Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
