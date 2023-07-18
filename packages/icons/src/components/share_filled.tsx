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

export const ShareFilled: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M12 1.5C10.6193 1.5 9.5 2.61929 9.5 4C9.5 4.19775 9.52296 4.39015 9.56636 4.57465L7.19521 5.85903C6.59951 5.17924 5.72488 4.75 4.75 4.75C2.95507 4.75 1.5 6.20507 1.5 8C1.5 9.79493 2.95507 11.25 4.75 11.25C5.70121 11.25 6.55697 10.8414 7.15131 10.1901L10.0475 11.7879C10.0164 11.9371 10 12.0916 10 12.25C10 13.4926 11.0074 14.5 12.25 14.5C13.4926 14.5 14.5 13.4926 14.5 12.25C14.5 11.0074 13.4926 10 12.25 10C11.7109 10 11.2161 10.1896 10.8286 10.5057L7.87979 8.87881C7.95811 8.59929 8 8.30454 8 8C8 7.71849 7.96421 7.44534 7.89693 7.18485L10.3345 5.86449C10.7767 6.25972 11.3603 6.5 12 6.5C13.3807 6.5 14.5 5.38071 14.5 4C14.5 2.61929 13.3807 1.5 12 1.5Z" fill={ colors[0] }/>

  </>,
  name: 'share_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M12 1.5C10.6193 1.5 9.5 2.61929 9.5 4C9.5 4.19775 9.52296 4.39015 9.56636 4.57465L7.19521 5.85903C6.59951 5.17924 5.72488 4.75 4.75 4.75C2.95507 4.75 1.5 6.20507 1.5 8C1.5 9.79493 2.95507 11.25 4.75 11.25C5.70121 11.25 6.55697 10.8414 7.15131 10.1901L10.0475 11.7879C10.0164 11.9371 10 12.0916 10 12.25C10 13.4926 11.0074 14.5 12.25 14.5C13.4926 14.5 14.5 13.4926 14.5 12.25C14.5 11.0074 13.4926 10 12.25 10C11.7109 10 11.2161 10.1896 10.8286 10.5057L7.87979 8.87881C7.95811 8.59929 8 8.30454 8 8C8 7.71849 7.96421 7.44534 7.89693 7.18485L10.3345 5.86449C10.7767 6.25972 11.3603 6.5 12 6.5C13.3807 6.5 14.5 5.38071 14.5 4C14.5 2.61929 13.3807 1.5 12 1.5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
