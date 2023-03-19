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

export const EditFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M11.592 2.01372C11.4801 1.90181 11.3169 1.85037 11.1384 1.8707C10.9598 1.89103 10.7804 1.98147 10.6398 2.12212L2.60254 10.1594C2.49003 10.2719 2.40891 10.4099 2.37089 10.5536L1.59796 13.4739C1.54094 13.6893 1.58625 13.896 1.72 14.0307C1.85374 14.1654 2.05995 14.212 2.2754 14.1562L5.2086 13.3961C5.35359 13.3586 5.49311 13.277 5.60665 13.1635L13.6439 5.12623C13.9368 4.83334 13.9853 4.407 13.7523 4.17397L11.592 2.01372Z" fill={ colors[0] }/>
    <path d="M13.7501 14.2497C14.1643 14.2497 14.5001 13.914 14.5001 13.4997C14.5001 13.0855 14.1643 12.7497 13.7501 12.7497L9.7473 12.7497C9.33308 12.7497 8.9973 13.0855 8.9973 13.4997C8.9973 13.9139 9.33308 14.2497 9.7473 14.2497L13.7501 14.2497Z" fill={ colors[0] }/>

  </>,
  name: 'edit_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M11.592 2.01372C11.4801 1.90181 11.3169 1.85037 11.1384 1.8707C10.9598 1.89103 10.7804 1.98147 10.6398 2.12212L2.60254 10.1594C2.49003 10.2719 2.40891 10.4099 2.37089 10.5536L1.59796 13.4739C1.54094 13.6893 1.58625 13.896 1.72 14.0307C1.85374 14.1654 2.05995 14.212 2.2754 14.1562L5.2086 13.3961C5.35359 13.3586 5.49311 13.277 5.60665 13.1635L13.6439 5.12623C13.9368 4.83334 13.9853 4.407 13.7523 4.17397L11.592 2.01372Z', 'M13.7501 14.2497C14.1643 14.2497 14.5001 13.914 14.5001 13.4997C14.5001 13.0855 14.1643 12.7497 13.7501 12.7497L9.7473 12.7497C9.33308 12.7497 8.9973 13.0855 8.9973 13.4997C8.9973 13.9139 9.33308 14.2497 9.7473 14.2497L13.7501 14.2497Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
