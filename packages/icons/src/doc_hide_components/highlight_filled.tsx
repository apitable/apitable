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

export const HighlightFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.2656 2.07328C10.8593 1.54737 11.7599 1.57463 12.3208 2.1355L13.8223 3.63702C14.3832 4.19789 14.4104 5.09847 13.8845 5.69224L8.07074 12.2562C7.68878 12.6874 7.02239 12.7076 6.61504 12.3003L3.65754 9.34275C3.2502 8.9354 3.27037 8.26901 3.70162 7.88706L10.2656 2.07328Z" fill={ colors[0] }/>
    <path d="M3.60538 10.25L5.875 12.5L4.98765 13.25H2.09646C1.66776 13.25 1.43785 12.7458 1.71896 12.4221L3.60538 10.25Z" fill={ colors[0] }/>
    <path d="M10 12C9.58579 12 9.25 12.3358 9.25 12.75C9.25 13.1642 9.58579 13.5 10 13.5H13.75C14.1642 13.5 14.5 13.1642 14.5 12.75C14.5 12.3358 14.1642 12 13.75 12H10Z" fill={ colors[0] }/>

  </>,
  name: 'highlight_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.2656 2.07328C10.8593 1.54737 11.7599 1.57463 12.3208 2.1355L13.8223 3.63702C14.3832 4.19789 14.4104 5.09847 13.8845 5.69224L8.07074 12.2562C7.68878 12.6874 7.02239 12.7076 6.61504 12.3003L3.65754 9.34275C3.2502 8.9354 3.27037 8.26901 3.70162 7.88706L10.2656 2.07328Z', 'M3.60538 10.25L5.875 12.5L4.98765 13.25H2.09646C1.66776 13.25 1.43785 12.7458 1.71896 12.4221L3.60538 10.25Z', 'M10 12C9.58579 12 9.25 12.3358 9.25 12.75C9.25 13.1642 9.58579 13.5 10 13.5H13.75C14.1642 13.5 14.5 13.1642 14.5 12.75C14.5 12.3358 14.1642 12 13.75 12H10Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
