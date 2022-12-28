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
    <path d="M67 40C67 35.1632 65.7007 30.4153 63.238 26.2525C60.7753 22.0896 57.2395 18.6648 53.0004 16.3359C48.7612 14.007 43.9743 12.8596 39.14 13.0137C34.3057 13.1678 29.6015 14.6176 25.5192 17.2117L40 40H67Z" fill={ colors[0] }/>
    <path d="M27.0347 63.6834C31.2774 66.006 36.066 67.1462 40.9001 66.985C45.7341 66.8238 50.4361 65.3669 54.5145 62.7668C58.593 60.1667 61.8981 56.5187 64.0843 52.2043C66.2706 47.8898 67.2578 43.0673 66.9426 38.2409L40 40L27.0347 63.6834Z" fill={ colors[1] }/>
    <path d="M26.7085 16.4982C22.4984 18.8792 19.0052 22.3474 16.5941 26.5403C14.1829 30.7333 12.9424 35.4969 13.0021 40.3333C13.0618 45.1697 14.4195 49.9012 16.9335 54.0333C19.4474 58.1655 23.0251 61.5464 27.2927 63.8228L40 40L26.7085 16.4982Z" fill={ colors[2] }/>

  </>,
  name: 'chart_pie_filled',
  defaultColors: ['#7B67EE', '#9CB9FF', '#FFBA2E'],
  colorful: true,
  allPathData: ['M67 40C67 35.1632 65.7007 30.4153 63.238 26.2525C60.7753 22.0896 57.2395 18.6648 53.0004 16.3359C48.7612 14.007 43.9743 12.8596 39.14 13.0137C34.3057 13.1678 29.6015 14.6176 25.5192 17.2117L40 40H67Z', 'M27.0347 63.6834C31.2774 66.006 36.066 67.1462 40.9001 66.985C45.7341 66.8238 50.4361 65.3669 54.5145 62.7668C58.593 60.1667 61.8981 56.5187 64.0843 52.2043C66.2706 47.8898 67.2578 43.0673 66.9426 38.2409L40 40L27.0347 63.6834Z', 'M26.7085 16.4982C22.4984 18.8792 19.0052 22.3474 16.5941 26.5403C14.1829 30.7333 12.9424 35.4969 13.0021 40.3333C13.0618 45.1697 14.4195 49.9012 16.9335 54.0333C19.4474 58.1655 23.0251 61.5464 27.2927 63.8228L40 40L26.7085 16.4982Z'],
  width: '80',
  height: '80',
  viewBox: '0 0 80 80',
});
