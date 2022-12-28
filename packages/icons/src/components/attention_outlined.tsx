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

export const AttentionOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M3 1C2.44772 1 2 1.44772 2 2C2 2.55228 2.44772 3 3 3C5.65217 3 8.1957 4.05357 10.0711 5.92893C11.9464 7.80429 13 10.3478 13 13C13 13.5523 13.4477 14 14 14C14.5523 14 15 13.5523 15 13C15 9.8174 13.7357 6.76515 11.4853 4.51472C9.23485 2.26428 6.1826 1 3 1ZM2 7C2 6.44772 2.44772 6 3 6C4.85652 6 6.63699 6.7375 7.94975 8.05025C9.2625 9.36301 10 11.1435 10 13C10 13.5523 9.55228 14 9 14C8.44772 14 8 13.5523 8 13C8 11.6739 7.47322 10.4021 6.53553 9.46447C5.59785 8.52678 4.32608 8 3 8C2.44772 8 2 7.55228 2 7ZM2 12.5C2 12.8978 2.15804 13.2794 2.43934 13.5607C2.72064 13.842 3.10218 14 3.5 14C3.89782 14 4.27936 13.842 4.56066 13.5607C4.84196 13.2794 5 12.8978 5 12.5C5 12.1022 4.84196 11.7206 4.56066 11.4393C4.27936 11.158 3.89782 11 3.5 11C3.10218 11 2.72064 11.158 2.43934 11.4393C2.15804 11.7206 2 12.1022 2 12.5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'attention_outlined',
  defaultColors: ['#8C8C8C'],
  colorful: false,
  allPathData: ['M3 1C2.44772 1 2 1.44772 2 2C2 2.55228 2.44772 3 3 3C5.65217 3 8.1957 4.05357 10.0711 5.92893C11.9464 7.80429 13 10.3478 13 13C13 13.5523 13.4477 14 14 14C14.5523 14 15 13.5523 15 13C15 9.8174 13.7357 6.76515 11.4853 4.51472C9.23485 2.26428 6.1826 1 3 1ZM2 7C2 6.44772 2.44772 6 3 6C4.85652 6 6.63699 6.7375 7.94975 8.05025C9.2625 9.36301 10 11.1435 10 13C10 13.5523 9.55228 14 9 14C8.44772 14 8 13.5523 8 13C8 11.6739 7.47322 10.4021 6.53553 9.46447C5.59785 8.52678 4.32608 8 3 8C2.44772 8 2 7.55228 2 7ZM2 12.5C2 12.8978 2.15804 13.2794 2.43934 13.5607C2.72064 13.842 3.10218 14 3.5 14C3.89782 14 4.27936 13.842 4.56066 13.5607C4.84196 13.2794 5 12.8978 5 12.5C5 12.1022 4.84196 11.7206 4.56066 11.4393C4.27936 11.158 3.89782 11 3.5 11C3.10218 11 2.72064 11.158 2.43934 11.4393C2.15804 11.7206 2 12.1022 2 12.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
