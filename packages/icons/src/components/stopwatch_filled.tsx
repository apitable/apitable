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

export const StopwatchFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5 0.875C4.58579 0.875 4.25 1.21079 4.25 1.625C4.25 2.03921 4.58579 2.375 5 2.375H7.25V3.54847C4.42873 3.91598 2.25 6.32855 2.25 9.25C2.25 12.4256 4.82436 15 8 15C11.1756 15 13.75 12.4256 13.75 9.25C13.75 6.32855 11.5713 3.91598 8.75 3.54847V2.375H11C11.4142 2.375 11.75 2.03921 11.75 1.625C11.75 1.21079 11.4142 0.875 11 0.875H5ZM8 6C8.41421 6 8.75 6.33579 8.75 6.75V8.93934L9.90533 10.0947C10.1982 10.3876 10.1982 10.8624 9.90533 11.1553C9.61244 11.4482 9.13756 11.4482 8.84467 11.1553L7.46967 9.78033C7.32902 9.63968 7.25 9.44891 7.25 9.25V6.75C7.25 6.33579 7.58579 6 8 6Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'stopwatch_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5 0.875C4.58579 0.875 4.25 1.21079 4.25 1.625C4.25 2.03921 4.58579 2.375 5 2.375H7.25V3.54847C4.42873 3.91598 2.25 6.32855 2.25 9.25C2.25 12.4256 4.82436 15 8 15C11.1756 15 13.75 12.4256 13.75 9.25C13.75 6.32855 11.5713 3.91598 8.75 3.54847V2.375H11C11.4142 2.375 11.75 2.03921 11.75 1.625C11.75 1.21079 11.4142 0.875 11 0.875H5ZM8 6C8.41421 6 8.75 6.33579 8.75 6.75V8.93934L9.90533 10.0947C10.1982 10.3876 10.1982 10.8624 9.90533 11.1553C9.61244 11.4482 9.13756 11.4482 8.84467 11.1553L7.46967 9.78033C7.32902 9.63968 7.25 9.44891 7.25 9.25V6.75C7.25 6.33579 7.58579 6 8 6Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
