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

export const Collapse2Outlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 3.25C15 2.55964 14.4404 2 13.75 2H10.25C9.55964 2 9 2.55964 9 3.25L9 12.75C9 13.4404 9.55964 14 10.25 14H13.75C14.4404 14 15 13.4404 15 12.75L15 3.25ZM13.5 12.5H10.5L10.5 3.5H13.5L13.5 12.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M6.79526 3.23503C7.07967 3.53617 7.06611 4.01085 6.76497 4.29526L3.63642 7.25L7.25 7.25C7.66421 7.25 8 7.58579 8 8C8 8.41421 7.66421 8.75 7.25 8.75L3.63642 8.75L6.76497 11.7047C7.06611 11.9891 7.07967 12.4638 6.79526 12.765C6.51085 13.0661 6.03617 13.0797 5.73503 12.7953L1.23618 8.54634C1.09079 8.40955 1 8.21538 1 8C1 7.7845 1.09089 7.59023 1.23642 7.45343L5.73503 3.20474C6.03617 2.92033 6.51085 2.93389 6.79526 3.23503Z" fill={ colors[0] }/>

  </>,
  name: 'collapse_2_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M15 3.25C15 2.55964 14.4404 2 13.75 2H10.25C9.55964 2 9 2.55964 9 3.25L9 12.75C9 13.4404 9.55964 14 10.25 14H13.75C14.4404 14 15 13.4404 15 12.75L15 3.25ZM13.5 12.5H10.5L10.5 3.5H13.5L13.5 12.5Z', 'M6.79526 3.23503C7.07967 3.53617 7.06611 4.01085 6.76497 4.29526L3.63642 7.25L7.25 7.25C7.66421 7.25 8 7.58579 8 8C8 8.41421 7.66421 8.75 7.25 8.75L3.63642 8.75L6.76497 11.7047C7.06611 11.9891 7.07967 12.4638 6.79526 12.765C6.51085 13.0661 6.03617 13.0797 5.73503 12.7953L1.23618 8.54634C1.09079 8.40955 1 8.21538 1 8C1 7.7845 1.09089 7.59023 1.23642 7.45343L5.73503 3.20474C6.03617 2.92033 6.51085 2.93389 6.79526 3.23503Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
