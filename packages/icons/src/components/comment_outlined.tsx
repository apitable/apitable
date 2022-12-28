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

export const CommentOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 11V4H13V11H9.75C9.09074 11 8.46371 11.2601 8 11.7146C7.5363 11.2601 6.90926 11 6.25 11H3ZM1 3C1 2.44771 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V12C15 12.5523 14.5523 13 14 13H9.75C9.59262 13 9.44443 13.0741 9.35 13.2L8.4 14.4667C8.2 14.7333 7.8 14.7333 7.6 14.4667L6.65 13.2C6.55557 13.0741 6.40738 13 6.25 13H2C1.44772 13 1 12.5523 1 12V3ZM6 7.5C6 8.05228 5.55228 8.5 5 8.5C4.44772 8.5 4 8.05228 4 7.5C4 6.94772 4.44772 6.5 5 6.5C5.55228 6.5 6 6.94772 6 7.5ZM9 7.5C9 8.05228 8.55228 8.5 8 8.5C7.44772 8.5 7 8.05228 7 7.5C7 6.94772 7.44772 6.5 8 6.5C8.55228 6.5 9 6.94772 9 7.5ZM11 8.5C11.5523 8.5 12 8.05228 12 7.5C12 6.94772 11.5523 6.5 11 6.5C10.4477 6.5 10 6.94772 10 7.5C10 8.05228 10.4477 8.5 11 8.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'comment_outlined',
  defaultColors: ['black'],
  colorful: false,
  allPathData: ['M3 11V4H13V11H9.75C9.09074 11 8.46371 11.2601 8 11.7146C7.5363 11.2601 6.90926 11 6.25 11H3ZM1 3C1 2.44771 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V12C15 12.5523 14.5523 13 14 13H9.75C9.59262 13 9.44443 13.0741 9.35 13.2L8.4 14.4667C8.2 14.7333 7.8 14.7333 7.6 14.4667L6.65 13.2C6.55557 13.0741 6.40738 13 6.25 13H2C1.44772 13 1 12.5523 1 12V3ZM6 7.5C6 8.05228 5.55228 8.5 5 8.5C4.44772 8.5 4 8.05228 4 7.5C4 6.94772 4.44772 6.5 5 6.5C5.55228 6.5 6 6.94772 6 7.5ZM9 7.5C9 8.05228 8.55228 8.5 8 8.5C7.44772 8.5 7 8.05228 7 7.5C7 6.94772 7.44772 6.5 8 6.5C8.55228 6.5 9 6.94772 9 7.5ZM11 8.5C11.5523 8.5 12 8.05228 12 7.5C12 6.94772 11.5523 6.5 11 6.5C10.4477 6.5 10 6.94772 10 7.5C10 8.05228 10.4477 8.5 11 8.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
