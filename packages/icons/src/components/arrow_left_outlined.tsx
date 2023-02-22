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
    <path d="M3.56078 7.24994L6.8518 3.95913C7.1447 3.66624 7.14471 3.19137 6.85183 2.89847C6.55894 2.60556 6.08407 2.60555 5.79117 2.89843L1.21975 7.46958C0.926845 7.76246 0.92683 8.23733 1.21971 8.53024L5.79114 13.1019C6.08402 13.3948 6.55889 13.3949 6.8518 13.102C7.1447 12.8091 7.14471 12.3342 6.85183 12.0413L3.56066 8.74994L14.25 8.75006C14.6642 8.75007 15 8.41428 15 8.00007C15 7.58586 14.6643 7.25007 14.2501 7.25006L3.56078 7.24994Z" fill={ colors[0] }/>

  </>,
  name: 'arrow_left_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M3.56078 7.24994L6.8518 3.95913C7.1447 3.66624 7.14471 3.19137 6.85183 2.89847C6.55894 2.60556 6.08407 2.60555 5.79117 2.89843L1.21975 7.46958C0.926845 7.76246 0.92683 8.23733 1.21971 8.53024L5.79114 13.1019C6.08402 13.3948 6.55889 13.3949 6.8518 13.102C7.1447 12.8091 7.14471 12.3342 6.85183 12.0413L3.56066 8.74994L14.25 8.75006C14.6642 8.75007 15 8.41428 15 8.00007C15 7.58586 14.6643 7.25007 14.2501 7.25006L3.56078 7.24994Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
