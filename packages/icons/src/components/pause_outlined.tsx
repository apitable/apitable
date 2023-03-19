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

export const PauseOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.5 5.875C5.5 5.46079 5.83579 5.125 6.25 5.125C6.66421 5.125 7 5.46079 7 5.875V10.375C7 10.7892 6.66421 11.125 6.25 11.125C5.83579 11.125 5.5 10.7892 5.5 10.375V5.875Z" fill={ colors[0] }/>
    <path d="M9 5.875C9 5.46079 9.33579 5.125 9.75 5.125C10.1642 5.125 10.5 5.46079 10.5 5.875V10.375C10.5 10.7892 10.1642 11.125 9.75 11.125C9.33579 11.125 9 10.7892 9 10.375V5.875Z" fill={ colors[0] }/>
    <path d="M8 1.125C4.13401 1.125 1 4.25901 1 8.125C1 11.991 4.13401 15.125 8 15.125C11.866 15.125 15 11.991 15 8.125C15 4.25901 11.866 1.125 8 1.125ZM2.5 8.125C2.5 5.08743 4.96243 2.625 8 2.625C11.0376 2.625 13.5 5.08743 13.5 8.125C13.5 11.1626 11.0376 13.625 8 13.625C4.96243 13.625 2.5 11.1626 2.5 8.125Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'pause_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.5 5.875C5.5 5.46079 5.83579 5.125 6.25 5.125C6.66421 5.125 7 5.46079 7 5.875V10.375C7 10.7892 6.66421 11.125 6.25 11.125C5.83579 11.125 5.5 10.7892 5.5 10.375V5.875Z', 'M9 5.875C9 5.46079 9.33579 5.125 9.75 5.125C10.1642 5.125 10.5 5.46079 10.5 5.875V10.375C10.5 10.7892 10.1642 11.125 9.75 11.125C9.33579 11.125 9 10.7892 9 10.375V5.875Z', 'M8 1.125C4.13401 1.125 1 4.25901 1 8.125C1 11.991 4.13401 15.125 8 15.125C11.866 15.125 15 11.991 15 8.125C15 4.25901 11.866 1.125 8 1.125ZM2.5 8.125C2.5 5.08743 4.96243 2.625 8 2.625C11.0376 2.625 13.5 5.08743 13.5 8.125C13.5 11.1626 11.0376 13.625 8 13.625C4.96243 13.625 2.5 11.1626 2.5 8.125Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
