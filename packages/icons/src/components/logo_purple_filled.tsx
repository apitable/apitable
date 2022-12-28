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

export const LogoPurpleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M0 104.988C0 124.334 15.6657 140 35.0118 140H104.988C124.334 140 140 124.334 140 104.988V35.0118C140 15.6657 124.334 0 104.988 0H35.0118C15.6657 0 0 15.6657 0 35.0118V104.988Z" fill={ colors[0] }/>
    <path d="M93.2861 104.941C86.8688 104.941 81.6312 99.7034 81.6312 93.2862C81.6312 86.8689 86.8688 81.6313 93.2861 81.6313C99.7034 81.6313 104.941 86.8689 104.941 93.2862C104.941 99.7034 99.7034 104.941 93.2861 104.941Z" fill={ colors[1] }/>
    <path d="M81.6311 58.3687L58.3686 81.6313L35.0588 104.941V81.6313V58.3687V35.059H58.3686V58.3687L81.6311 35.059H104.941L81.6311 58.3687Z" fill={ colors[1] }/>

  </>,
  name: 'logo_purple_filled',
  defaultColors: ['#7B67EE', 'white'],
  colorful: true,
  allPathData: ['M0 104.988C0 124.334 15.6657 140 35.0118 140H104.988C124.334 140 140 124.334 140 104.988V35.0118C140 15.6657 124.334 0 104.988 0H35.0118C15.6657 0 0 15.6657 0 35.0118V104.988Z', 'M93.2861 104.941C86.8688 104.941 81.6312 99.7034 81.6312 93.2862C81.6312 86.8689 86.8688 81.6313 93.2861 81.6313C99.7034 81.6313 104.941 86.8689 104.941 93.2862C104.941 99.7034 99.7034 104.941 93.2861 104.941Z', 'M81.6311 58.3687L58.3686 81.6313L35.0588 104.941V81.6313V58.3687V35.059H58.3686V58.3687L81.6311 35.059H104.941L81.6311 58.3687Z'],
  width: '140',
  height: '140',
  viewBox: '0 0 140 140',
});
