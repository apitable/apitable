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

export const SpeechOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 0.5C5.65279 0.5 3.75 2.40279 3.75 4.75V7C3.75 9.34721 5.65279 11.25 8 11.25C10.3472 11.25 12.25 9.34721 12.25 7V4.75C12.25 2.40279 10.3472 0.5 8 0.5ZM5.25 4.75C5.25 3.23122 6.48122 2 8 2C9.51878 2 10.75 3.23122 10.75 4.75V7C10.75 8.51878 9.51878 9.75 8 9.75C6.48122 9.75 5.25 8.51878 5.25 7V4.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M3.04856 8.50007C2.91053 8.10953 2.48203 7.90484 2.0915 8.04287C1.70096 8.18091 1.49627 8.6094 1.6343 8.99993C2.48071 11.3946 4.64054 13.1704 7.25002 13.4588V14.75C7.25002 15.1642 7.58581 15.5 8.00002 15.5C8.41423 15.5 8.75002 15.1642 8.75002 14.75V13.4588C11.3595 13.1704 13.5193 11.3946 14.3657 8.99993C14.5038 8.6094 14.2991 8.18091 13.9085 8.04287C13.518 7.90484 13.0895 8.10953 12.9515 8.50007C12.2304 10.5402 10.2847 12 8.00002 12C5.71531 12 3.76963 10.5402 3.04856 8.50007Z" fill={ colors[0] }/>

  </>,
  name: 'speech_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 0.5C5.65279 0.5 3.75 2.40279 3.75 4.75V7C3.75 9.34721 5.65279 11.25 8 11.25C10.3472 11.25 12.25 9.34721 12.25 7V4.75C12.25 2.40279 10.3472 0.5 8 0.5ZM5.25 4.75C5.25 3.23122 6.48122 2 8 2C9.51878 2 10.75 3.23122 10.75 4.75V7C10.75 8.51878 9.51878 9.75 8 9.75C6.48122 9.75 5.25 8.51878 5.25 7V4.75Z', 'M3.04856 8.50007C2.91053 8.10953 2.48203 7.90484 2.0915 8.04287C1.70096 8.18091 1.49627 8.6094 1.6343 8.99993C2.48071 11.3946 4.64054 13.1704 7.25002 13.4588V14.75C7.25002 15.1642 7.58581 15.5 8.00002 15.5C8.41423 15.5 8.75002 15.1642 8.75002 14.75V13.4588C11.3595 13.1704 13.5193 11.3946 14.3657 8.99993C14.5038 8.6094 14.2991 8.18091 13.9085 8.04287C13.518 7.90484 13.0895 8.10953 12.9515 8.50007C12.2304 10.5402 10.2847 12 8.00002 12C5.71531 12 3.76963 10.5402 3.04856 8.50007Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
