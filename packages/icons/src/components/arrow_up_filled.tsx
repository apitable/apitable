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

export const ArrowUpFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.75006 3.56086L12.0409 6.85187C12.3338 7.14477 12.8086 7.14479 13.1015 6.8519C13.3944 6.55902 13.3944 6.08415 13.1016 5.79124L8.53042 1.21982C8.23754 0.926921 7.76266 0.926907 7.46976 1.21979L2.89806 5.79121C2.60516 6.0841 2.60514 6.55897 2.89803 6.85187C3.19091 7.14478 3.66579 7.14479 3.95869 6.85191L7.25006 3.56074L7.24994 14.2501C7.24993 14.6643 7.58572 15.0001 7.99993 15.0001C8.41414 15.0001 8.74993 14.6643 8.74994 14.2501L8.75006 3.56086Z" fill={ colors[0] }/>

  </>,
  name: 'arrow_up_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8.75006 3.56086L12.0409 6.85187C12.3338 7.14477 12.8086 7.14479 13.1015 6.8519C13.3944 6.55902 13.3944 6.08415 13.1016 5.79124L8.53042 1.21982C8.23754 0.926921 7.76266 0.926907 7.46976 1.21979L2.89806 5.79121C2.60516 6.0841 2.60514 6.55897 2.89803 6.85187C3.19091 7.14478 3.66579 7.14479 3.95869 6.85191L7.25006 3.56074L7.24994 14.2501C7.24993 14.6643 7.58572 15.0001 7.99993 15.0001C8.41414 15.0001 8.74993 14.6643 8.74994 14.2501L8.75006 3.56086Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
