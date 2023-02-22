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

export const BoldOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.198 14.5C3.95733 14.5 3.75467 14.4177 3.59 14.253C3.42533 14.0883 3.343 13.8857 3.343 13.645V2.112C3.343 1.87133 3.42533 1.66867 3.59 1.504C3.75467 1.32667 3.95733 1.238 4.198 1.238H8.682C10.0373 1.238 11.0823 1.54833 11.817 2.169C12.5643 2.78967 12.938 3.62567 12.938 4.677C12.938 5.41167 12.7607 6.026 12.406 6.52C12.064 7.00133 11.6207 7.36233 11.076 7.603C11.836 7.84367 12.4567 8.23 12.938 8.762C13.432 9.294 13.679 9.96533 13.679 10.776C13.679 11.9413 13.2863 12.8533 12.501 13.512C11.7157 14.1707 10.4807 14.5 8.796 14.5H4.198ZM8.226 6.976C9.35333 6.976 10.145 6.786 10.601 6.406C11.057 6.026 11.285 5.494 11.285 4.81C11.285 4.21467 11.038 3.73967 10.544 3.385C10.0627 3.03033 9.39767 2.853 8.549 2.853H5.072V6.976H8.226ZM8.625 12.885C9.85367 12.885 10.7213 12.695 11.228 12.315C11.7473 11.935 12.007 11.3967 12.007 10.7C12.007 9.256 10.886 8.534 8.644 8.534H5.072V12.885H8.625Z" fill={ colors[0] }/>

  </>,
  name: 'bold_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.198 14.5C3.95733 14.5 3.75467 14.4177 3.59 14.253C3.42533 14.0883 3.343 13.8857 3.343 13.645V2.112C3.343 1.87133 3.42533 1.66867 3.59 1.504C3.75467 1.32667 3.95733 1.238 4.198 1.238H8.682C10.0373 1.238 11.0823 1.54833 11.817 2.169C12.5643 2.78967 12.938 3.62567 12.938 4.677C12.938 5.41167 12.7607 6.026 12.406 6.52C12.064 7.00133 11.6207 7.36233 11.076 7.603C11.836 7.84367 12.4567 8.23 12.938 8.762C13.432 9.294 13.679 9.96533 13.679 10.776C13.679 11.9413 13.2863 12.8533 12.501 13.512C11.7157 14.1707 10.4807 14.5 8.796 14.5H4.198ZM8.226 6.976C9.35333 6.976 10.145 6.786 10.601 6.406C11.057 6.026 11.285 5.494 11.285 4.81C11.285 4.21467 11.038 3.73967 10.544 3.385C10.0627 3.03033 9.39767 2.853 8.549 2.853H5.072V6.976H8.226ZM8.625 12.885C9.85367 12.885 10.7213 12.695 11.228 12.315C11.7473 11.935 12.007 11.3967 12.007 10.7C12.007 9.256 10.886 8.534 8.644 8.534H5.072V12.885H8.625Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
