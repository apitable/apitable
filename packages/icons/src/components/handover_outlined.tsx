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

export const HandoverOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V4C14 4.55228 13.5523 5 13 5C12.4477 5 12 4.55228 12 4V3H4V13H5C5.55228 13 6 13.4477 6 14C6 14.5523 5.55228 15 5 15H3C2.44772 15 2 14.5523 2 14V2ZM10.1 6.2C10.5418 6.53137 10.6314 7.15817 10.3 7.6L10 8H13C13.5523 8 14 8.44772 14 9C14 9.55228 13.5523 10 13 10H8C7.62123 10 7.27496 9.786 7.10557 9.44721C6.93618 9.10843 6.97274 8.70302 7.2 8.4L8.7 6.4C9.03137 5.95817 9.65817 5.86863 10.1 6.2ZM10.7 13.4C10.3686 13.8418 10.4582 14.4686 10.9 14.8C11.3418 15.1314 11.9686 15.0418 12.3 14.6L13.8 12.6C14.0273 12.297 14.0638 11.8916 13.8944 11.5528C13.725 11.214 13.3788 11 13 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H11L10.7 13.4Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'handover_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 2C2 1.44772 2.44772 1 3 1H13C13.5523 1 14 1.44772 14 2V4C14 4.55228 13.5523 5 13 5C12.4477 5 12 4.55228 12 4V3H4V13H5C5.55228 13 6 13.4477 6 14C6 14.5523 5.55228 15 5 15H3C2.44772 15 2 14.5523 2 14V2ZM10.1 6.2C10.5418 6.53137 10.6314 7.15817 10.3 7.6L10 8H13C13.5523 8 14 8.44772 14 9C14 9.55228 13.5523 10 13 10H8C7.62123 10 7.27496 9.786 7.10557 9.44721C6.93618 9.10843 6.97274 8.70302 7.2 8.4L8.7 6.4C9.03137 5.95817 9.65817 5.86863 10.1 6.2ZM10.7 13.4C10.3686 13.8418 10.4582 14.4686 10.9 14.8C11.3418 15.1314 11.9686 15.0418 12.3 14.6L13.8 12.6C14.0273 12.297 14.0638 11.8916 13.8944 11.5528C13.725 11.214 13.3788 11 13 11H8C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H11L10.7 13.4Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
