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

export const DownloadFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 1.5C8.41421 1.5 8.75 1.83579 8.75 2.25L8.75 9.43939L9.59098 8.59841C9.88387 8.30552 10.3587 8.30552 10.6516 8.59841C10.9445 8.8913 10.9445 9.36618 10.6516 9.65907L8.53032 11.7804C8.43792 11.8728 8.32742 11.936 8.21024 11.9701C8.18159 11.9785 8.15223 11.9852 8.12227 11.9901C8.04402 12.0029 7.96413 12.0034 7.88578 11.9914C7.85261 11.9863 7.82016 11.979 7.78857 11.9698C7.67182 11.9356 7.56174 11.8725 7.46966 11.7804L5.34834 9.65907C5.05544 9.36618 5.05544 8.8913 5.34834 8.59841C5.64123 8.30552 6.1161 8.30552 6.409 8.59841L7.25 9.43941L7.25 2.25C7.25 1.83579 7.58579 1.5 8 1.5Z" fill={ colors[0] }/>
    <path d="M1.5 13.75C1.5 13.3358 1.83579 13 2.25 13H13.75C14.1642 13 14.5 13.3358 14.5 13.75C14.5 14.1642 14.1642 14.5 13.75 14.5H2.25C1.83579 14.5 1.5 14.1642 1.5 13.75Z" fill={ colors[0] }/>

  </>,
  name: 'download_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M8 1.5C8.41421 1.5 8.75 1.83579 8.75 2.25L8.75 9.43939L9.59098 8.59841C9.88387 8.30552 10.3587 8.30552 10.6516 8.59841C10.9445 8.8913 10.9445 9.36618 10.6516 9.65907L8.53032 11.7804C8.43792 11.8728 8.32742 11.936 8.21024 11.9701C8.18159 11.9785 8.15223 11.9852 8.12227 11.9901C8.04402 12.0029 7.96413 12.0034 7.88578 11.9914C7.85261 11.9863 7.82016 11.979 7.78857 11.9698C7.67182 11.9356 7.56174 11.8725 7.46966 11.7804L5.34834 9.65907C5.05544 9.36618 5.05544 8.8913 5.34834 8.59841C5.64123 8.30552 6.1161 8.30552 6.409 8.59841L7.25 9.43941L7.25 2.25C7.25 1.83579 7.58579 1.5 8 1.5Z', 'M1.5 13.75C1.5 13.3358 1.83579 13 2.25 13H13.75C14.1642 13 14.5 13.3358 14.5 13.75C14.5 14.1642 14.1642 14.5 13.75 14.5H2.25C1.83579 14.5 1.5 14.1642 1.5 13.75Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
