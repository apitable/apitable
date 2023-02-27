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

export const FolderOpenFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4.39065 2.75C4.67643 2.75 4.95358 2.84792 5.17593 3.02746L6.38038 4H11.8011C12.4395 4 12.9753 4.48099 13.0439 5.11565L13.153 6.125H14.2481C15.0507 6.125 15.6453 6.8705 15.4668 7.65295L14.0699 13.778C13.9892 14.1318 13.7629 14.4217 13.4629 14.5902C13.3354 14.6903 13.1747 14.75 13 14.75H2.70465C2.0602 14.75 1.52138 14.2601 1.46028 13.6185L0.555516 4.11851C0.485625 3.38466 1.06271 2.75 1.79988 2.75H4.39065ZM2.55486 9.29038L3.0551 7.09705C3.18479 6.52838 3.69054 6.125 4.2738 6.125H11.6443L11.5767 5.5H6.29205C6.00627 5.5 5.72912 5.40207 5.50677 5.22254L4.30232 4.25H2.07483L2.55486 9.29038Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'folder_open_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M4.39065 2.75C4.67643 2.75 4.95358 2.84792 5.17593 3.02746L6.38038 4H11.8011C12.4395 4 12.9753 4.48099 13.0439 5.11565L13.153 6.125H14.2481C15.0507 6.125 15.6453 6.8705 15.4668 7.65295L14.0699 13.778C13.9892 14.1318 13.7629 14.4217 13.4629 14.5902C13.3354 14.6903 13.1747 14.75 13 14.75H2.70465C2.0602 14.75 1.52138 14.2601 1.46028 13.6185L0.555516 4.11851C0.485625 3.38466 1.06271 2.75 1.79988 2.75H4.39065ZM2.55486 9.29038L3.0551 7.09705C3.18479 6.52838 3.69054 6.125 4.2738 6.125H11.6443L11.5767 5.5H6.29205C6.00627 5.5 5.72912 5.40207 5.50677 5.22254L4.30232 4.25H2.07483L2.55486 9.29038Z'],
  width: '17',
  height: '17',
  viewBox: '0 0 17 17',
});
