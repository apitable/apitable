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

export const CheckCircleOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.40533 7.09466C5.11244 6.80176 4.63757 6.80176 4.34467 7.09465C4.05178 7.38755 4.05178 7.86242 4.34467 8.15531L6.84465 10.6553C6.98968 10.8003 7.18778 10.8797 7.39282 10.8748C7.59787 10.8699 7.79197 10.7813 7.92994 10.6295L11.68 6.5045C11.9586 6.19801 11.936 5.72367 11.6295 5.44504C11.323 5.16641 10.8487 5.18899 10.5701 5.49549L7.34913 9.03847L5.40533 7.09466Z" fill={ colors[0] }/>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'check_circle_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.40533 7.09466C5.11244 6.80176 4.63757 6.80176 4.34467 7.09465C4.05178 7.38755 4.05178 7.86242 4.34467 8.15531L6.84465 10.6553C6.98968 10.8003 7.18778 10.8797 7.39282 10.8748C7.59787 10.8699 7.79197 10.7813 7.92994 10.6295L11.68 6.5045C11.9586 6.19801 11.936 5.72367 11.6295 5.44504C11.323 5.16641 10.8487 5.18899 10.5701 5.49549L7.34913 9.03847L5.40533 7.09466Z', 'M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
