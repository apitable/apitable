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

export const FolderOpenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.39065 2C4.67643 2 4.95358 2.09792 5.17593 2.27746L6.38038 3.25H11.8011C12.4395 3.25 12.9753 3.73099 13.0439 4.36565L13.1936 5.75H14.2404C15.0491 5.75 15.6449 6.50632 15.4556 7.29257L14.0714 13.0426C13.9861 13.3968 13.7547 13.6851 13.4505 13.8497C13.3251 13.9441 13.1691 14 13 14H2.70465C2.0602 14 1.52138 13.5101 1.46028 12.8685L0.555516 3.36851C0.485625 2.63466 1.06271 2 1.79988 2H4.39065ZM3.20199 12.5H12.6591L13.923 7.25H4.46588L3.20199 12.5ZM2.57117 8.71156L2.07483 3.5H4.30232L5.50677 4.47254C5.72912 4.65207 6.00627 4.75 6.29205 4.75H11.5767L11.6848 5.75H4.26892C3.69127 5.75 3.18885 6.14582 3.05364 6.70743L2.57117 8.71156Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_open_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.39065 2C4.67643 2 4.95358 2.09792 5.17593 2.27746L6.38038 3.25H11.8011C12.4395 3.25 12.9753 3.73099 13.0439 4.36565L13.1936 5.75H14.2404C15.0491 5.75 15.6449 6.50632 15.4556 7.29257L14.0714 13.0426C13.9861 13.3968 13.7547 13.6851 13.4505 13.8497C13.3251 13.9441 13.1691 14 13 14H2.70465C2.0602 14 1.52138 13.5101 1.46028 12.8685L0.555516 3.36851C0.485625 2.63466 1.06271 2 1.79988 2H4.39065ZM3.20199 12.5H12.6591L13.923 7.25H4.46588L3.20199 12.5ZM2.57117 8.71156L2.07483 3.5H4.30232L5.50677 4.47254C5.72912 4.65207 6.00627 4.75 6.29205 4.75H11.5767L11.6848 5.75H4.26892C3.69127 5.75 3.18885 6.14582 3.05364 6.70743L2.57117 8.71156Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
