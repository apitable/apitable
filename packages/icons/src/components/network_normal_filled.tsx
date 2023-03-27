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

export const NetworkNormalFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.3924 13.2481C6.34509 13.2494 6.29762 13.25 6.25 13.25C3.35051 13.25 1 10.8995 1 8C1 5.10051 3.35051 2.75 6.25 2.75C7.80551 2.75 9.20301 3.42649 10.1644 4.50131C10.1928 4.50044 10.2213 4.5 10.25 4.5C11.7688 4.5 13 5.73122 13 7.25C13 7.30672 12.9983 7.36304 12.9949 7.41891C14.1628 7.8293 15 8.94187 15 10.25C15 11.9069 13.6569 13.25 12 13.25H6.5C6.46398 13.25 6.42811 13.2494 6.3924 13.2481ZM6.10355 8.14645C5.90829 7.95118 5.59171 7.95118 5.39645 8.14645C5.20118 8.34171 5.20118 8.65829 5.39645 8.85355L6.81066 10.2678C7.20118 10.6583 7.83435 10.6583 8.22487 10.2678L10.3462 8.14645C10.5415 7.95118 10.5415 7.6346 10.3462 7.43934C10.1509 7.24408 9.83435 7.24408 9.63909 7.43934L7.51777 9.56066L6.10355 8.14645Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'network_normal_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.3924 13.2481C6.34509 13.2494 6.29762 13.25 6.25 13.25C3.35051 13.25 1 10.8995 1 8C1 5.10051 3.35051 2.75 6.25 2.75C7.80551 2.75 9.20301 3.42649 10.1644 4.50131C10.1928 4.50044 10.2213 4.5 10.25 4.5C11.7688 4.5 13 5.73122 13 7.25C13 7.30672 12.9983 7.36304 12.9949 7.41891C14.1628 7.8293 15 8.94187 15 10.25C15 11.9069 13.6569 13.25 12 13.25H6.5C6.46398 13.25 6.42811 13.2494 6.3924 13.2481ZM6.10355 8.14645C5.90829 7.95118 5.59171 7.95118 5.39645 8.14645C5.20118 8.34171 5.20118 8.65829 5.39645 8.85355L6.81066 10.2678C7.20118 10.6583 7.83435 10.6583 8.22487 10.2678L10.3462 8.14645C10.5415 7.95118 10.5415 7.6346 10.3462 7.43934C10.1509 7.24408 9.83435 7.24408 9.63909 7.43934L7.51777 9.56066L6.10355 8.14645Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
