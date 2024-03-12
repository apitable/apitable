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

export const LogoLargeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_4062_1481)">

      <path d="M0 105.05C0 124.288 15.7009 140 35.0252 140H104.975C124.299 140 140 124.288 140 104.95V35.0504C139.899 15.7122 124.198 0 104.975 0H35.0252C15.7009 0 0 15.7122 0 35.0504V105.05Z" fill={ colors[0] }/>

      <path d="M104.7 81.6001H81.6001V104.7H104.7V81.6001Z" fill={ colors[1] }/>

      <path d="M81.5998 58.3998L58.3998 81.5998L35.2998 104.7V81.5998V58.3998V35.2998H58.3998V58.3998L81.5998 35.2998H104.7L81.5998 58.3998Z" fill={ colors[1] }/>

    </g>
    <defs>

      <clipPath id="clip0_4062_1481">

        <rect width="140" height="140" fill={ colors[1] }/>

      </clipPath>

    </defs>

  </>,
  name: 'logo_large_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M0 105.05C0 124.288 15.7009 140 35.0252 140H104.975C124.299 140 140 124.288 140 104.95V35.0504C139.899 15.7122 124.198 0 104.975 0H35.0252C15.7009 0 0 15.7122 0 35.0504V105.05Z', 'M104.7 81.6001H81.6001V104.7H104.7V81.6001Z', 'M81.5998 58.3998L58.3998 81.5998L35.2998 104.7V81.5998V58.3998V35.2998H58.3998V58.3998L81.5998 35.2998H104.7L81.5998 58.3998Z'],
  width: '140',
  height: '140',
  viewBox: '0 0 140 140',
});
