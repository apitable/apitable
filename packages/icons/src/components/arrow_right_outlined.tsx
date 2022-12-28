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
    <path d="M13.5069 7.29296C13.6944 7.48049 13.7998 7.73485 13.7998 8.00006C13.7998 8.26528 13.6944 8.51964 13.5069 8.70717L9.73567 12.4784C9.34515 12.8689 8.71198 12.8689 8.32146 12.4784C7.93093 12.0879 7.93093 11.4547 8.32146 11.0642L10.3856 9.00006H3.1998C2.64751 9.00006 2.1998 8.55235 2.1998 8.00006C2.1998 7.44778 2.64751 7.00006 3.1998 7.00006H10.3856L8.32146 4.93594C7.93093 4.54541 7.93093 3.91225 8.32146 3.52172C8.71198 3.1312 9.34515 3.1312 9.73567 3.52172L13.5069 7.29296Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'arrow_right_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.5069 7.29296C13.6944 7.48049 13.7998 7.73485 13.7998 8.00006C13.7998 8.26528 13.6944 8.51964 13.5069 8.70717L9.73567 12.4784C9.34515 12.8689 8.71198 12.8689 8.32146 12.4784C7.93093 12.0879 7.93093 11.4547 8.32146 11.0642L10.3856 9.00006H3.1998C2.64751 9.00006 2.1998 8.55235 2.1998 8.00006C2.1998 7.44778 2.64751 7.00006 3.1998 7.00006H10.3856L8.32146 4.93594C7.93093 4.54541 7.93093 3.91225 8.32146 3.52172C8.71198 3.1312 9.34515 3.1312 9.73567 3.52172L13.5069 7.29296Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
