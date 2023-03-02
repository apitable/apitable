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

export const NetworkErrorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.25 13.25C6.29762 13.25 6.34509 13.2494 6.3924 13.2481C6.42811 13.2494 6.46398 13.25 6.5 13.25H12C13.6569 13.25 15 11.9069 15 10.25C15 8.94187 14.1628 7.8293 12.9949 7.41891C12.9983 7.36304 13 7.30672 13 7.25C13 5.73122 11.7688 4.5 10.25 4.5C10.2213 4.5 10.1928 4.50044 10.1644 4.50131C9.20301 3.42649 7.80551 2.75 6.25 2.75C3.35051 2.75 1 5.10051 1 8C1 10.8995 3.35051 13.25 6.25 13.25ZM5.90902 6.90897C6.10428 6.71371 6.42086 6.71371 6.61613 6.90897L7.49997 7.79282L8.38389 6.9089C8.57915 6.71364 8.89573 6.71364 9.091 6.9089C9.28626 7.10416 9.28626 7.42074 9.091 7.616L8.20708 8.49992L9.091 9.38385C9.28626 9.57911 9.28626 9.89569 9.091 10.091C8.89574 10.2862 8.57916 10.2862 8.38389 10.091L7.49997 9.20703L6.61612 10.0909C6.42086 10.2861 6.10428 10.2861 5.90902 10.0909C5.71375 9.89562 5.71375 9.57903 5.90902 9.38377L6.79286 8.49992L5.90902 7.61608C5.71376 7.42082 5.71376 7.10424 5.90902 6.90897Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'network_error_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.25 13.25C6.29762 13.25 6.34509 13.2494 6.3924 13.2481C6.42811 13.2494 6.46398 13.25 6.5 13.25H12C13.6569 13.25 15 11.9069 15 10.25C15 8.94187 14.1628 7.8293 12.9949 7.41891C12.9983 7.36304 13 7.30672 13 7.25C13 5.73122 11.7688 4.5 10.25 4.5C10.2213 4.5 10.1928 4.50044 10.1644 4.50131C9.20301 3.42649 7.80551 2.75 6.25 2.75C3.35051 2.75 1 5.10051 1 8C1 10.8995 3.35051 13.25 6.25 13.25ZM5.90902 6.90897C6.10428 6.71371 6.42086 6.71371 6.61613 6.90897L7.49997 7.79282L8.38389 6.9089C8.57915 6.71364 8.89573 6.71364 9.091 6.9089C9.28626 7.10416 9.28626 7.42074 9.091 7.616L8.20708 8.49992L9.091 9.38385C9.28626 9.57911 9.28626 9.89569 9.091 10.091C8.89574 10.2862 8.57916 10.2862 8.38389 10.091L7.49997 9.20703L6.61612 10.0909C6.42086 10.2861 6.10428 10.2861 5.90902 10.0909C5.71375 9.89562 5.71375 9.57903 5.90902 9.38377L6.79286 8.49992L5.90902 7.61608C5.71376 7.42082 5.71376 7.10424 5.90902 6.90897Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
