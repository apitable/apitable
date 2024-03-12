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

export const CloseCircleFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM5.46973 5.46967C5.17684 5.76256 5.17684 6.23744 5.46973 6.53033L6.9394 8L5.46973 9.46967C5.17684 9.76256 5.17684 10.2374 5.46973 10.5303C5.76262 10.8232 6.2375 10.8232 6.53039 10.5303L8.00006 9.06066L9.4697 10.5303C9.76259 10.8232 10.2375 10.8232 10.5304 10.5303C10.8233 10.2374 10.8233 9.76253 10.5304 9.46964L9.06072 8L10.5304 6.53036C10.8233 6.23747 10.8233 5.7626 10.5304 5.4697C10.2375 5.17681 9.76259 5.17681 9.4697 5.4697L8.00006 6.93934L6.53039 5.46967C6.2375 5.17678 5.76262 5.17678 5.46973 5.46967Z" fill={ colors[0] }/>

  </>,
  name: 'close_circle_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM5.46973 5.46967C5.17684 5.76256 5.17684 6.23744 5.46973 6.53033L6.9394 8L5.46973 9.46967C5.17684 9.76256 5.17684 10.2374 5.46973 10.5303C5.76262 10.8232 6.2375 10.8232 6.53039 10.5303L8.00006 9.06066L9.4697 10.5303C9.76259 10.8232 10.2375 10.8232 10.5304 10.5303C10.8233 10.2374 10.8233 9.76253 10.5304 9.46964L9.06072 8L10.5304 6.53036C10.8233 6.23747 10.8233 5.7626 10.5304 5.4697C10.2375 5.17681 9.76259 5.17681 9.4697 5.4697L8.00006 6.93934L6.53039 5.46967C6.2375 5.17678 5.76262 5.17678 5.46973 5.46967Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
