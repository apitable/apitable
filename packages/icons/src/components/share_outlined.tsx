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

export const ShareOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.1766 2.8233L2.97308 6.40058L4.69312 8.12062L6.97056 7.19082C7.99563 6.77232 9.01836 7.79505 8.59986 8.82012L7.67006 11.0976L9.59936 13.0269L13.1766 2.8233ZM13.1706 1.23663C14.1592 0.890014 15.1099 1.84071 14.7633 2.82936L10.8829 13.8976C10.5783 14.7663 9.47088 15.0187 8.81995 14.3678L6.49257 12.0404C6.1368 11.6847 6.02909 11.1503 6.21926 10.6844L6.98719 8.8035L5.10623 9.57143C4.64043 9.7616 4.10601 9.65388 3.75025 9.29811L1.63213 7.17999C0.981193 6.52906 1.23361 5.42163 2.10232 5.11707L13.1706 1.23663Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'share_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M13.1766 2.8233L2.97308 6.40058L4.69312 8.12062L6.97056 7.19082C7.99563 6.77232 9.01836 7.79505 8.59986 8.82012L7.67006 11.0976L9.59936 13.0269L13.1766 2.8233ZM13.1706 1.23663C14.1592 0.890014 15.1099 1.84071 14.7633 2.82936L10.8829 13.8976C10.5783 14.7663 9.47088 15.0187 8.81995 14.3678L6.49257 12.0404C6.1368 11.6847 6.02909 11.1503 6.21926 10.6844L6.98719 8.8035L5.10623 9.57143C4.64043 9.7616 4.10601 9.65388 3.75025 9.29811L1.63213 7.17999C0.981193 6.52906 1.23361 5.42163 2.10232 5.11707L13.1706 1.23663Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
