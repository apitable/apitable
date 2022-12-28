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

export const ClassroomOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 1C1.44772 1 1 1.44772 1 2V12C1 12.5523 1.44772 13 2 13H5.23802L4.35984 13.7318C3.93555 14.0853 3.87821 14.7159 4.23175 15.1402C4.5853 15.5644 5.21587 15.6218 5.64016 15.2682L8 13.3019L10.3598 15.2682C10.7841 15.6218 11.4147 15.5644 11.7682 15.1402C12.1218 14.7159 12.0644 14.0853 11.6402 13.7318L10.762 13H14C14.5523 13 15 12.5523 15 12V2C15 1.44772 14.5523 1 14 1H2ZM3 11V3H13V11H3ZM10.4415 7.34131C10.6967 7.18534 10.6967 6.81466 10.4415 6.65869L7.10858 4.62191C6.84204 4.45902 6.5 4.65085 6.5 4.96322V9.03678C6.5 9.34915 6.84204 9.54098 7.10858 9.37809L10.4415 7.34131Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'classroom_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 1C1.44772 1 1 1.44772 1 2V12C1 12.5523 1.44772 13 2 13H5.23802L4.35984 13.7318C3.93555 14.0853 3.87821 14.7159 4.23175 15.1402C4.5853 15.5644 5.21587 15.6218 5.64016 15.2682L8 13.3019L10.3598 15.2682C10.7841 15.6218 11.4147 15.5644 11.7682 15.1402C12.1218 14.7159 12.0644 14.0853 11.6402 13.7318L10.762 13H14C14.5523 13 15 12.5523 15 12V2C15 1.44772 14.5523 1 14 1H2ZM3 11V3H13V11H3ZM10.4415 7.34131C10.6967 7.18534 10.6967 6.81466 10.4415 6.65869L7.10858 4.62191C6.84204 4.45902 6.5 4.65085 6.5 4.96322V9.03678C6.5 9.34915 6.84204 9.54098 7.10858 9.37809L10.4415 7.34131Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
