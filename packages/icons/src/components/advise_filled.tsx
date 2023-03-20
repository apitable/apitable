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

export const AdviseFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7 3.5C6.58579 3.5 6.25 3.83579 6.25 4.25C6.25 4.66421 6.58579 5 7 5H9C9.41421 5 9.75 4.66421 9.75 4.25C9.75 3.83579 9.41421 3.5 9 3.5H7Z" fill={ colors[0] }/>
    <path d="M3.75 2.25C3.75 1.55964 4.30964 1 5 1H11C11.6904 1 12.25 1.55964 12.25 2.25V6.84554L12.281 6.83299C13.1028 6.50037 14 7.10515 14 7.99167V13.7499C14 14.4402 13.4404 14.9999 12.75 14.9999H3.25C2.55964 14.9999 2 14.4402 2 13.7499V7.99167C2 7.10515 2.89723 6.50037 3.71899 6.83299L3.75 6.84554V2.25ZM10.75 2.5V7.45268L8.46899 8.37595C8.16818 8.4977 7.83182 8.4977 7.53101 8.37595L5.25 7.45268V2.5H10.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'advise_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7 3.5C6.58579 3.5 6.25 3.83579 6.25 4.25C6.25 4.66421 6.58579 5 7 5H9C9.41421 5 9.75 4.66421 9.75 4.25C9.75 3.83579 9.41421 3.5 9 3.5H7Z', 'M3.75 2.25C3.75 1.55964 4.30964 1 5 1H11C11.6904 1 12.25 1.55964 12.25 2.25V6.84554L12.281 6.83299C13.1028 6.50037 14 7.10515 14 7.99167V13.7499C14 14.4402 13.4404 14.9999 12.75 14.9999H3.25C2.55964 14.9999 2 14.4402 2 13.7499V7.99167C2 7.10515 2.89723 6.50037 3.71899 6.83299L3.75 6.84554V2.25ZM10.75 2.5V7.45268L8.46899 8.37595C8.16818 8.4977 7.83182 8.4977 7.53101 8.37595L5.25 7.45268V2.5H10.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
