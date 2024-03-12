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

export const HomeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.31716 2.04982C7.73216 1.77917 8.26784 1.77917 8.68283 2.04982L13.9328 5.47373C14.2867 5.70448 14.5 6.09833 14.5 6.52075V13.4999C14.5 14.1903 13.9404 14.7499 13.25 14.7499H10C9.72386 14.7499 9.5 14.526 9.5 14.2499V11.7499C9.5 11.4738 9.27614 11.2499 9 11.2499H7C6.72386 11.2499 6.5 11.4738 6.5 11.7499V14.2499C6.5 14.526 6.27614 14.7499 6 14.7499H2.75C2.05964 14.7499 1.5 14.1903 1.5 13.4999V6.52074C1.5 6.09833 1.71334 5.70449 2.06717 5.47373L7.31716 2.04982Z" fill={ colors[0] }/>

  </>,
  name: 'home_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.31716 2.04982C7.73216 1.77917 8.26784 1.77917 8.68283 2.04982L13.9328 5.47373C14.2867 5.70448 14.5 6.09833 14.5 6.52075V13.4999C14.5 14.1903 13.9404 14.7499 13.25 14.7499H10C9.72386 14.7499 9.5 14.526 9.5 14.2499V11.7499C9.5 11.4738 9.27614 11.2499 9 11.2499H7C6.72386 11.2499 6.5 11.4738 6.5 11.7499V14.2499C6.5 14.526 6.27614 14.7499 6 14.7499H2.75C2.05964 14.7499 1.5 14.1903 1.5 13.4999V6.52074C1.5 6.09833 1.71334 5.70449 2.06717 5.47373L7.31716 2.04982Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
