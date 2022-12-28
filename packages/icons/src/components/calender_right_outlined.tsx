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

export const CalenderRightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8.77297 5.53033C9.06586 5.23743 9.06586 4.76256 8.77297 4.46967L4.53033 0.227025C4.23744 -0.0658686 3.76256 -0.0658685 3.46967 0.227025C3.17678 0.519918 3.17678 0.994792 3.46967 1.28768L7.18198 5L3.46967 8.71231C3.17678 9.0052 3.17678 9.48007 3.46967 9.77297C3.76256 10.0659 4.23744 10.0659 4.53033 9.77297L8.77297 5.53033Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'calender_right_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8.77297 5.53033C9.06586 5.23743 9.06586 4.76256 8.77297 4.46967L4.53033 0.227025C4.23744 -0.0658686 3.76256 -0.0658685 3.46967 0.227025C3.17678 0.519918 3.17678 0.994792 3.46967 1.28768L7.18198 5L3.46967 8.71231C3.17678 9.0052 3.17678 9.48007 3.46967 9.77297C3.76256 10.0659 4.23744 10.0659 4.53033 9.77297L8.77297 5.53033Z'],
  width: '10',
  height: '10',
  viewBox: '0 0 10 10',
});
