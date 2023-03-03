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

export const ArrowDownFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.75009 12.4393L12.0409 9.14825C12.3338 8.85535 12.8087 8.85533 13.1016 9.14822C13.3945 9.4411 13.3945 9.91597 13.1016 10.2089L8.53045 14.7803C8.23757 15.0732 7.76269 15.0732 7.46979 14.7803L2.89809 10.2089C2.60519 9.91602 2.60518 9.44115 2.89806 9.14825C3.19094 8.85534 3.66582 8.85533 3.95872 9.14821L7.25009 12.4394L7.24997 1.75001C7.24996 1.3358 7.58575 1 7.99996 1C8.41417 0.999996 8.74996 1.33578 8.74997 1.74999L8.75009 12.4393Z" fill={ colors[0] }/>

  </>,
  name: 'arrow_down_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.75009 12.4393L12.0409 9.14825C12.3338 8.85535 12.8087 8.85533 13.1016 9.14822C13.3945 9.4411 13.3945 9.91597 13.1016 10.2089L8.53045 14.7803C8.23757 15.0732 7.76269 15.0732 7.46979 14.7803L2.89809 10.2089C2.60519 9.91602 2.60518 9.44115 2.89806 9.14825C3.19094 8.85534 3.66582 8.85533 3.95872 9.14821L7.25009 12.4394L7.24997 1.75001C7.24996 1.3358 7.58575 1 7.99996 1C8.41417 0.999996 8.74996 1.33578 8.74997 1.74999L8.75009 12.4393Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
