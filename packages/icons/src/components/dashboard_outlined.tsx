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

export const DashboardOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.5 9C2.5 5.96243 4.96243 3.5 8 3.5C11.0376 3.5 13.5 5.96243 13.5 9C13.5 10.4447 12.944 11.7579 12.0328 12.7399C11.7511 13.0435 11.7688 13.5181 12.0725 13.7998C12.3761 14.0815 12.8507 14.0638 13.1324 13.7601C14.2907 12.5117 15 10.8378 15 9C15 5.13401 11.866 2 8 2C4.13401 2 1 5.13401 1 9C1 10.8378 1.70925 12.5117 2.86759 13.7601C3.14933 14.0638 3.62387 14.0815 3.92751 13.7998C4.23115 13.5181 4.24891 13.0435 3.96718 12.7399C3.05604 11.7579 2.5 10.4447 2.5 9Z" fill={ colors[0] }/>
    <path d="M11.0303 5.96967C11.3232 6.26256 11.3232 6.73744 11.0303 7.03033L9.44919 8.61147C9.48233 8.73539 9.5 8.86563 9.5 9C9.5 9.82843 8.82843 10.5 8 10.5C7.17157 10.5 6.5 9.82843 6.5 9C6.5 8.17157 7.17157 7.5 8 7.5C8.13437 7.5 8.26461 7.51767 8.38853 7.55081L9.96967 5.96967C10.2626 5.67678 10.7374 5.67678 11.0303 5.96967Z" fill={ colors[0] }/>

  </>,
  name: 'dashboard_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.5 9C2.5 5.96243 4.96243 3.5 8 3.5C11.0376 3.5 13.5 5.96243 13.5 9C13.5 10.4447 12.944 11.7579 12.0328 12.7399C11.7511 13.0435 11.7688 13.5181 12.0725 13.7998C12.3761 14.0815 12.8507 14.0638 13.1324 13.7601C14.2907 12.5117 15 10.8378 15 9C15 5.13401 11.866 2 8 2C4.13401 2 1 5.13401 1 9C1 10.8378 1.70925 12.5117 2.86759 13.7601C3.14933 14.0638 3.62387 14.0815 3.92751 13.7998C4.23115 13.5181 4.24891 13.0435 3.96718 12.7399C3.05604 11.7579 2.5 10.4447 2.5 9Z', 'M11.0303 5.96967C11.3232 6.26256 11.3232 6.73744 11.0303 7.03033L9.44919 8.61147C9.48233 8.73539 9.5 8.86563 9.5 9C9.5 9.82843 8.82843 10.5 8 10.5C7.17157 10.5 6.5 9.82843 6.5 9C6.5 8.17157 7.17157 7.5 8 7.5C8.13437 7.5 8.26461 7.51767 8.38853 7.55081L9.96967 5.96967C10.2626 5.67678 10.7374 5.67678 11.0303 5.96967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
