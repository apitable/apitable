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

export const LikeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.47386 1.42544C6.59868 1.1654 6.86156 0.999985 7.15 0.999985C8.55831 0.999985 9.7 2.14165 9.7 3.54998V5.19998H12.5463C13.1166 5.1949 13.6607 5.43984 14.0351 5.87037C14.4105 6.30209 14.5774 6.87685 14.4915 7.44253L14.4913 7.44366L13.6635 12.8425C13.5178 13.8021 12.6884 14.5086 11.7182 14.5L2.75 14.5C2.05964 14.5 1.5 13.9404 1.5 13.25V7.25002C1.5 6.55966 2.05964 6.00002 2.75 6.00002H4.27806L6.47386 1.42544ZM4 7.50002H3V13H4V7.50002Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'like_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.47386 1.42544C6.59868 1.1654 6.86156 0.999985 7.15 0.999985C8.55831 0.999985 9.7 2.14165 9.7 3.54998V5.19998H12.5463C13.1166 5.1949 13.6607 5.43984 14.0351 5.87037C14.4105 6.30209 14.5774 6.87685 14.4915 7.44253L14.4913 7.44366L13.6635 12.8425C13.5178 13.8021 12.6884 14.5086 11.7182 14.5L2.75 14.5C2.05964 14.5 1.5 13.9404 1.5 13.25V7.25002C1.5 6.55966 2.05964 6.00002 2.75 6.00002H4.27806L6.47386 1.42544ZM4 7.50002H3V13H4V7.50002Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
