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

export const GuideOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M4 6C4 3.79086 5.79086 2 8 2C10.2091 2 12 3.79086 12 6C12 7.53231 11.0366 8.92543 9.85176 10.5218L9.49686 11H9V8.5C9 7.94772 8.55228 7.5 8 7.5C7.44772 7.5 7 7.94772 7 8.5L7 11H6.50314L6.14099 10.5121C4.96778 8.9313 4 7.5161 4 6ZM8 13H10C10.3165 13 10.6144 12.8501 10.803 12.596L11.4578 11.7138L11.4808 11.6827L11.4808 11.6827C12.5797 10.2022 14 8.2887 14 6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6C2 8.28688 3.44171 10.231 4.53499 11.704L5.197 12.596C5.38564 12.8501 5.68348 13 6 13H8ZM5 15C5 14.4477 5.44772 14 6 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H6C5.44772 16 5 15.5523 5 15Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'guide_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M4 6C4 3.79086 5.79086 2 8 2C10.2091 2 12 3.79086 12 6C12 7.53231 11.0366 8.92543 9.85176 10.5218L9.49686 11H9V8.5C9 7.94772 8.55228 7.5 8 7.5C7.44772 7.5 7 7.94772 7 8.5L7 11H6.50314L6.14099 10.5121C4.96778 8.9313 4 7.5161 4 6ZM8 13H10C10.3165 13 10.6144 12.8501 10.803 12.596L11.4578 11.7138L11.4808 11.6827L11.4808 11.6827C12.5797 10.2022 14 8.2887 14 6C14 2.68629 11.3137 0 8 0C4.68629 0 2 2.68629 2 6C2 8.28688 3.44171 10.231 4.53499 11.704L5.197 12.596C5.38564 12.8501 5.68348 13 6 13H8ZM5 15C5 14.4477 5.44772 14 6 14H10C10.5523 14 11 14.4477 11 15C11 15.5523 10.5523 16 10 16H6C5.44772 16 5 15.5523 5 15Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
