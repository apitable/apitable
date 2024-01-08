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

export const CommentBgFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.3349 13.3323C10.4016 13.3323 8.00156 15.7323 8.00156 18.6656V45.3323C8.00156 48.2656 10.4016 50.6656 13.3349 50.6656H18.6682V54.6656C18.6682 56.5323 20.5349 57.8656 22.4016 57.0656L39.4682 50.3989H50.6682C53.6016 50.3989 56.0016 47.9989 56.0016 45.0656V18.6656C56.0016 15.7323 53.6016 13.3323 50.6682 13.3323H13.3349Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'comment_bg_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.3349 13.3323C10.4016 13.3323 8.00156 15.7323 8.00156 18.6656V45.3323C8.00156 48.2656 10.4016 50.6656 13.3349 50.6656H18.6682V54.6656C18.6682 56.5323 20.5349 57.8656 22.4016 57.0656L39.4682 50.3989H50.6682C53.6016 50.3989 56.0016 47.9989 56.0016 45.0656V18.6656C56.0016 15.7323 53.6016 13.3323 50.6682 13.3323H13.3349Z'],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});
