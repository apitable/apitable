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

export const CompassFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.16077 7.14282L9.62463 6.32153L8.80334 8.78539L6.33948 9.60668L7.16077 7.14282Z" fill={ colors[0] }/>
    <path d="M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM11.2058 6.32153C11.5315 5.34434 10.6018 4.41466 9.62463 4.74039L6.56784 5.75932C6.19459 5.88374 5.90169 6.17664 5.77727 6.54989L4.75835 9.60668C4.43261 10.5839 5.36229 11.5136 6.33948 11.1878L9.39627 10.1689C9.76953 10.0445 10.0624 9.75158 10.1868 9.37832L11.2058 6.32153Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'compass_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.16077 7.14282L9.62463 6.32153L8.80334 8.78539L6.33948 9.60668L7.16077 7.14282Z', 'M1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8ZM11.2058 6.32153C11.5315 5.34434 10.6018 4.41466 9.62463 4.74039L6.56784 5.75932C6.19459 5.88374 5.90169 6.17664 5.77727 6.54989L4.75835 9.60668C4.43261 10.5839 5.36229 11.5136 6.33948 11.1878L9.39627 10.1689C9.76953 10.0445 10.0624 9.75158 10.1868 9.37832L11.2058 6.32153Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
