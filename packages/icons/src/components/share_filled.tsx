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
    <path d="M10.8828 13.8976C10.5782 14.7663 9.47082 15.0187 8.81988 14.3678L6.49251 12.0404C6.13674 11.6847 6.02903 11.1503 6.2192 10.6844L6.98713 8.8035L5.10617 9.57143C4.64037 9.7616 4.10595 9.65388 3.75019 9.29811L1.63206 7.17999C0.981132 6.52906 1.23355 5.42163 2.10226 5.11706L13.1705 1.23663C14.1592 0.890014 15.1099 1.84071 14.7633 2.82936L10.8828 13.8976Z" fill={ colors[0] }/>

  </>,
  name: 'share_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M10.8828 13.8976C10.5782 14.7663 9.47082 15.0187 8.81988 14.3678L6.49251 12.0404C6.13674 11.6847 6.02903 11.1503 6.2192 10.6844L6.98713 8.8035L5.10617 9.57143C4.64037 9.7616 4.10595 9.65388 3.75019 9.29811L1.63206 7.17999C0.981132 6.52906 1.23355 5.42163 2.10226 5.11706L13.1705 1.23663C14.1592 0.890014 15.1099 1.84071 14.7633 2.82936L10.8828 13.8976Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
