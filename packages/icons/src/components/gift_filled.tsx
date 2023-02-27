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

export const GiftFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.65354 2.28627C6.16143 1.88562 6.91032 2.06532 7.18108 2.65282L8 4.42966L8.81892 2.65282C9.08968 2.06532 9.83857 1.88562 10.3465 2.28627L11.8978 3.5101C12.4725 3.96344 12.3814 4.86032 11.7273 5.18884L10.6099 5.75H13.625C13.9702 5.75 14.25 6.02982 14.25 6.375C14.25 6.72018 13.9702 7 13.625 7H2.375C2.02982 7 1.75 6.72018 1.75 6.375C1.75 6.02982 2.02982 5.75 2.375 5.75H5.39006L4.27272 5.18884C3.61861 4.86032 3.5275 3.96344 4.10218 3.5101L5.65354 2.28627ZM6.0844 3.85694L5.64816 4.20107L6.42216 4.5898L6.0844 3.85694ZM10.3518 4.20107L9.9156 3.85694L9.57784 4.5898L10.3518 4.20107Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M2.75 8H7.5L7.5 14.5H4C3.30964 14.5 2.75 13.9404 2.75 13.25V8Z" fill={ colors[0] }/>
    <path d="M12 14.5H8.5L8.5 8H13.25V13.25C13.25 13.9404 12.6904 14.5 12 14.5Z" fill={ colors[0] }/>

  </>,
  name: 'gift_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.65354 2.28627C6.16143 1.88562 6.91032 2.06532 7.18108 2.65282L8 4.42966L8.81892 2.65282C9.08968 2.06532 9.83857 1.88562 10.3465 2.28627L11.8978 3.5101C12.4725 3.96344 12.3814 4.86032 11.7273 5.18884L10.6099 5.75H13.625C13.9702 5.75 14.25 6.02982 14.25 6.375C14.25 6.72018 13.9702 7 13.625 7H2.375C2.02982 7 1.75 6.72018 1.75 6.375C1.75 6.02982 2.02982 5.75 2.375 5.75H5.39006L4.27272 5.18884C3.61861 4.86032 3.5275 3.96344 4.10218 3.5101L5.65354 2.28627ZM6.0844 3.85694L5.64816 4.20107L6.42216 4.5898L6.0844 3.85694ZM10.3518 4.20107L9.9156 3.85694L9.57784 4.5898L10.3518 4.20107Z', 'M2.75 8H7.5L7.5 14.5H4C3.30964 14.5 2.75 13.9404 2.75 13.25V8Z', 'M12 14.5H8.5L8.5 8H13.25V13.25C13.25 13.9404 12.6904 14.5 12 14.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
