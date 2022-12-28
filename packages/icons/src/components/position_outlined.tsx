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

export const PositionOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 0.25C8.41421 0.25 8.75 0.585786 8.75 1V1.79454C11.6023 2.13565 13.8644 4.39773 14.2055 7.25H15C15.4142 7.25 15.75 7.58579 15.75 8C15.75 8.41421 15.4142 8.75 15 8.75H14.2055C13.8644 11.6023 11.6023 13.8644 8.75 14.2055V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V14.2055C4.39773 13.8644 2.13565 11.6023 1.79454 8.75H1C0.585786 8.75 0.25 8.41421 0.25 8C0.25 7.58579 0.585786 7.25 1 7.25H1.79454C2.13565 4.39773 4.39773 2.13565 7.25 1.79454V1C7.25 0.585786 7.58579 0.25 8 0.25ZM12.75 8C12.75 5.37665 10.6234 3.25 8 3.25C5.37665 3.25 3.25 5.37665 3.25 8C3.25 10.6234 5.37665 12.75 8 12.75C10.6234 12.75 12.75 10.6234 12.75 8ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'position_outlined',
  defaultColors: ['black'],
  colorful: false,
  allPathData: ['M8 0.25C8.41421 0.25 8.75 0.585786 8.75 1V1.79454C11.6023 2.13565 13.8644 4.39773 14.2055 7.25H15C15.4142 7.25 15.75 7.58579 15.75 8C15.75 8.41421 15.4142 8.75 15 8.75H14.2055C13.8644 11.6023 11.6023 13.8644 8.75 14.2055V15C8.75 15.4142 8.41421 15.75 8 15.75C7.58579 15.75 7.25 15.4142 7.25 15V14.2055C4.39773 13.8644 2.13565 11.6023 1.79454 8.75H1C0.585786 8.75 0.25 8.41421 0.25 8C0.25 7.58579 0.585786 7.25 1 7.25H1.79454C2.13565 4.39773 4.39773 2.13565 7.25 1.79454V1C7.25 0.585786 7.58579 0.25 8 0.25ZM12.75 8C12.75 5.37665 10.6234 3.25 8 3.25C5.37665 3.25 3.25 5.37665 3.25 8C3.25 10.6234 5.37665 12.75 8 12.75C10.6234 12.75 12.75 10.6234 12.75 8ZM8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
