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

export const ShieldAddFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.77817 2.28271C2.30761 2.47451 2 2.93196 2 3.44011V8.81475C2 11.2096 5.90597 13.7659 7.4157 14.6646C7.77862 14.8806 8.22342 14.8786 8.58477 14.66C10.0921 13.748 14 11.1575 14 8.81475V3.43946C14 2.93139 13.6925 2.47449 13.222 2.28263L12.0401 1.80063C9.42317 0.733375 6.57976 0.733117 3.96265 1.79989L2.77817 2.28271ZM8 4.5C8.41421 4.5 8.75 4.83579 8.75 5.25V6.5H10C10.4142 6.5 10.75 6.83579 10.75 7.25C10.75 7.66421 10.4142 8 10 8H8.75V9.25C8.75 9.66421 8.41421 10 8 10C7.58579 10 7.25 9.66421 7.25 9.25V8H6C5.58579 8 5.25 7.66421 5.25 7.25C5.25 6.83579 5.58579 6.5 6 6.5H7.25V5.25C7.25 4.83579 7.58579 4.5 8 4.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'shield_add_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.77817 2.28271C2.30761 2.47451 2 2.93196 2 3.44011V8.81475C2 11.2096 5.90597 13.7659 7.4157 14.6646C7.77862 14.8806 8.22342 14.8786 8.58477 14.66C10.0921 13.748 14 11.1575 14 8.81475V3.43946C14 2.93139 13.6925 2.47449 13.222 2.28263L12.0401 1.80063C9.42317 0.733375 6.57976 0.733117 3.96265 1.79989L2.77817 2.28271ZM8 4.5C8.41421 4.5 8.75 4.83579 8.75 5.25V6.5H10C10.4142 6.5 10.75 6.83579 10.75 7.25C10.75 7.66421 10.4142 8 10 8H8.75V9.25C8.75 9.66421 8.41421 10 8 10C7.58579 10 7.25 9.66421 7.25 9.25V8H6C5.58579 8 5.25 7.66421 5.25 7.25C5.25 6.83579 5.58579 6.5 6 6.5H7.25V5.25C7.25 4.83579 7.58579 4.5 8 4.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
