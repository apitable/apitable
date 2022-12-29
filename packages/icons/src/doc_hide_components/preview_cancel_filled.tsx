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

export const PreviewCancelFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M16 30C23.732 30 30 23.732 30 16C30 8.26803 23.732 2.00002 16 2.00002C8.26801 2.00002 2 8.26803 2 16C2 23.732 8.26801 30 16 30Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M9.96599 22.0339C10.3825 22.4505 11.0579 22.4505 11.4745 22.0339L16 17.5084L20.5255 22.034L20.6732 22.1574C21.0889 22.4454 21.6637 22.4042 22.034 22.034C22.4505 21.6174 22.4505 20.942 22.034 20.5255L17.5085 15.9999L22.0339 11.4745L22.1574 11.3267C22.4454 10.911 22.4042 10.3362 22.0339 9.96596C21.6174 9.5494 20.942 9.5494 20.5254 9.96596L16 14.4914L11.4745 9.966L11.3268 9.84257C10.9111 9.55458 10.3363 9.59572 9.96603 9.966C9.54947 10.3826 9.54947 11.0579 9.96603 11.4745L14.4915 15.9999L9.96599 20.5254L9.84256 20.6732C9.55457 21.0889 9.59571 21.6636 9.96599 22.0339Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'preview_cancel_filled',
  defaultColors: ['#3C3C3C', 'white'],
  colorful: true,
  allPathData: ['M16 30C23.732 30 30 23.732 30 16C30 8.26803 23.732 2.00002 16 2.00002C8.26801 2.00002 2 8.26803 2 16C2 23.732 8.26801 30 16 30Z', 'M9.96599 22.0339C10.3825 22.4505 11.0579 22.4505 11.4745 22.0339L16 17.5084L20.5255 22.034L20.6732 22.1574C21.0889 22.4454 21.6637 22.4042 22.034 22.034C22.4505 21.6174 22.4505 20.942 22.034 20.5255L17.5085 15.9999L22.0339 11.4745L22.1574 11.3267C22.4454 10.911 22.4042 10.3362 22.0339 9.96596C21.6174 9.5494 20.942 9.5494 20.5254 9.96596L16 14.4914L11.4745 9.966L11.3268 9.84257C10.9111 9.55458 10.3363 9.59572 9.96603 9.966C9.54947 10.3826 9.54947 11.0579 9.96603 11.4745L14.4915 15.9999L9.96599 20.5254L9.84256 20.6732C9.55457 21.0889 9.59571 21.6636 9.96599 22.0339Z'],
  width: '32',
  height: '32',
  viewBox: '0 0 32 32',
});
