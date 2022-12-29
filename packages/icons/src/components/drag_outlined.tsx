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

export const DragOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 1C4 1.55228 3.55228 2 3 2C2.44772 2 2 1.55228 2 1C2 0.447715 2.44772 0 3 0C3.55228 0 4 0.447715 4 1ZM4 5C4 5.55228 3.55228 6 3 6C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4C3.55228 4 4 4.44772 4 5ZM3 10C3.55228 10 4 9.55229 4 9C4 8.44771 3.55228 8 3 8C2.44772 8 2 8.44771 2 9C2 9.55229 2.44772 10 3 10ZM8 1C8 1.55228 7.55228 2 7 2C6.44772 2 6 1.55228 6 1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1ZM7 6C7.55228 6 8 5.55228 8 5C8 4.44772 7.55228 4 7 4C6.44772 4 6 4.44772 6 5C6 5.55228 6.44772 6 7 6ZM8 9C8 9.55229 7.55228 10 7 10C6.44772 10 6 9.55229 6 9C6 8.44771 6.44772 8 7 8C7.55228 8 8 8.44771 8 9Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'drag_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 1C4 1.55228 3.55228 2 3 2C2.44772 2 2 1.55228 2 1C2 0.447715 2.44772 0 3 0C3.55228 0 4 0.447715 4 1ZM4 5C4 5.55228 3.55228 6 3 6C2.44772 6 2 5.55228 2 5C2 4.44772 2.44772 4 3 4C3.55228 4 4 4.44772 4 5ZM3 10C3.55228 10 4 9.55229 4 9C4 8.44771 3.55228 8 3 8C2.44772 8 2 8.44771 2 9C2 9.55229 2.44772 10 3 10ZM8 1C8 1.55228 7.55228 2 7 2C6.44772 2 6 1.55228 6 1C6 0.447715 6.44772 0 7 0C7.55228 0 8 0.447715 8 1ZM7 6C7.55228 6 8 5.55228 8 5C8 4.44772 7.55228 4 7 4C6.44772 4 6 4.44772 6 5C6 5.55228 6.44772 6 7 6ZM8 9C8 9.55229 7.55228 10 7 10C6.44772 10 6 9.55229 6 9C6 8.44771 6.44772 8 7 8C7.55228 8 8 8.44771 8 9Z'],
  width: '10',
  height: '10',
  viewBox: '0 0 10 10',
});
