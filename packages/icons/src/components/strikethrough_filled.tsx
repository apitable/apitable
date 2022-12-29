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

export const StrikethroughFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.096 3.168C5.896 2.624 6.904 2.352 8.12 2.352C9.448 2.352 10.488 2.624 11.24 3.2C12.04 3.792 12.488 4.704 12.6 5.952H10.872C10.712 5.216 10.424 4.672 9.976 4.352C9.528 4.016 8.888 3.856 8.024 3.856C7.272 3.856 6.696 3.968 6.296 4.192C5.8 4.448 5.56 4.864 5.56 5.44C5.56 5.952 5.832 6.352 6.408 6.656C6.55637 6.73946 6.8391 6.85516 7.25931 7H15V9H12.0604C12.5887 9.52287 12.856 10.1688 12.856 10.944C12.856 11.968 12.456 12.768 11.656 13.36C10.856 13.936 9.736 14.224 8.296 14.224C6.904 14.224 5.816 13.936 5.032 13.392C4.088 12.72 3.576 11.664 3.48 10.224H5.208C5.336 11.12 5.656 11.776 6.168 12.16C6.632 12.512 7.336 12.688 8.296 12.688C9.16 12.688 9.848 12.528 10.36 12.24C10.872 11.952 11.128 11.552 11.128 11.04C11.128 10.4 10.76 9.904 10.04 9.536C9.83958 9.43579 9.33514 9.25712 8.51901 9H1V7H4.24858C3.9699 6.58542 3.832 6.09646 3.832 5.536C3.832 4.528 4.248 3.744 5.096 3.168Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'strikethrough_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M5.096 3.168C5.896 2.624 6.904 2.352 8.12 2.352C9.448 2.352 10.488 2.624 11.24 3.2C12.04 3.792 12.488 4.704 12.6 5.952H10.872C10.712 5.216 10.424 4.672 9.976 4.352C9.528 4.016 8.888 3.856 8.024 3.856C7.272 3.856 6.696 3.968 6.296 4.192C5.8 4.448 5.56 4.864 5.56 5.44C5.56 5.952 5.832 6.352 6.408 6.656C6.55637 6.73946 6.8391 6.85516 7.25931 7H15V9H12.0604C12.5887 9.52287 12.856 10.1688 12.856 10.944C12.856 11.968 12.456 12.768 11.656 13.36C10.856 13.936 9.736 14.224 8.296 14.224C6.904 14.224 5.816 13.936 5.032 13.392C4.088 12.72 3.576 11.664 3.48 10.224H5.208C5.336 11.12 5.656 11.776 6.168 12.16C6.632 12.512 7.336 12.688 8.296 12.688C9.16 12.688 9.848 12.528 10.36 12.24C10.872 11.952 11.128 11.552 11.128 11.04C11.128 10.4 10.76 9.904 10.04 9.536C9.83958 9.43579 9.33514 9.25712 8.51901 9H1V7H4.24858C3.9699 6.58542 3.832 6.09646 3.832 5.536C3.832 4.528 4.248 3.744 5.096 3.168Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
