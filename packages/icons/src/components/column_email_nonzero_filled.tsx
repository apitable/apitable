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

export const ColumnEmailNonzeroFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 3C2.89543 3 2 3.89543 2 5V11C2 12.1046 2.89543 13 4 13H12C13.1046 13 14 12.1046 14 11V5C14 3.89543 13.1046 3 12 3H4ZM10.3796 6.12296C10.7794 5.8276 11.3429 5.91226 11.6383 6.31204C11.9336 6.71182 11.849 7.27535 11.4492 7.57071L8.53495 9.72374C8.21709 9.95858 7.78322 9.95858 7.46536 9.72374L4.55112 7.57071C4.15133 7.27535 4.06668 6.71182 4.36204 6.31204C4.6574 5.91226 5.22092 5.8276 5.62071 6.12296L8.00015 7.88089L10.3796 6.12296Z" fill={ colors[0] }/>

  </>,
  name: 'column_email_nonzero_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 3C2.89543 3 2 3.89543 2 5V11C2 12.1046 2.89543 13 4 13H12C13.1046 13 14 12.1046 14 11V5C14 3.89543 13.1046 3 12 3H4ZM10.3796 6.12296C10.7794 5.8276 11.3429 5.91226 11.6383 6.31204C11.9336 6.71182 11.849 7.27535 11.4492 7.57071L8.53495 9.72374C8.21709 9.95858 7.78322 9.95858 7.46536 9.72374L4.55112 7.57071C4.15133 7.27535 4.06668 6.71182 4.36204 6.31204C4.6574 5.91226 5.22092 5.8276 5.62071 6.12296L8.00015 7.88089L10.3796 6.12296Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
