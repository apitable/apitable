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

export const ColumnRatingFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.05576 11.7825C7.99759 11.752 7.92817 11.752 7.87 11.7825L4.50019 13.5494C4.35356 13.6263 4.18235 13.5019 4.21016 13.3387L4.8493 9.58783C4.86033 9.52309 4.83888 9.45706 4.7919 9.41117L2.0701 6.75231C1.95167 6.63661 2.01707 6.43534 2.18089 6.41135L5.94571 5.86012C6.01068 5.85061 6.06685 5.8098 6.09598 5.75094L7.78363 2.34072C7.85706 2.19233 8.0687 2.19233 8.14213 2.34072L9.82978 5.75094C9.85891 5.8098 9.91507 5.85061 9.98005 5.86012L13.7449 6.41135C13.9087 6.43534 13.9741 6.63661 13.8557 6.75231L11.1339 9.41117C11.0869 9.45706 11.0654 9.52309 11.0765 9.58783L11.7156 13.3387C11.7434 13.5019 11.5722 13.6263 11.4256 13.5494L8.05576 11.7825Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'column_rating_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.05576 11.7825C7.99759 11.752 7.92817 11.752 7.87 11.7825L4.50019 13.5494C4.35356 13.6263 4.18235 13.5019 4.21016 13.3387L4.8493 9.58783C4.86033 9.52309 4.83888 9.45706 4.7919 9.41117L2.0701 6.75231C1.95167 6.63661 2.01707 6.43534 2.18089 6.41135L5.94571 5.86012C6.01068 5.85061 6.06685 5.8098 6.09598 5.75094L7.78363 2.34072C7.85706 2.19233 8.0687 2.19233 8.14213 2.34072L9.82978 5.75094C9.85891 5.8098 9.91507 5.85061 9.98005 5.86012L13.7449 6.41135C13.9087 6.43534 13.9741 6.63661 13.8557 6.75231L11.1339 9.41117C11.0869 9.45706 11.0654 9.52309 11.0765 9.58783L11.7156 13.3387C11.7434 13.5019 11.5722 13.6263 11.4256 13.5494L8.05576 11.7825Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
