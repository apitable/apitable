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

export const ConnectOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1.75 1C1.33579 1 1 1.33579 1 1.75V5.75C1 6.16421 1.33579 6.5 1.75 6.5H8.25C8.66421 6.5 9 6.16421 9 5.75V4.74997L10.25 4.74988V7H9.24142C9.15233 7 9.10771 7.10771 9.17071 7.17071L10.9293 8.92929C10.9683 8.96834 11.0317 8.96834 11.0707 8.92929L12.8293 7.17071C12.8923 7.10771 12.8477 7 12.7586 7H11.75V3.99983C11.75 3.80091 11.671 3.61014 11.5303 3.46948C11.3896 3.32883 11.1989 3.24982 10.9999 3.24983L9 3.24997V1.75C9 1.33579 8.66421 1 8.25 1H1.75ZM2.5 5V2.5H7.5V5H2.5ZM7.75 9.28748C7.33579 9.28748 7 9.62327 7 10.0375V14.25C7 14.6642 7.33579 15 7.75 15H14.25C14.6642 15 15 14.6642 15 14.25V10.0375C15 9.62327 14.6642 9.28748 14.25 9.28748H7.75ZM8.5 13.5V10.7875H13.5V13.5H8.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'connect_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M1.75 1C1.33579 1 1 1.33579 1 1.75V5.75C1 6.16421 1.33579 6.5 1.75 6.5H8.25C8.66421 6.5 9 6.16421 9 5.75V4.74997L10.25 4.74988V7H9.24142C9.15233 7 9.10771 7.10771 9.17071 7.17071L10.9293 8.92929C10.9683 8.96834 11.0317 8.96834 11.0707 8.92929L12.8293 7.17071C12.8923 7.10771 12.8477 7 12.7586 7H11.75V3.99983C11.75 3.80091 11.671 3.61014 11.5303 3.46948C11.3896 3.32883 11.1989 3.24982 10.9999 3.24983L9 3.24997V1.75C9 1.33579 8.66421 1 8.25 1H1.75ZM2.5 5V2.5H7.5V5H2.5ZM7.75 9.28748C7.33579 9.28748 7 9.62327 7 10.0375V14.25C7 14.6642 7.33579 15 7.75 15H14.25C14.6642 15 15 14.6642 15 14.25V10.0375C15 9.62327 14.6642 9.28748 14.25 9.28748H7.75ZM8.5 13.5V10.7875H13.5V13.5H8.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
