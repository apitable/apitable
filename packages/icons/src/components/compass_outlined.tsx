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

export const CompassOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M9.62462 4.74039C10.6018 4.41466 11.5315 5.34433 11.2058 6.32153L10.1868 9.37831C10.0624 9.75157 9.76952 10.0445 9.39626 10.1689L6.33948 11.1878C5.36228 11.5135 4.43261 10.5839 4.75834 9.60668L5.77727 6.54989C5.90169 6.17663 6.19458 5.88374 6.56784 5.75932L9.62462 4.74039ZM9.62462 6.32153L7.16076 7.14282L6.33948 9.60668L8.80334 8.78539L9.62462 6.32153Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'compass_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8Z', 'M9.62462 4.74039C10.6018 4.41466 11.5315 5.34433 11.2058 6.32153L10.1868 9.37831C10.0624 9.75157 9.76952 10.0445 9.39626 10.1689L6.33948 11.1878C5.36228 11.5135 4.43261 10.5839 4.75834 9.60668L5.77727 6.54989C5.90169 6.17663 6.19458 5.88374 6.56784 5.75932L9.62462 4.74039ZM9.62462 6.32153L7.16076 7.14282L6.33948 9.60668L8.80334 8.78539L9.62462 6.32153Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
