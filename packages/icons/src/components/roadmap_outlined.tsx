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

export const RoadmapOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.5303 2.21964C13.2374 1.92675 12.7626 1.92675 12.4697 2.21964L10.7197 3.96965C10.4268 4.26255 10.4268 4.73742 10.7197 5.03031C11.0126 5.32321 11.4874 5.32321 11.7803 5.03031L12.25 4.56063V10.75C12.25 11.7165 11.4665 12.5 10.5 12.5C9.5335 12.5 8.75 11.7165 8.75 10.75V5.25C8.75 3.45507 7.29493 2 5.5 2C3.70507 2 2.25 3.45507 2.25 5.25V10.1454C1.51704 10.4421 1 11.1607 1 12C1 13.1046 1.89543 14 3 14C4.10457 14 5 13.1046 5 12C5 11.1607 4.48296 10.4421 3.75 10.1454V5.25C3.75 4.2835 4.5335 3.5 5.5 3.5C6.4665 3.5 7.25 4.2835 7.25 5.25V10.75C7.25 12.5449 8.70507 14 10.5 14C12.2949 14 13.75 12.5449 13.75 10.75V4.56063L14.2197 5.03031C14.5126 5.32321 14.9874 5.32321 15.2803 5.03031C15.5732 4.73742 15.5732 4.26255 15.2803 3.96965L13.5303 2.21964ZM3 11.5C2.72386 11.5 2.5 11.7239 2.5 12C2.5 12.2761 2.72386 12.5 3 12.5C3.27614 12.5 3.5 12.2761 3.5 12C3.5 11.7239 3.27614 11.5 3 11.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'roadmap_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.5303 2.21964C13.2374 1.92675 12.7626 1.92675 12.4697 2.21964L10.7197 3.96965C10.4268 4.26255 10.4268 4.73742 10.7197 5.03031C11.0126 5.32321 11.4874 5.32321 11.7803 5.03031L12.25 4.56063V10.75C12.25 11.7165 11.4665 12.5 10.5 12.5C9.5335 12.5 8.75 11.7165 8.75 10.75V5.25C8.75 3.45507 7.29493 2 5.5 2C3.70507 2 2.25 3.45507 2.25 5.25V10.1454C1.51704 10.4421 1 11.1607 1 12C1 13.1046 1.89543 14 3 14C4.10457 14 5 13.1046 5 12C5 11.1607 4.48296 10.4421 3.75 10.1454V5.25C3.75 4.2835 4.5335 3.5 5.5 3.5C6.4665 3.5 7.25 4.2835 7.25 5.25V10.75C7.25 12.5449 8.70507 14 10.5 14C12.2949 14 13.75 12.5449 13.75 10.75V4.56063L14.2197 5.03031C14.5126 5.32321 14.9874 5.32321 15.2803 5.03031C15.5732 4.73742 15.5732 4.26255 15.2803 3.96965L13.5303 2.21964ZM3 11.5C2.72386 11.5 2.5 11.7239 2.5 12C2.5 12.2761 2.72386 12.5 3 12.5C3.27614 12.5 3.5 12.2761 3.5 12C3.5 11.7239 3.27614 11.5 3 11.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
