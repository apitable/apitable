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

export const InviteBoxFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M18.5 1.5C17.0038 -0.370265 14.5 2.49996 13 4.00001V7.00002C14.5 7.50002 17.3658 7.41424 18.5 6.49999C19.9177 5.35719 20.5 4 18.5 1.5Z" fill={ colors[4] }/>
    <path d="M14 7.22247C15.5427 7.43595 17.5849 7.23761 18.5 6.49999C19.4042 5.77115 19.9685 4.9551 19.7399 3.81101C19.6645 3.70934 19.5846 3.60569 19.5 3.5C18.1315 1.7894 15.9201 4.04446 14.4049 5.58969C14.2634 5.73392 14.1281 5.87196 14 6.00002V7.22247Z" fill={ colors[0] }/>
    <path d="M5.5 1.5C6.99621 -0.370265 9.5 2.49996 11 4.00001V7.00002C9.5 7.50002 6.63418 7.41424 5.5 6.49999C4.08228 5.35719 3.5 4 5.5 1.5Z" fill={ colors[4] }/>
    <path d="M10 7.22247C8.45733 7.43595 6.4151 7.23761 5.50004 6.49999C4.59587 5.77115 4.0315 4.9551 4.2601 3.81101C4.33556 3.70934 4.41549 3.60569 4.50004 3.5C5.86852 1.7894 8.0799 4.04446 9.59519 5.58969C9.73662 5.73392 9.87199 5.87196 10 6.00002V7.22247Z" fill={ colors[0] }/>
    <path d="M3 10H21V21C21 22.1046 20.1046 23 19 23H5C3.89543 23 3 22.1046 3 21V10Z" fill={ colors[1] }/>
    <rect x="1" y="6" width="22" height="4" rx="2" fill={ colors[2] }/>
    <rect x="10" y="6" width="4" height="4" fill={ colors[4] }/>
    <rect x="10" y="10" width="4" height="13" fill={ colors[3] }/>
    <rect x="11" y="4" width="2" height="2" fill={ colors[3] }/>

  </>,
  name: 'invite_box_filled',
  defaultColors: ['#FBC508', '#FF708B', '#FF98AC', '#FFCD1E', '#FFDC62'],
  colorful: true,
  allPathData: ['M18.5 1.5C17.0038 -0.370265 14.5 2.49996 13 4.00001V7.00002C14.5 7.50002 17.3658 7.41424 18.5 6.49999C19.9177 5.35719 20.5 4 18.5 1.5Z', 'M14 7.22247C15.5427 7.43595 17.5849 7.23761 18.5 6.49999C19.4042 5.77115 19.9685 4.9551 19.7399 3.81101C19.6645 3.70934 19.5846 3.60569 19.5 3.5C18.1315 1.7894 15.9201 4.04446 14.4049 5.58969C14.2634 5.73392 14.1281 5.87196 14 6.00002V7.22247Z', 'M5.5 1.5C6.99621 -0.370265 9.5 2.49996 11 4.00001V7.00002C9.5 7.50002 6.63418 7.41424 5.5 6.49999C4.08228 5.35719 3.5 4 5.5 1.5Z', 'M10 7.22247C8.45733 7.43595 6.4151 7.23761 5.50004 6.49999C4.59587 5.77115 4.0315 4.9551 4.2601 3.81101C4.33556 3.70934 4.41549 3.60569 4.50004 3.5C5.86852 1.7894 8.0799 4.04446 9.59519 5.58969C9.73662 5.73392 9.87199 5.87196 10 6.00002V7.22247Z', 'M3 10H21V21C21 22.1046 20.1046 23 19 23H5C3.89543 23 3 22.1046 3 21V10Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});
