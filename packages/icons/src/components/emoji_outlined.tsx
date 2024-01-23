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

export const EmojiOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M6.5 6C6.5 5.58579 6.16421 5.25 5.75 5.25C5.33579 5.25 5 5.58579 5 6V6.75C5 7.16421 5.33579 7.5 5.75 7.5C6.16421 7.5 6.5 7.16421 6.5 6.75V6Z" fill={ colors[0] }/>
    <path d="M10.25 5.25C10.6642 5.25 11 5.58579 11 6V6.75C11 7.16421 10.6642 7.5 10.25 7.5C9.83579 7.5 9.5 7.16421 9.5 6.75V6C9.5 5.58579 9.83579 5.25 10.25 5.25Z" fill={ colors[0] }/>
    <path d="M6.4029 9.92335C6.08442 9.6585 5.61154 9.70197 5.34669 10.0204C5.08184 10.3389 5.12531 10.8118 5.44378 11.0766C6.13664 11.6529 7.02883 12 8.00013 12C8.97142 12 9.86362 11.6529 10.5565 11.0766C10.8749 10.8118 10.9184 10.3389 10.6536 10.0204C10.3887 9.70197 9.91583 9.6585 9.59735 9.92335C9.16389 10.2838 8.60824 10.5 8.00013 10.5C7.39201 10.5 6.83636 10.2838 6.4029 9.92335Z" fill={ colors[0] }/>
    <path d="M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'emoji_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.5 6C6.5 5.58579 6.16421 5.25 5.75 5.25C5.33579 5.25 5 5.58579 5 6V6.75C5 7.16421 5.33579 7.5 5.75 7.5C6.16421 7.5 6.5 7.16421 6.5 6.75V6Z', 'M10.25 5.25C10.6642 5.25 11 5.58579 11 6V6.75C11 7.16421 10.6642 7.5 10.25 7.5C9.83579 7.5 9.5 7.16421 9.5 6.75V6C9.5 5.58579 9.83579 5.25 10.25 5.25Z', 'M6.4029 9.92335C6.08442 9.6585 5.61154 9.70197 5.34669 10.0204C5.08184 10.3389 5.12531 10.8118 5.44378 11.0766C6.13664 11.6529 7.02883 12 8.00013 12C8.97142 12 9.86362 11.6529 10.5565 11.0766C10.8749 10.8118 10.9184 10.3389 10.6536 10.0204C10.3887 9.70197 9.91583 9.6585 9.59735 9.92335C9.16389 10.2838 8.60824 10.5 8.00013 10.5C7.39201 10.5 6.83636 10.2838 6.4029 9.92335Z', 'M8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1ZM2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8C13.5 11.0376 11.0376 13.5 8 13.5C4.96243 13.5 2.5 11.0376 2.5 8Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
