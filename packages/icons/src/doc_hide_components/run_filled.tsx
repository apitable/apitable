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

export const RunFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <rect x="9" y="8" width="2" height="8" rx="1" fill={ colors[1] }/>
    <rect x="13" y="8" width="2" height="8" rx="1" fill={ colors[1] }/>

  </>,
  name: 'run_filled',
  defaultColors: ['#30C28B', 'white'],
  colorful: true,
  allPathData: ['M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
