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

export const ShareFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.2887 3.04627C13.764 2.86656 14.1334 3.23602 13.9537 3.71129L9.91028 14.4049C9.77855 14.7533 9.48973 15.1541 9.12793 14.9399C8.86722 14.7856 7.61683 12.5492 6.93842 11.3115C6.84432 11.1398 6.86009 10.9298 6.97756 10.7732L8.81714 8.32039C8.88531 8.22949 8.77048 8.11466 8.67958 8.18283L6.22679 10.0224C6.07016 10.1399 5.86018 10.1557 5.6885 10.0616C4.45076 9.38315 2.21445 8.1328 2.0601 7.87209C1.8459 7.51027 2.24669 7.22146 2.59507 7.08973L13.2887 3.04627Z" fill={ colors[0] }/>

  </>,
  name: 'share_filled',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.2887 3.04627C13.764 2.86656 14.1334 3.23602 13.9537 3.71129L9.91028 14.4049C9.77855 14.7533 9.48973 15.1541 9.12793 14.9399C8.86722 14.7856 7.61683 12.5492 6.93842 11.3115C6.84432 11.1398 6.86009 10.9298 6.97756 10.7732L8.81714 8.32039C8.88531 8.22949 8.77048 8.11466 8.67958 8.18283L6.22679 10.0224C6.07016 10.1399 5.86018 10.1557 5.6885 10.0616C4.45076 9.38315 2.21445 8.1328 2.0601 7.87209C1.8459 7.51027 2.24669 7.22146 2.59507 7.08973L13.2887 3.04627Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
