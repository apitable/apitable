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

export const FilterFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.4479 4.67886C14.0399 4.03848 13.5857 3 12.7136 3H3.28974C2.41711 3 1.96312 4.03951 2.55619 4.67964L6.50226 8.93873C6.67355 9.1236 6.76871 9.36634 6.76871 9.61836V12.7481C6.76871 12.9066 6.84379 13.0556 6.97109 13.1499L8.44599 14.2425C8.77597 14.4869 9.24361 14.2514 9.24361 13.8407V9.61775C9.24361 9.36609 9.3385 9.12368 9.50934 8.9389L13.4479 4.67886Z" fill={ colors[0] }/>

  </>,
  name: 'filter_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.4479 4.67886C14.0399 4.03848 13.5857 3 12.7136 3H3.28974C2.41711 3 1.96312 4.03951 2.55619 4.67964L6.50226 8.93873C6.67355 9.1236 6.76871 9.36634 6.76871 9.61836V12.7481C6.76871 12.9066 6.84379 13.0556 6.97109 13.1499L8.44599 14.2425C8.77597 14.4869 9.24361 14.2514 9.24361 13.8407V9.61775C9.24361 9.36609 9.3385 9.12368 9.50934 8.9389L13.4479 4.67886Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
