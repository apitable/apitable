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

export const MortarboardFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M7.47821 2.12751C7.81809 2.0213 8.18229 2.0213 8.52217 2.12751L13.9331 3.81844C15.3366 4.25702 15.3366 6.2433 13.9331 6.68188L8.52217 8.37281C8.18229 8.47902 7.81809 8.47902 7.47821 8.37281L2.06724 6.68188C0.663788 6.2433 0.663784 4.25702 2.06724 3.81844L7.47821 2.12751Z" fill={ colors[0] }/>
    <path d="M2.25 11.6481V7.78669L7.17993 9.32729C7.71404 9.4942 8.28635 9.4942 8.82045 9.32729L13.75 7.7868V11.6481C13.75 11.8824 13.6405 12.1033 13.454 12.2451C10.377 14.585 5.62301 14.585 2.54602 12.2451C2.35951 12.1033 2.25 11.8824 2.25 11.6481Z" fill={ colors[0] }/>

  </>,
  name: 'mortarboard_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M7.47821 2.12751C7.81809 2.0213 8.18229 2.0213 8.52217 2.12751L13.9331 3.81844C15.3366 4.25702 15.3366 6.2433 13.9331 6.68188L8.52217 8.37281C8.18229 8.47902 7.81809 8.47902 7.47821 8.37281L2.06724 6.68188C0.663788 6.2433 0.663784 4.25702 2.06724 3.81844L7.47821 2.12751Z', 'M2.25 11.6481V7.78669L7.17993 9.32729C7.71404 9.4942 8.28635 9.4942 8.82045 9.32729L13.75 7.7868V11.6481C13.75 11.8824 13.6405 12.1033 13.454 12.2451C10.377 14.585 5.62301 14.585 2.54602 12.2451C2.35951 12.1033 2.25 11.8824 2.25 11.6481Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
