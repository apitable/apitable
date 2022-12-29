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

export const TitleRecycleClosedFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 1C6.44772 1 6 1.44772 6 2L3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4H7H9H13C13.5523 4 14 3.55228 14 3C14 2.44772 13.5523 2 13 2H10C10 1.44772 9.55228 1 9 1H7ZM3 5H13L11.4726 14.1644C11.3922 14.6466 10.975 15 10.4862 15H5.51379C5.02495 15 4.60776 14.6466 4.5274 14.1644L3 5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'title_recycle_closed_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7 1C6.44772 1 6 1.44772 6 2L3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4H7H9H13C13.5523 4 14 3.55228 14 3C14 2.44772 13.5523 2 13 2H10C10 1.44772 9.55228 1 9 1H7ZM3 5H13L11.4726 14.1644C11.3922 14.6466 10.975 15 10.4862 15H5.51379C5.02495 15 4.60776 14.6466 4.5274 14.1644L3 5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
