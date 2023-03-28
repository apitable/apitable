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

export const RobotFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.75 3.12509C9.05361 2.89704 9.25 2.53395 9.25 2.125C9.25 1.43464 8.69036 0.875 8 0.875C7.30964 0.875 6.75 1.43464 6.75 2.125C6.75 2.53395 6.94639 2.89704 7.25 3.12509V4.625H4C3.30964 4.625 2.75 5.18464 2.75 5.875V12.375C2.75 13.0654 3.30964 13.625 4 13.625H12C12.6904 13.625 13.25 13.0654 13.25 12.375V5.875C13.25 5.18464 12.6904 4.625 12 4.625H8.75V3.12509ZM7.25 9.125C7.25 9.67728 6.80228 10.125 6.25 10.125C5.69772 10.125 5.25 9.67728 5.25 9.125C5.25 8.57272 5.69772 8.125 6.25 8.125C6.80228 8.125 7.25 8.57272 7.25 9.125ZM10.75 9.125C10.75 9.67728 10.3023 10.125 9.75 10.125C9.19772 10.125 8.75 9.67728 8.75 9.125C8.75 8.57272 9.19772 8.125 9.75 8.125C10.3023 8.125 10.75 8.57272 10.75 9.125Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M14 7.875C14 7.46079 14.3358 7.125 14.75 7.125C15.1642 7.125 15.5 7.46079 15.5 7.875V10.375C15.5 10.7892 15.1642 11.125 14.75 11.125C14.3358 11.125 14 10.7892 14 10.375V7.875Z" fill={ colors[0] }/>
    <path d="M1.25 7.125C0.835786 7.125 0.5 7.46079 0.5 7.875V10.375C0.5 10.7892 0.835786 11.125 1.25 11.125C1.66421 11.125 2 10.7892 2 10.375V7.875C2 7.46079 1.66421 7.125 1.25 7.125Z" fill={ colors[0] }/>

  </>,
  name: 'robot_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.75 3.12509C9.05361 2.89704 9.25 2.53395 9.25 2.125C9.25 1.43464 8.69036 0.875 8 0.875C7.30964 0.875 6.75 1.43464 6.75 2.125C6.75 2.53395 6.94639 2.89704 7.25 3.12509V4.625H4C3.30964 4.625 2.75 5.18464 2.75 5.875V12.375C2.75 13.0654 3.30964 13.625 4 13.625H12C12.6904 13.625 13.25 13.0654 13.25 12.375V5.875C13.25 5.18464 12.6904 4.625 12 4.625H8.75V3.12509ZM7.25 9.125C7.25 9.67728 6.80228 10.125 6.25 10.125C5.69772 10.125 5.25 9.67728 5.25 9.125C5.25 8.57272 5.69772 8.125 6.25 8.125C6.80228 8.125 7.25 8.57272 7.25 9.125ZM10.75 9.125C10.75 9.67728 10.3023 10.125 9.75 10.125C9.19772 10.125 8.75 9.67728 8.75 9.125C8.75 8.57272 9.19772 8.125 9.75 8.125C10.3023 8.125 10.75 8.57272 10.75 9.125Z', 'M14 7.875C14 7.46079 14.3358 7.125 14.75 7.125C15.1642 7.125 15.5 7.46079 15.5 7.875V10.375C15.5 10.7892 15.1642 11.125 14.75 11.125C14.3358 11.125 14 10.7892 14 10.375V7.875Z', 'M1.25 7.125C0.835786 7.125 0.5 7.46079 0.5 7.875V10.375C0.5 10.7892 0.835786 11.125 1.25 11.125C1.66421 11.125 2 10.7892 2 10.375V7.875C2 7.46079 1.66421 7.125 1.25 7.125Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
