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

export const FreezeOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V2.75ZM3 10.8091V12.9365L6.25 9.45436V7.38219L3.04446 10.7658C3.03011 10.781 3.01527 10.7954 3 10.8091ZM6.25 13H4.99258L6.25 11.6528V13ZM3 8.6317L6.25 5.20115V3.06375L3.0496 6.51034C3.03366 6.5275 3.0171 6.54375 3 6.55908V8.6317ZM3 4.35933L4.26223 3H3V4.35933ZM7.75 13H13V3H7.75V13Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'freeze_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.5 2.75C1.5 2.05964 2.05964 1.5 2.75 1.5H13.25C13.9404 1.5 14.5 2.05964 14.5 2.75V13.25C14.5 13.9404 13.9404 14.5 13.25 14.5H2.75C2.05964 14.5 1.5 13.9404 1.5 13.25V2.75ZM3 10.8091V12.9365L6.25 9.45436V7.38219L3.04446 10.7658C3.03011 10.781 3.01527 10.7954 3 10.8091ZM6.25 13H4.99258L6.25 11.6528V13ZM3 8.6317L6.25 5.20115V3.06375L3.0496 6.51034C3.03366 6.5275 3.0171 6.54375 3 6.55908V8.6317ZM3 4.35933L4.26223 3H3V4.35933ZM7.75 13H13V3H7.75V13Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
