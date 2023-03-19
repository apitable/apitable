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

export const AttentionFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2.75 2C2.75 1.58579 3.08579 1.25 3.5 1.25C9.7132 1.25 14.75 6.2868 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25C13.5858 13.25 13.25 12.9142 13.25 12.5C13.25 7.11522 8.88478 2.75 3.5 2.75C3.08579 2.75 2.75 2.41421 2.75 2Z" fill={ colors[0] }/>
    <path d="M2.75 7C2.75 6.58579 3.08579 6.25 3.5 6.25C6.95178 6.25 9.75 9.04822 9.75 12.5C9.75 12.9142 9.41421 13.25 9 13.25C8.58579 13.25 8.25 12.9142 8.25 12.5C8.25 9.87665 6.12335 7.75 3.5 7.75C3.08579 7.75 2.75 7.41421 2.75 7Z" fill={ colors[0] }/>
    <path d="M3.5 14C4.32843 14 5 13.3284 5 12.5C5 11.6716 4.32843 11 3.5 11C2.67157 11 2 11.6716 2 12.5C2 13.3284 2.67157 14 3.5 14Z" fill={ colors[0] }/>

  </>,
  name: 'attention_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M2.75 2C2.75 1.58579 3.08579 1.25 3.5 1.25C9.7132 1.25 14.75 6.2868 14.75 12.5C14.75 12.9142 14.4142 13.25 14 13.25C13.5858 13.25 13.25 12.9142 13.25 12.5C13.25 7.11522 8.88478 2.75 3.5 2.75C3.08579 2.75 2.75 2.41421 2.75 2Z', 'M2.75 7C2.75 6.58579 3.08579 6.25 3.5 6.25C6.95178 6.25 9.75 9.04822 9.75 12.5C9.75 12.9142 9.41421 13.25 9 13.25C8.58579 13.25 8.25 12.9142 8.25 12.5C8.25 9.87665 6.12335 7.75 3.5 7.75C3.08579 7.75 2.75 7.41421 2.75 7Z', 'M3.5 14C4.32843 14 5 13.3284 5 12.5C5 11.6716 4.32843 11 3.5 11C2.67157 11 2 11.6716 2 12.5C2 13.3284 2.67157 14 3.5 14Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
