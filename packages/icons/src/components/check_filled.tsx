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

export const CheckFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M14.805 4.50451C15.0836 4.19802 15.061 3.72368 14.7545 3.44505C14.448 3.16642 13.9737 3.189 13.6951 3.49549L6.72412 11.1635L2.28033 6.71966C1.98744 6.42676 1.51257 6.42676 1.21967 6.71965C0.926777 7.01255 0.926776 7.48742 1.21967 7.78031L6.21964 12.7803C6.36467 12.9253 6.56276 13.0047 6.76781 12.9998C6.97285 12.9949 7.16695 12.9063 7.30492 12.7545L14.805 4.50451Z" fill={ colors[0] }/>

  </>,
  name: 'check_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M14.805 4.50451C15.0836 4.19802 15.061 3.72368 14.7545 3.44505C14.448 3.16642 13.9737 3.189 13.6951 3.49549L6.72412 11.1635L2.28033 6.71966C1.98744 6.42676 1.51257 6.42676 1.21967 6.71965C0.926777 7.01255 0.926776 7.48742 1.21967 7.78031L6.21964 12.7803C6.36467 12.9253 6.56276 13.0047 6.76781 12.9998C6.97285 12.9949 7.16695 12.9063 7.30492 12.7545L14.805 4.50451Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
