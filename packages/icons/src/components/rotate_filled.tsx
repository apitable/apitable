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

export const RotateFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.29815 0.71967C9.00526 0.426777 8.53039 0.426777 8.23749 0.71967C7.9446 1.01256 7.9446 1.48744 8.23749 1.78033L8.7073 2.25014C7.86823 2.25565 7.03802 2.42358 6.26256 2.74478C5.47394 3.07144 4.75739 3.55023 4.15381 4.15381C3.55022 4.75739 3.07144 5.47394 2.74478 6.26256C2.41813 7.05117 2.25 7.89641 2.25 8.75C2.25 9.16422 2.58579 9.5 3 9.5C3.41421 9.5 3.75 9.16422 3.75 8.75C3.75 8.09339 3.87933 7.44321 4.1306 6.83658C4.38188 6.22996 4.75017 5.67876 5.21447 5.21447C5.67876 4.75017 6.22995 4.38188 6.83658 4.1306C7.44096 3.88026 8.08857 3.75096 8.74269 3.75001L8.23749 4.2552C7.9446 4.5481 7.9446 5.02297 8.23749 5.31586C8.53039 5.60876 9.00526 5.60876 9.29815 5.31586L10.7124 3.90165C11.2005 3.4135 11.2005 2.62204 10.7124 2.13388L9.29815 0.71967Z" fill={ colors[0] }/>
    <path d="M7.25 6C6.55964 6 6 6.55964 6 7.25V13.25C6 13.9404 6.55964 14.5 7.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.25C14.5 6.55964 13.9404 6 13.25 6H7.25Z" fill={ colors[0] }/>

  </>,
  name: 'rotate_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.29815 0.71967C9.00526 0.426777 8.53039 0.426777 8.23749 0.71967C7.9446 1.01256 7.9446 1.48744 8.23749 1.78033L8.7073 2.25014C7.86823 2.25565 7.03802 2.42358 6.26256 2.74478C5.47394 3.07144 4.75739 3.55023 4.15381 4.15381C3.55022 4.75739 3.07144 5.47394 2.74478 6.26256C2.41813 7.05117 2.25 7.89641 2.25 8.75C2.25 9.16422 2.58579 9.5 3 9.5C3.41421 9.5 3.75 9.16422 3.75 8.75C3.75 8.09339 3.87933 7.44321 4.1306 6.83658C4.38188 6.22996 4.75017 5.67876 5.21447 5.21447C5.67876 4.75017 6.22995 4.38188 6.83658 4.1306C7.44096 3.88026 8.08857 3.75096 8.74269 3.75001L8.23749 4.2552C7.9446 4.5481 7.9446 5.02297 8.23749 5.31586C8.53039 5.60876 9.00526 5.60876 9.29815 5.31586L10.7124 3.90165C11.2005 3.4135 11.2005 2.62204 10.7124 2.13388L9.29815 0.71967Z', 'M7.25 6C6.55964 6 6 6.55964 6 7.25V13.25C6 13.9404 6.55964 14.5 7.25 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V7.25C14.5 6.55964 13.9404 6 13.25 6H7.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
