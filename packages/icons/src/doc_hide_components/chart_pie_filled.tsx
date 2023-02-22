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

export const ChartPieFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M66.9998 40C66.9998 35.1632 65.7005 30.4153 63.2378 26.2525C60.7751 22.0896 57.2393 18.6648 53.0002 16.3359C48.761 14.007 43.9741 12.8596 39.1398 13.0137C34.3055 13.1678 29.6013 14.6176 25.519 17.2117L39.9998 40H66.9998Z" fill={ colors[0] }/>
    <path d="M27.0347 63.6832C31.2774 66.0058 36.066 67.146 40.9001 66.9848C45.7341 66.8236 50.4361 65.3667 54.5145 62.7666C58.593 60.1665 61.8981 56.5185 64.0843 52.2041C66.2706 47.8896 67.2578 43.0671 66.9426 38.2407L40 39.9998L27.0347 63.6832Z" fill={ colors[1] }/>
    <path d="M26.7085 16.498C22.4984 18.879 19.0052 22.3472 16.5941 26.5401C14.1829 30.7331 12.9424 35.4967 13.0021 40.3331C13.0618 45.1695 14.4195 49.901 16.9335 54.0331C19.4474 58.1653 23.0251 61.5462 27.2927 63.8226L40 39.9998L26.7085 16.498Z" fill={ colors[2] }/>

  </>,
  name: 'chart_pie_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M66.9998 40C66.9998 35.1632 65.7005 30.4153 63.2378 26.2525C60.7751 22.0896 57.2393 18.6648 53.0002 16.3359C48.761 14.007 43.9741 12.8596 39.1398 13.0137C34.3055 13.1678 29.6013 14.6176 25.519 17.2117L39.9998 40H66.9998Z', 'M27.0347 63.6832C31.2774 66.0058 36.066 67.146 40.9001 66.9848C45.7341 66.8236 50.4361 65.3667 54.5145 62.7666C58.593 60.1665 61.8981 56.5185 64.0843 52.2041C66.2706 47.8896 67.2578 43.0671 66.9426 38.2407L40 39.9998L27.0347 63.6832Z', 'M26.7085 16.498C22.4984 18.879 19.0052 22.3472 16.5941 26.5401C14.1829 30.7331 12.9424 35.4967 13.0021 40.3331C13.0618 45.1695 14.4195 49.901 16.9335 54.0331C19.4474 58.1653 23.0251 61.5462 27.2927 63.8226L40 39.9998L26.7085 16.498Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
