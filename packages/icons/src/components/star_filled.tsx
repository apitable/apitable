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

export const StarFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.66379 0.900928C8.53414 0.654382 8.27853 0.5 7.99997 0.5C7.72142 0.5 7.46581 0.654382 7.33616 0.900928L5.44923 4.48921L1.45348 5.17494C1.17894 5.22206 0.953127 5.41745 0.867048 5.68237C0.78097 5.94729 0.848808 6.2381 1.04322 6.43759L3.87279 9.341L3.29021 13.3531C3.25018 13.6288 3.36623 13.9039 3.59158 14.0676C3.81694 14.2314 4.11448 14.2567 4.36428 14.1334L7.99997 12.3396L11.6357 14.1334C11.8855 14.2567 12.183 14.2314 12.4084 14.0676C12.6337 13.9039 12.7498 13.6288 12.7097 13.3531L12.1272 9.341L14.9567 6.43759C15.1511 6.2381 15.219 5.94729 15.1329 5.68237C15.0468 5.41745 14.821 5.22206 14.5465 5.17494L10.5507 4.48921L8.66379 0.900928Z" fill={ colors[0] }/>

  </>,
  name: 'star_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.66379 0.900928C8.53414 0.654382 8.27853 0.5 7.99997 0.5C7.72142 0.5 7.46581 0.654382 7.33616 0.900928L5.44923 4.48921L1.45348 5.17494C1.17894 5.22206 0.953127 5.41745 0.867048 5.68237C0.78097 5.94729 0.848808 6.2381 1.04322 6.43759L3.87279 9.341L3.29021 13.3531C3.25018 13.6288 3.36623 13.9039 3.59158 14.0676C3.81694 14.2314 4.11448 14.2567 4.36428 14.1334L7.99997 12.3396L11.6357 14.1334C11.8855 14.2567 12.183 14.2314 12.4084 14.0676C12.6337 13.9039 12.7498 13.6288 12.7097 13.3531L12.1272 9.341L14.9567 6.43759C15.1511 6.2381 15.219 5.94729 15.1329 5.68237C15.0468 5.41745 14.821 5.22206 14.5465 5.17494L10.5507 4.48921L8.66379 0.900928Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
