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

export const CommunityOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13H11.2857V12.1991V11.7908L11.5715 11.4992C12.4562 10.5964 13 9.3627 13 8C13 5.23858 10.7614 3 8 3ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 9.75534 14.3528 11.3612 13.2857 12.5894V14V15H12.2857H8C4.13401 15 1 11.866 1 8ZM5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8ZM10 7C9.44772 7 9 7.44772 9 8C9 8.55228 9.44772 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'community_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M8 3C5.23858 3 3 5.23858 3 8C3 10.7614 5.23858 13 8 13H11.2857V12.1991V11.7908L11.5715 11.4992C12.4562 10.5964 13 9.3627 13 8C13 5.23858 10.7614 3 8 3ZM1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8C15 9.75534 14.3528 11.3612 13.2857 12.5894V14V15H12.2857H8C4.13401 15 1 11.866 1 8ZM5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8C7 8.55228 6.55228 9 6 9C5.44772 9 5 8.55228 5 8ZM10 7C9.44772 7 9 7.44772 9 8C9 8.55228 9.44772 9 10 9C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
