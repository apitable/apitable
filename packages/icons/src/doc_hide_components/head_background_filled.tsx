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

export const HeadBackgroundFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M30 60.5C46.5685 60.5 60 47.0685 60 30.5C60 13.9315 46.5685 0.5 30 0.5C13.4315 0.5 0 13.9315 0 30.5C0 47.0685 13.4315 60.5 30 60.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M50.6333 52.2778C45.2562 57.374 37.9932 60.5 30 60.5C22.0068 60.5 14.7438 57.374 9.3667 52.2778C9.53591 41.0368 18.7089 32.5 30 32.5C41.291 32.5 50.4641 41.0368 50.6333 52.2778Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M30 34.5C36.0751 34.5 41 29.5751 41 23.5C41 17.4249 36.0751 12.5 30 12.5C23.9249 12.5 19 17.4249 19 23.5C19 29.5751 23.9249 34.5 30 34.5Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'head_background_filled',
  defaultColors: ['#2B68FF', '#EEF3FF'],
  colorful: true,
  allPathData: ['M30 60.5C46.5685 60.5 60 47.0685 60 30.5C60 13.9315 46.5685 0.5 30 0.5C13.4315 0.5 0 13.9315 0 30.5C0 47.0685 13.4315 60.5 30 60.5Z', 'M50.6333 52.2778C45.2562 57.374 37.9932 60.5 30 60.5C22.0068 60.5 14.7438 57.374 9.3667 52.2778C9.53591 41.0368 18.7089 32.5 30 32.5C41.291 32.5 50.4641 41.0368 50.6333 52.2778Z', 'M30 34.5C36.0751 34.5 41 29.5751 41 23.5C41 17.4249 36.0751 12.5 30 12.5C23.9249 12.5 19 17.4249 19 23.5C19 29.5751 23.9249 34.5 30 34.5Z'],
  width: '61',
  height: '61',
  viewBox: '0 0 61 61',
});
