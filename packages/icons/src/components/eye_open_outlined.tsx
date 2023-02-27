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

export const EyeOpenOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M9.75 8C9.75 8.9665 8.9665 9.75 8 9.75C7.0335 9.75 6.25 8.9665 6.25 8C6.25 7.0335 7.0335 6.25 8 6.25C8.9665 6.25 9.75 7.0335 9.75 8Z" fill={ colors[0] }/>
    <path d="M8 3C6.08192 3 4.52684 3.89532 3.40981 4.85522C2.29196 5.81583 1.55559 6.88863 1.2552 7.3671C1.01087 7.75629 1.01087 8.24371 1.2552 8.63289C1.55559 9.11137 2.29196 10.1842 3.40981 11.1448C4.52684 12.1047 6.08192 13 8 13C9.91809 13 11.4732 12.1047 12.5902 11.1448C13.708 10.1842 14.4444 9.11137 14.7448 8.6329C14.9891 8.24371 14.9891 7.75629 14.7448 7.36711C14.4444 6.88863 13.708 5.81583 12.5902 4.85522C11.4732 3.89532 9.91809 3 8 3ZM4.38744 10.0071C3.53975 9.27868 2.93876 8.4641 2.6318 8C2.93876 7.5359 3.53975 6.72132 4.38744 5.99287C5.348 5.16743 6.56824 4.5 8 4.5C9.43177 4.5 10.652 5.16743 11.6126 5.99287C12.4603 6.72132 13.0612 7.5359 13.3682 8C13.0612 8.4641 12.4603 9.27868 11.6126 10.0071C10.652 10.8326 9.43177 11.5 8 11.5C6.56824 11.5 5.348 10.8326 4.38744 10.0071Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'eye_open_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M9.75 8C9.75 8.9665 8.9665 9.75 8 9.75C7.0335 9.75 6.25 8.9665 6.25 8C6.25 7.0335 7.0335 6.25 8 6.25C8.9665 6.25 9.75 7.0335 9.75 8Z', 'M8 3C6.08192 3 4.52684 3.89532 3.40981 4.85522C2.29196 5.81583 1.55559 6.88863 1.2552 7.3671C1.01087 7.75629 1.01087 8.24371 1.2552 8.63289C1.55559 9.11137 2.29196 10.1842 3.40981 11.1448C4.52684 12.1047 6.08192 13 8 13C9.91809 13 11.4732 12.1047 12.5902 11.1448C13.708 10.1842 14.4444 9.11137 14.7448 8.6329C14.9891 8.24371 14.9891 7.75629 14.7448 7.36711C14.4444 6.88863 13.708 5.81583 12.5902 4.85522C11.4732 3.89532 9.91809 3 8 3ZM4.38744 10.0071C3.53975 9.27868 2.93876 8.4641 2.6318 8C2.93876 7.5359 3.53975 6.72132 4.38744 5.99287C5.348 5.16743 6.56824 4.5 8 4.5C9.43177 4.5 10.652 5.16743 11.6126 5.99287C12.4603 6.72132 13.0612 7.5359 13.3682 8C13.0612 8.4641 12.4603 9.27868 11.6126 10.0071C10.652 10.8326 9.43177 11.5 8 11.5C6.56824 11.5 5.348 10.8326 4.38744 10.0071Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
