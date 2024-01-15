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

export const RestoreOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3.51402 1.35566C3.59373 0.949194 3.98786 0.684306 4.39434 0.76402C4.80081 0.843734 5.06569 1.23787 4.98598 1.64434L4.86256 2.27369C5.79888 1.77973 6.86563 1.5 8 1.5C11.7279 1.5 14.75 4.52208 14.75 8.25C14.75 11.9779 11.7279 15 8 15C4.27208 15 1.25 11.9779 1.25 8.25C1.25 7.83579 1.58579 7.5 2 7.5C2.41421 7.5 2.75 7.83579 2.75 8.25C2.75 11.1495 5.1005 13.5 8 13.5C10.8995 13.5 13.25 11.1495 13.25 8.25C13.25 5.35051 10.8995 3 8 3C7.09823 3 6.25241 3.22653 5.51289 3.62681L6.15908 3.76707C6.56387 3.85492 6.82079 4.25429 6.73293 4.65908C6.64508 5.06387 6.24571 5.32079 5.84092 5.23294L3.59805 4.74613C3.19899 4.65952 2.94256 4.26957 3.02115 3.86886L3.51402 1.35566Z" fill={ colors[0] }/>

  </>,
  name: 'restore_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.51402 1.35566C3.59373 0.949194 3.98786 0.684306 4.39434 0.76402C4.80081 0.843734 5.06569 1.23787 4.98598 1.64434L4.86256 2.27369C5.79888 1.77973 6.86563 1.5 8 1.5C11.7279 1.5 14.75 4.52208 14.75 8.25C14.75 11.9779 11.7279 15 8 15C4.27208 15 1.25 11.9779 1.25 8.25C1.25 7.83579 1.58579 7.5 2 7.5C2.41421 7.5 2.75 7.83579 2.75 8.25C2.75 11.1495 5.1005 13.5 8 13.5C10.8995 13.5 13.25 11.1495 13.25 8.25C13.25 5.35051 10.8995 3 8 3C7.09823 3 6.25241 3.22653 5.51289 3.62681L6.15908 3.76707C6.56387 3.85492 6.82079 4.25429 6.73293 4.65908C6.64508 5.06387 6.24571 5.32079 5.84092 5.23294L3.59805 4.74613C3.19899 4.65952 2.94256 4.26957 3.02115 3.86886L3.51402 1.35566Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
