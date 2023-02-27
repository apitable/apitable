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

export const GiftOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.32267 1.10688C5.83055 0.706223 6.57944 0.885927 6.85021 1.47342L8 3.96819L9.14979 1.47342C9.42056 0.885927 10.1694 0.706223 10.6773 1.10688L12.656 2.66782C13.2307 3.12117 13.1396 4.01804 12.4855 4.34656L10.6867 5.25H14.25C14.6642 5.25 15 5.58579 15 6C15 6.41422 14.6642 6.75 14.25 6.75H13.75V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25V6.75H1.75C1.33579 6.75 1 6.41422 1 6C1 5.58579 1.33579 5.25 1.75 5.25H5.31335L3.5145 4.34656C2.86039 4.01804 2.76928 3.12117 3.34396 2.66782L5.32267 1.10688ZM8.75 6.75H12.25V13H8.75L8.75 6.75ZM7.25 6.75H3.75V13H7.25L7.25 6.75ZM5.75352 2.67754L4.88994 3.3588L6.42217 4.12834L5.75352 2.67754ZM11.1101 3.3588L10.2465 2.67754L9.57783 4.12834L11.1101 3.3588Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'gift_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.32267 1.10688C5.83055 0.706223 6.57944 0.885927 6.85021 1.47342L8 3.96819L9.14979 1.47342C9.42056 0.885927 10.1694 0.706223 10.6773 1.10688L12.656 2.66782C13.2307 3.12117 13.1396 4.01804 12.4855 4.34656L10.6867 5.25H14.25C14.6642 5.25 15 5.58579 15 6C15 6.41422 14.6642 6.75 14.25 6.75H13.75V13.25C13.75 13.9404 13.1904 14.5 12.5 14.5H3.5C2.80964 14.5 2.25 13.9404 2.25 13.25V6.75H1.75C1.33579 6.75 1 6.41422 1 6C1 5.58579 1.33579 5.25 1.75 5.25H5.31335L3.5145 4.34656C2.86039 4.01804 2.76928 3.12117 3.34396 2.66782L5.32267 1.10688ZM8.75 6.75H12.25V13H8.75L8.75 6.75ZM7.25 6.75H3.75V13H7.25L7.25 6.75ZM5.75352 2.67754L4.88994 3.3588L6.42217 4.12834L5.75352 2.67754ZM11.1101 3.3588L10.2465 2.67754L9.57783 4.12834L11.1101 3.3588Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
