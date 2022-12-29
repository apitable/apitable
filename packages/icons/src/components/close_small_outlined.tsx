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

export const CloseSmallOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10.8523 5.14768C10.6554 4.95077 10.3361 4.95077 10.1392 5.14768L8 7.28692L5.86076 5.14768C5.66385 4.95077 5.34459 4.95077 5.14768 5.14768C4.95077 5.34459 4.95077 5.66385 5.14768 5.86076L7.28692 8L5.14768 10.1392C4.95077 10.3361 4.95077 10.6554 5.14768 10.8523C5.34459 11.0492 5.66385 11.0492 5.86076 10.8523L8 8.71308L10.1392 10.8523C10.3361 11.0492 10.6554 11.0492 10.8523 10.8523C11.0492 10.6554 11.0492 10.3361 10.8523 10.1392L8.71308 8L10.8523 5.86076C11.0492 5.66385 11.0492 5.34459 10.8523 5.14768Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'close_small_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10.8523 5.14768C10.6554 4.95077 10.3361 4.95077 10.1392 5.14768L8 7.28692L5.86076 5.14768C5.66385 4.95077 5.34459 4.95077 5.14768 5.14768C4.95077 5.34459 4.95077 5.66385 5.14768 5.86076L7.28692 8L5.14768 10.1392C4.95077 10.3361 4.95077 10.6554 5.14768 10.8523C5.34459 11.0492 5.66385 11.0492 5.86076 10.8523L8 8.71308L10.1392 10.8523C10.3361 11.0492 10.6554 11.0492 10.8523 10.8523C11.0492 10.6554 11.0492 10.3361 10.8523 10.1392L8.71308 8L10.8523 5.86076C11.0492 5.66385 11.0492 5.34459 10.8523 5.14768Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
