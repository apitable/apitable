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

export const ArrowLeftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.49309 7.29296C2.30555 7.48049 2.2002 7.73485 2.2002 8.00006C2.2002 8.26528 2.30555 8.51964 2.49309 8.70717L6.26432 12.4784C6.65485 12.8689 7.28801 12.8689 7.67854 12.4784C8.06906 12.0879 8.06906 11.4547 7.67854 11.0642L5.61441 9.00006H12.8002C13.3525 9.00006 13.8002 8.55235 13.8002 8.00006C13.8002 7.44778 13.3525 7.00006 12.8002 7.00006H5.61441L7.67854 4.93594C8.06906 4.54541 8.06906 3.91225 7.67854 3.52172C7.28801 3.1312 6.65485 3.1312 6.26432 3.52172L2.49309 7.29296Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'arrow_left_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2.49309 7.29296C2.30555 7.48049 2.2002 7.73485 2.2002 8.00006C2.2002 8.26528 2.30555 8.51964 2.49309 8.70717L6.26432 12.4784C6.65485 12.8689 7.28801 12.8689 7.67854 12.4784C8.06906 12.0879 8.06906 11.4547 7.67854 11.0642L5.61441 9.00006H12.8002C13.3525 9.00006 13.8002 8.55235 13.8002 8.00006C13.8002 7.44778 13.3525 7.00006 12.8002 7.00006H5.61441L7.67854 4.93594C8.06906 4.54541 8.06906 3.91225 7.67854 3.52172C7.28801 3.1312 6.65485 3.1312 6.26432 3.52172L2.49309 7.29296Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
