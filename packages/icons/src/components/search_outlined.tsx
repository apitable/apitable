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

export const SearchOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.0854 11.3961C7.92978 13.0344 4.84146 12.8696 2.87347 10.9016C0.725587 8.75375 0.725587 5.27134 2.87347 3.12346C5.02135 0.975572 8.50376 0.975572 10.6516 3.12346C12.6196 5.09145 12.7845 8.17981 11.1461 10.3355L13.1265 12.3158C13.4194 12.6087 13.4194 13.0836 13.1265 13.3765C12.8336 13.6694 12.3587 13.6694 12.0658 13.3765L10.0854 11.3961ZM3.93413 9.84097C2.37203 8.27887 2.37203 5.74621 3.93413 4.18412C5.49623 2.62202 8.02889 2.62202 9.59099 4.18412C11.1517 5.74483 11.1531 8.2744 9.59512 9.83683L9.59095 9.84097L9.58682 9.84513C8.02438 11.4031 5.49484 11.4017 3.93413 9.84097Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'search_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.0854 11.3961C7.92978 13.0344 4.84146 12.8696 2.87347 10.9016C0.725587 8.75375 0.725587 5.27134 2.87347 3.12346C5.02135 0.975572 8.50376 0.975572 10.6516 3.12346C12.6196 5.09145 12.7845 8.17981 11.1461 10.3355L13.1265 12.3158C13.4194 12.6087 13.4194 13.0836 13.1265 13.3765C12.8336 13.6694 12.3587 13.6694 12.0658 13.3765L10.0854 11.3961ZM3.93413 9.84097C2.37203 8.27887 2.37203 5.74621 3.93413 4.18412C5.49623 2.62202 8.02889 2.62202 9.59099 4.18412C11.1517 5.74483 11.1531 8.2744 9.59512 9.83683L9.59095 9.84097L9.58682 9.84513C8.02438 11.4031 5.49484 11.4017 3.93413 9.84097Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
