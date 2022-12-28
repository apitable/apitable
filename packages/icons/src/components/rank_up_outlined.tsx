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

export const RankUpOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 3C7 2.59554 6.75636 2.2309 6.38268 2.07612C6.00901 1.92134 5.57889 2.00689 5.29289 2.29289L1.79289 5.79289C1.40237 6.18342 1.40237 6.81658 1.79289 7.20711C2.18342 7.59763 2.81658 7.59763 3.20711 7.20711L5 5.41421L5 13C5 13.5523 5.44772 14 6 14C6.55228 14 7 13.5523 7 13L7 3ZM9 13C9 13.5523 9.44772 14 10 14C10.5523 14 11 13.5523 11 13L11 3C11 2.44771 10.5523 2 10 2C9.44772 2 9 2.44771 9 3L9 13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'rank_up_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M7 3C7 2.59554 6.75636 2.2309 6.38268 2.07612C6.00901 1.92134 5.57889 2.00689 5.29289 2.29289L1.79289 5.79289C1.40237 6.18342 1.40237 6.81658 1.79289 7.20711C2.18342 7.59763 2.81658 7.59763 3.20711 7.20711L5 5.41421L5 13C5 13.5523 5.44772 14 6 14C6.55228 14 7 13.5523 7 13L7 3ZM9 13C9 13.5523 9.44772 14 10 14C10.5523 14 11 13.5523 11 13L11 3C11 2.44771 10.5523 2 10 2C9.44772 2 9 2.44771 9 3L9 13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
