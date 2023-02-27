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

export const ArchitectureFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.25 1.5C4.55964 1.5 4 2.05964 4 2.75V6.25C4 6.71727 4.25639 7.12465 4.63616 7.33915C4.10914 7.86148 3.73135 8.51284 3.57706 9.25H2.75C2.05964 9.25 1.5 9.80964 1.5 10.5V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.5C6.19036 14.5 6.75 13.9404 6.75 13.25V10.5C6.75 9.80964 6.19036 9.25 5.5 9.25H5.14181C5.51428 8.28007 6.58964 7.5 8 7.5C9.41036 7.5 10.4857 8.28007 10.8582 9.25H10.5C9.80964 9.25 9.25 9.80964 9.25 10.5V13.25C9.25 13.9404 9.80964 14.5 10.5 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V10.5C14.5 9.80964 13.9404 9.25 13.25 9.25H12.4229C12.2686 8.51284 11.8909 7.86149 11.3638 7.33915C11.7436 7.12466 12 6.71727 12 6.25V2.75C12 2.05964 11.4404 1.5 10.75 1.5H5.25ZM3 13V10.75H5.25V13H3ZM10.75 10.75V13H13V10.75H10.75Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'architecture_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.25 1.5C4.55964 1.5 4 2.05964 4 2.75V6.25C4 6.71727 4.25639 7.12465 4.63616 7.33915C4.10914 7.86148 3.73135 8.51284 3.57706 9.25H2.75C2.05964 9.25 1.5 9.80964 1.5 10.5V13.25C1.5 13.9404 2.05964 14.5 2.75 14.5H5.5C6.19036 14.5 6.75 13.9404 6.75 13.25V10.5C6.75 9.80964 6.19036 9.25 5.5 9.25H5.14181C5.51428 8.28007 6.58964 7.5 8 7.5C9.41036 7.5 10.4857 8.28007 10.8582 9.25H10.5C9.80964 9.25 9.25 9.80964 9.25 10.5V13.25C9.25 13.9404 9.80964 14.5 10.5 14.5H13.25C13.9404 14.5 14.5 13.9404 14.5 13.25V10.5C14.5 9.80964 13.9404 9.25 13.25 9.25H12.4229C12.2686 8.51284 11.8909 7.86149 11.3638 7.33915C11.7436 7.12466 12 6.71727 12 6.25V2.75C12 2.05964 11.4404 1.5 10.75 1.5H5.25ZM3 13V10.75H5.25V13H3ZM10.75 10.75V13H13V10.75H10.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
