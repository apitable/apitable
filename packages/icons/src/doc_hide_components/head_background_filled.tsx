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
    <path d="M30 61C46.5685 61 60 47.5685 60 31C60 14.4315 46.5685 1 30 1C13.4315 1 0 14.4315 0 31C0 47.5685 13.4315 61 30 61Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M50.6338 52.7778C45.2567 57.874 37.9937 61 30.0005 61C22.0073 61 14.7443 57.874 9.36719 52.7778C9.5364 41.5368 18.7094 33 30.0005 33C41.2915 33 50.4646 41.5368 50.6338 52.7778Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>
    <path d="M30 35C36.0751 35 41 30.0751 41 24C41 17.9249 36.0751 13 30 13C23.9249 13 19 17.9249 19 24C19 30.0751 23.9249 35 30 35Z" fill={ colors[1] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'head_background_filled',
  defaultColors: ['#2B68FF', '#EEF3FF'],
  colorful: true,
  allPathData: ['M30 61C46.5685 61 60 47.5685 60 31C60 14.4315 46.5685 1 30 1C13.4315 1 0 14.4315 0 31C0 47.5685 13.4315 61 30 61Z', 'M50.6338 52.7778C45.2567 57.874 37.9937 61 30.0005 61C22.0073 61 14.7443 57.874 9.36719 52.7778C9.5364 41.5368 18.7094 33 30.0005 33C41.2915 33 50.4646 41.5368 50.6338 52.7778Z', 'M30 35C36.0751 35 41 30.0751 41 24C41 17.9249 36.0751 13 30 13C23.9249 13 19 17.9249 19 24C19 30.0751 23.9249 35 30 35Z'],
  width: '62',
  height: '62',
  viewBox: '0 0 62 62',
});
