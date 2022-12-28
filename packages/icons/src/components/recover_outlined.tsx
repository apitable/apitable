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

export const RecoverOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.46869 5.75002C5.71133 3.5977 8.46348 2.86026 10.6158 4.1029C12.7681 5.34554 13.5056 8.0977 12.2629 10.25C11.0203 12.4023 8.26812 13.1398 6.1158 11.8971C5.66423 11.6364 5.2765 11.3106 4.95623 10.9391C4.59562 10.5208 3.96418 10.474 3.54588 10.8347C3.12757 11.1953 3.0808 11.8267 3.44141 12.245C3.90617 12.7841 4.4673 13.2548 5.1158 13.6292C8.2247 15.4241 12.2 14.3589 13.995 11.25C15.7899 8.14112 14.7247 4.16578 11.6158 2.37085C8.73498 0.707609 5.11019 1.50022 3.16569 4.0991L3.11227 3.68812C3.04109 3.14044 2.5394 2.75416 1.99172 2.82535C1.44404 2.89653 1.05777 3.39821 1.12895 3.94589L1.55331 7.21088C1.60857 7.63602 1.92866 7.97863 2.34907 8.06262C2.76947 8.1466 3.19683 7.95293 3.41119 7.58166L4.46869 5.75002ZM9 6C9 5.44772 8.55228 5 8 5C7.44772 5 7 5.44772 7 6V9C7 9.55228 7.44772 10 8 10H11C11.5523 10 12 9.55228 12 9C12 8.44772 11.5523 8 11 8H9V6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'recover_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4.46869 5.75002C5.71133 3.5977 8.46348 2.86026 10.6158 4.1029C12.7681 5.34554 13.5056 8.0977 12.2629 10.25C11.0203 12.4023 8.26812 13.1398 6.1158 11.8971C5.66423 11.6364 5.2765 11.3106 4.95623 10.9391C4.59562 10.5208 3.96418 10.474 3.54588 10.8347C3.12757 11.1953 3.0808 11.8267 3.44141 12.245C3.90617 12.7841 4.4673 13.2548 5.1158 13.6292C8.2247 15.4241 12.2 14.3589 13.995 11.25C15.7899 8.14112 14.7247 4.16578 11.6158 2.37085C8.73498 0.707609 5.11019 1.50022 3.16569 4.0991L3.11227 3.68812C3.04109 3.14044 2.5394 2.75416 1.99172 2.82535C1.44404 2.89653 1.05777 3.39821 1.12895 3.94589L1.55331 7.21088C1.60857 7.63602 1.92866 7.97863 2.34907 8.06262C2.76947 8.1466 3.19683 7.95293 3.41119 7.58166L4.46869 5.75002ZM9 6C9 5.44772 8.55228 5 8 5C7.44772 5 7 5.44772 7 6V9C7 9.55228 7.44772 10 8 10H11C11.5523 10 12 9.55228 12 9C12 8.44772 11.5523 8 11 8H9V6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
