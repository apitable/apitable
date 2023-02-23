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

export const ArrowRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.4392 7.24991L9.14819 3.9591C8.85528 3.66621 8.85527 3.19134 9.14815 2.89844C9.44104 2.60553 9.91591 2.60552 10.2088 2.8984L14.7802 7.46955C15.0731 7.76243 15.0732 8.2373 14.7803 8.53021L10.2088 13.1019C9.91596 13.3948 9.44109 13.3948 9.14819 13.1019C8.85528 12.8091 8.85527 12.3342 9.14815 12.0413L12.4393 8.74991L1.74995 8.75003C1.33573 8.75004 0.999944 8.41425 0.999939 8.00004C0.999935 7.58583 1.33572 7.25004 1.74993 7.25003L12.4392 7.24991Z" fill={ colors[0] }/>

  </>,
  name: 'arrow_right_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.4392 7.24991L9.14819 3.9591C8.85528 3.66621 8.85527 3.19134 9.14815 2.89844C9.44104 2.60553 9.91591 2.60552 10.2088 2.8984L14.7802 7.46955C15.0731 7.76243 15.0732 8.2373 14.7803 8.53021L10.2088 13.1019C9.91596 13.3948 9.44109 13.3948 9.14819 13.1019C8.85528 12.8091 8.85527 12.3342 9.14815 12.0413L12.4393 8.74991L1.74995 8.75003C1.33573 8.75004 0.999944 8.41425 0.999939 8.00004C0.999935 7.58583 1.33572 7.25004 1.74993 7.25003L12.4392 7.24991Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
