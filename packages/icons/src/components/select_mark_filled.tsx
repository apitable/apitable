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

export const SelectMarkFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M24 24V0L0 24H24ZM20.3638 13.9995C20.7543 14.39 20.7543 15.0232 20.3638 15.4137L16.1212 19.6563C15.7306 20.0469 15.0975 20.0469 14.707 19.6563L12.5856 17.535C12.1951 17.1445 12.1951 16.5113 12.5856 16.1208C12.9762 15.7303 13.6093 15.7303 13.9998 16.1208L15.4141 17.535L18.9496 13.9995C19.3401 13.6089 19.9733 13.6089 20.3638 13.9995Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'select_mark_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M24 24V0L0 24H24ZM20.3638 13.9995C20.7543 14.39 20.7543 15.0232 20.3638 15.4137L16.1212 19.6563C15.7306 20.0469 15.0975 20.0469 14.707 19.6563L12.5856 17.535C12.1951 17.1445 12.1951 16.5113 12.5856 16.1208C12.9762 15.7303 13.6093 15.7303 13.9998 16.1208L15.4141 17.535L18.9496 13.9995C19.3401 13.6089 19.9733 13.6089 20.3638 13.9995Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
