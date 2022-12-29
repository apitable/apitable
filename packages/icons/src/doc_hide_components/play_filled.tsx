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

export const PlayFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12.0884 7.43025C12.5094 7.69341 12.5094 8.30662 12.0884 8.56978L6.02799 12.3575C5.58048 12.6372 5 12.3155 5 11.7878V4.21227C5 3.68454 5.58048 3.36281 6.02799 3.64251L12.0884 7.43025Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'play_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12.0884 7.43025C12.5094 7.69341 12.5094 8.30662 12.0884 8.56978L6.02799 12.3575C5.58048 12.6372 5 12.3155 5 11.7878V4.21227C5 3.68454 5.58048 3.36281 6.02799 3.64251L12.0884 7.43025Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
