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

export const DislikeFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.53975 14.0746C9.41494 14.3346 9.15205 14.5001 8.86361 14.5001C7.4553 14.5001 6.31361 13.3584 6.31361 11.9501V10.3001H3.46736C2.89701 10.3052 2.35289 10.0602 1.97854 9.62968C1.60315 9.19796 1.43625 8.62319 1.5221 8.05752L1.52228 8.05639L2.35009 2.6576C2.49584 1.69797 3.32517 0.991402 4.29538 1.00006L13.2636 1.00003C13.954 1.00003 14.5136 1.55968 14.5136 2.25003V8.25003C14.5136 8.94039 13.954 9.50003 13.2636 9.50003H11.7356L9.53975 14.0746ZM12.0136 8.00003H13.0136V2.50003H12.0136V8.00003Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'dislike_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.53975 14.0746C9.41494 14.3346 9.15205 14.5001 8.86361 14.5001C7.4553 14.5001 6.31361 13.3584 6.31361 11.9501V10.3001H3.46736C2.89701 10.3052 2.35289 10.0602 1.97854 9.62968C1.60315 9.19796 1.43625 8.62319 1.5221 8.05752L1.52228 8.05639L2.35009 2.6576C2.49584 1.69797 3.32517 0.991402 4.29538 1.00006L13.2636 1.00003C13.954 1.00003 14.5136 1.55968 14.5136 2.25003V8.25003C14.5136 8.94039 13.954 9.50003 13.2636 9.50003H11.7356L9.53975 14.0746ZM12.0136 8.00003H13.0136V2.50003H12.0136V8.00003Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
