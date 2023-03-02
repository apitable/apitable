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

export const StarOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.88509 1.32171C8.51028 0.608953 7.48973 0.608946 7.11492 1.32171L5.44927 4.48921L1.92208 5.09453C1.12838 5.23074 0.813011 6.20134 1.37507 6.77806L3.87282 9.341L3.35855 12.8826C3.24283 13.6796 4.06847 14.2794 4.79065 13.9231L8 12.3396L11.2094 13.9231C11.9315 14.2794 12.7572 13.6796 12.6415 12.8826L12.1272 9.341L14.6249 6.77806C15.187 6.20134 14.8716 5.23074 14.0779 5.09453L10.5507 4.48921L8.88509 1.32171ZM6.66207 5.40571L8 2.86142L9.33794 5.40571C9.4827 5.681 9.74732 5.87326 10.0539 5.92587L12.8871 6.41209L10.8808 8.47077C10.6637 8.69352 10.5626 9.0046 10.6073 9.31241L11.0204 12.1572L8.44248 10.8852C8.16355 10.7476 7.83646 10.7476 7.55753 10.8852L4.97962 12.1572L5.39271 9.31241C5.4374 9.0046 5.33633 8.69352 5.11924 8.47077L3.11292 6.41209L5.94613 5.92587C6.25269 5.87326 6.51731 5.681 6.66207 5.40571Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'star_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.88509 1.32171C8.51028 0.608953 7.48973 0.608946 7.11492 1.32171L5.44927 4.48921L1.92208 5.09453C1.12838 5.23074 0.813011 6.20134 1.37507 6.77806L3.87282 9.341L3.35855 12.8826C3.24283 13.6796 4.06847 14.2794 4.79065 13.9231L8 12.3396L11.2094 13.9231C11.9315 14.2794 12.7572 13.6796 12.6415 12.8826L12.1272 9.341L14.6249 6.77806C15.187 6.20134 14.8716 5.23074 14.0779 5.09453L10.5507 4.48921L8.88509 1.32171ZM6.66207 5.40571L8 2.86142L9.33794 5.40571C9.4827 5.681 9.74732 5.87326 10.0539 5.92587L12.8871 6.41209L10.8808 8.47077C10.6637 8.69352 10.5626 9.0046 10.6073 9.31241L11.0204 12.1572L8.44248 10.8852C8.16355 10.7476 7.83646 10.7476 7.55753 10.8852L4.97962 12.1572L5.39271 9.31241C5.4374 9.0046 5.33633 8.69352 5.11924 8.47077L3.11292 6.41209L5.94613 5.92587C6.25269 5.87326 6.51731 5.681 6.66207 5.40571Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
