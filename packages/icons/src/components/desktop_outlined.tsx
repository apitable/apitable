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

export const DesktopOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.63587 4.10688C6.99106 4.31999 7.10623 4.78069 6.89312 5.13587L5.39312 7.63587C5.18001 7.99106 4.71931 8.10623 4.36413 7.89312C4.00894 7.68001 3.89377 7.21931 4.10688 6.86413L5.60688 4.36413C5.81999 4.00894 6.28069 3.89377 6.63587 4.10688Z" fill={ colors[0] }/>
    <path d="M11.8931 5.13587C12.1062 4.78069 11.9911 4.31999 11.6359 4.10688C11.2807 3.89377 10.82 4.00894 10.6069 4.36413L9.10688 6.86413C8.89377 7.21931 9.00894 7.68001 9.36413 7.89312C9.71931 8.10623 10.18 7.99106 10.3931 7.63587L11.8931 5.13587Z" fill={ colors[0] }/>
    <path d="M1 2.25C1 1.55964 1.55964 1 2.25 1H13.75C14.4404 1 15 1.55964 15 2.25V10.75C15 11.4404 14.4404 12 13.75 12H8.75V13.5H11.25C11.6642 13.5 12 13.8358 12 14.25C12 14.6642 11.6642 15 11.25 15H4.75C4.33579 15 4 14.6642 4 14.25C4 13.8358 4.33579 13.5 4.75 13.5H7.25V12H2.25C1.55964 12 1 11.4404 1 10.75V2.25ZM2.5 2.5V10.5H13.5V2.5H2.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'desktop_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.63587 4.10688C6.99106 4.31999 7.10623 4.78069 6.89312 5.13587L5.39312 7.63587C5.18001 7.99106 4.71931 8.10623 4.36413 7.89312C4.00894 7.68001 3.89377 7.21931 4.10688 6.86413L5.60688 4.36413C5.81999 4.00894 6.28069 3.89377 6.63587 4.10688Z', 'M11.8931 5.13587C12.1062 4.78069 11.9911 4.31999 11.6359 4.10688C11.2807 3.89377 10.82 4.00894 10.6069 4.36413L9.10688 6.86413C8.89377 7.21931 9.00894 7.68001 9.36413 7.89312C9.71931 8.10623 10.18 7.99106 10.3931 7.63587L11.8931 5.13587Z', 'M1 2.25C1 1.55964 1.55964 1 2.25 1H13.75C14.4404 1 15 1.55964 15 2.25V10.75C15 11.4404 14.4404 12 13.75 12H8.75V13.5H11.25C11.6642 13.5 12 13.8358 12 14.25C12 14.6642 11.6642 15 11.25 15H4.75C4.33579 15 4 14.6642 4 14.25C4 13.8358 4.33579 13.5 4.75 13.5H7.25V12H2.25C1.55964 12 1 11.4404 1 10.75V2.25ZM2.5 2.5V10.5H13.5V2.5H2.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
