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
    <path d="M11 14.25C11 14.6642 11.3358 15 11.75 15C12.1642 15 12.5 14.6642 12.5 14.25L12.5 1.75C12.5 1.33579 12.1642 1 11.75 1C11.3358 1 11 1.33579 11 1.75L11 14.25Z" fill={ colors[0] }/>
    <path d="M6.25 14.25C6.25 14.6642 6.58579 15 7 15C7.41421 15 7.75 14.6642 7.75 14.25L7.75 1.75003C7.75 1.44668 7.56727 1.17321 7.28701 1.05712C7.00676 0.941035 6.68417 1.0052 6.46967 1.2197L2.84467 4.8447C2.55178 5.13759 2.55178 5.61247 2.84467 5.90536C3.13756 6.19825 3.61244 6.19825 3.90533 5.90536L6.25 3.56069L6.25 14.25Z" fill={ colors[0] }/>

  </>,
  name: 'rank_up_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11 14.25C11 14.6642 11.3358 15 11.75 15C12.1642 15 12.5 14.6642 12.5 14.25L12.5 1.75C12.5 1.33579 12.1642 1 11.75 1C11.3358 1 11 1.33579 11 1.75L11 14.25Z', 'M6.25 14.25C6.25 14.6642 6.58579 15 7 15C7.41421 15 7.75 14.6642 7.75 14.25L7.75 1.75003C7.75 1.44668 7.56727 1.17321 7.28701 1.05712C7.00676 0.941035 6.68417 1.0052 6.46967 1.2197L2.84467 4.8447C2.55178 5.13759 2.55178 5.61247 2.84467 5.90536C3.13756 6.19825 3.61244 6.19825 3.90533 5.90536L6.25 3.56069L6.25 14.25Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
