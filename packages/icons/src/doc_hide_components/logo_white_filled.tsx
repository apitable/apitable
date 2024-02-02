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

export const LogoWhiteFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <g clipPath="url(#clip0_4062_1532)">

      <path d="M0 104.988C0 124.334 15.6657 140 35.0118 140H104.988C124.334 140 140 124.334 140 104.988V35.0118C140 15.6657 124.334 0 104.988 0H35.0118C15.6657 0 0 15.6657 0 35.0118V104.988ZM93.2861 104.941C86.8688 104.941 81.6312 99.7034 81.6312 93.2862C81.6312 86.8689 86.8688 81.6313 93.2861 81.6313C99.7034 81.6313 104.941 86.8689 104.941 93.2862C104.941 99.7034 99.7034 104.941 93.2861 104.941ZM58.3686 81.6313L81.6311 58.3687L104.941 35.059H81.6311L58.3686 58.3687V35.059H35.0588V58.3687V81.6313V104.941L58.3686 81.6313Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

    </g>
    <defs>

      <clipPath id="clip0_4062_1532">

        <rect width="140" height="140" fill={ colors[1] }/>

      </clipPath>

    </defs>

  </>,
  name: 'logo_white_filled',
  defaultColors: ['#D9D9D9', 'white'],
  colorful: true,
  allPathData: ['M0 104.988C0 124.334 15.6657 140 35.0118 140H104.988C124.334 140 140 124.334 140 104.988V35.0118C140 15.6657 124.334 0 104.988 0H35.0118C15.6657 0 0 15.6657 0 35.0118V104.988ZM93.2861 104.941C86.8688 104.941 81.6312 99.7034 81.6312 93.2862C81.6312 86.8689 86.8688 81.6313 93.2861 81.6313C99.7034 81.6313 104.941 86.8689 104.941 93.2862C104.941 99.7034 99.7034 104.941 93.2861 104.941ZM58.3686 81.6313L81.6311 58.3687L104.941 35.059H81.6311L58.3686 58.3687V35.059H35.0588V58.3687V81.6313V104.941L58.3686 81.6313Z'],
  width: '140',
  height: '140',
  viewBox: '0 0 140 140',
});
