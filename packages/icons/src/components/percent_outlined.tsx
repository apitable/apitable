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

export const PercentOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.75 2.75C1.75 1.36929 2.86929 0.25 4.25 0.25C5.63071 0.25 6.75 1.36929 6.75 2.75V5.25C6.75 6.63071 5.63071 7.75 4.25 7.75C2.86929 7.75 1.75 6.63071 1.75 5.25V2.75ZM4.25 1.75C3.69772 1.75 3.25 2.19772 3.25 2.75V5.25C3.25 5.80228 3.69772 6.25 4.25 6.25C4.80228 6.25 5.25 5.80228 5.25 5.25V2.75C5.25 2.19772 4.80228 1.75 4.25 1.75ZM9.25 10.75C9.25 9.36929 10.3693 8.25 11.75 8.25C13.1307 8.25 14.25 9.36929 14.25 10.75V13.25C14.25 14.6307 13.1307 15.75 11.75 15.75C10.3693 15.75 9.25 14.6307 9.25 13.25V10.75ZM11.75 9.75C11.1977 9.75 10.75 10.1977 10.75 10.75V13.25C10.75 13.8023 11.1977 14.25 11.75 14.25C12.3023 14.25 12.75 13.8023 12.75 13.25V10.75C12.75 10.1977 12.3023 9.75 11.75 9.75ZM13 0.5H11.3333L3 15.5H4.66667L13 0.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'percent_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1.75 2.75C1.75 1.36929 2.86929 0.25 4.25 0.25C5.63071 0.25 6.75 1.36929 6.75 2.75V5.25C6.75 6.63071 5.63071 7.75 4.25 7.75C2.86929 7.75 1.75 6.63071 1.75 5.25V2.75ZM4.25 1.75C3.69772 1.75 3.25 2.19772 3.25 2.75V5.25C3.25 5.80228 3.69772 6.25 4.25 6.25C4.80228 6.25 5.25 5.80228 5.25 5.25V2.75C5.25 2.19772 4.80228 1.75 4.25 1.75ZM9.25 10.75C9.25 9.36929 10.3693 8.25 11.75 8.25C13.1307 8.25 14.25 9.36929 14.25 10.75V13.25C14.25 14.6307 13.1307 15.75 11.75 15.75C10.3693 15.75 9.25 14.6307 9.25 13.25V10.75ZM11.75 9.75C11.1977 9.75 10.75 10.1977 10.75 10.75V13.25C10.75 13.8023 11.1977 14.25 11.75 14.25C12.3023 14.25 12.75 13.8023 12.75 13.25V10.75C12.75 10.1977 12.3023 9.75 11.75 9.75ZM13 0.5H11.3333L3 15.5H4.66667L13 0.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
