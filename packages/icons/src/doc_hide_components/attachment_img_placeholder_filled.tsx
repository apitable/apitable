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

export const AttachmentImgPlaceholderFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M0 21C0 9.40202 8.36298 0 18.6792 0H311.321C321.637 0 330 9.40202 330 21V259C330 270.598 321.637 280 311.321 280H18.6793C8.36299 280 0 270.598 0 259V21Z" fill={ colors[0] }/>
    <path d="M77.8113 106.909C93.2753 106.909 105.811 94.3732 105.811 78.9092C105.811 63.4452 93.2753 50.9092 77.8113 50.9092C62.3473 50.9092 49.8113 63.4452 49.8113 78.9092C49.8113 94.3732 62.3473 106.909 77.8113 106.909Z" fill={ colors[3] } fillRule="evenodd" clipRule="evenodd"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="330" height="280">

      <path d="M0 21C0 9.40202 8.36298 0 18.6792 0H311.321C321.637 0 330 9.40202 330 21V259C330 270.598 321.637 280 311.321 280H18.6793C8.36299 280 0 270.598 0 259V21Z" fill="#A9DD5B"/>

    </mask>
    <g mask="url(#mask0)">

      <circle opacity="0.8" cx="78" cy="278" r="103" fill="#CBEE99"/>

      <circle opacity="0.7" cx="293.927" cy="249.308" r="160" fill="#CDF494"/>

    </g>

  </>,
  name: 'attachment_img_placeholder_filled',
  defaultColors: ['#A9DD5B', '#CBEE99', '#CDF494', 'white'],
  colorful: true,
  allPathData: ['M0 21C0 9.40202 8.36298 0 18.6792 0H311.321C321.637 0 330 9.40202 330 21V259C330 270.598 321.637 280 311.321 280H18.6793C8.36299 280 0 270.598 0 259V21Z', 'M77.8113 106.909C93.2753 106.909 105.811 94.3732 105.811 78.9092C105.811 63.4452 93.2753 50.9092 77.8113 50.9092C62.3473 50.9092 49.8113 63.4452 49.8113 78.9092C49.8113 94.3732 62.3473 106.909 77.8113 106.909Z'],
  width: '280',
  height: '280',
  viewBox: '0 0 280 280',
});
