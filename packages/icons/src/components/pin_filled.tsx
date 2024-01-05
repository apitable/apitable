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

export const PinFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.89509 14.216C9.60391 14.9248 10.8169 14.5528 11.0064 13.5685L11.8252 9.31674L14.7964 7.41474C15.4688 6.98434 15.5709 6.04257 15.0064 5.47808L10.834 1.30563C10.2695 0.741131 9.3277 0.84324 8.8973 1.5156L6.9953 4.48688L2.74356 5.30562C1.75922 5.49517 1.38722 6.70813 2.09604 7.41695L4.96548 10.2864L2.57924 12.6726C2.28635 12.9655 2.28635 13.4404 2.57924 13.7333C2.87213 14.0262 3.34701 14.0262 3.6399 13.7333L6.02614 11.347L8.89509 14.216Z" fill={ colors[0] }/>

  </>,
  name: 'pin_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.89509 14.216C9.60391 14.9248 10.8169 14.5528 11.0064 13.5685L11.8252 9.31674L14.7964 7.41474C15.4688 6.98434 15.5709 6.04257 15.0064 5.47808L10.834 1.30563C10.2695 0.741131 9.3277 0.84324 8.8973 1.5156L6.9953 4.48688L2.74356 5.30562C1.75922 5.49517 1.38722 6.70813 2.09604 7.41695L4.96548 10.2864L2.57924 12.6726C2.28635 12.9655 2.28635 13.4404 2.57924 13.7333C2.87213 14.0262 3.34701 14.0262 3.6399 13.7333L6.02614 11.347L8.89509 14.216Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
