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

export const MirrorFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.76915C1.5 1.86458 2.43106 1.25951 3.25767 1.62689L6.75767 3.18244C7.20908 3.38307 7.5 3.83072 7.5 4.32471V11.6748C7.5 12.1688 7.20908 12.6165 6.75767 12.8171L3.25767 14.3727C2.43106 14.74 1.5 14.135 1.5 13.2304V2.76915Z" fill={ colors[0] }/>
    <path d="M14.5 2.76915C14.5 1.86458 13.5689 1.25951 12.7423 1.62689L9.24233 3.18244C8.79092 3.38307 8.5 3.83072 8.5 4.32471V11.6748C8.5 12.1688 8.79092 12.6165 9.24233 12.8171L12.7423 14.3727C13.5689 14.74 14.5 14.135 14.5 13.2304V2.76915Z" fill={ colors[0] }/>

  </>,
  name: 'mirror_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.76915C1.5 1.86458 2.43106 1.25951 3.25767 1.62689L6.75767 3.18244C7.20908 3.38307 7.5 3.83072 7.5 4.32471V11.6748C7.5 12.1688 7.20908 12.6165 6.75767 12.8171L3.25767 14.3727C2.43106 14.74 1.5 14.135 1.5 13.2304V2.76915Z', 'M14.5 2.76915C14.5 1.86458 13.5689 1.25951 12.7423 1.62689L9.24233 3.18244C8.79092 3.38307 8.5 3.83072 8.5 4.32471V11.6748C8.5 12.1688 8.79092 12.6165 9.24233 12.8171L12.7423 14.3727C13.5689 14.74 14.5 14.135 14.5 13.2304V2.76915Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
