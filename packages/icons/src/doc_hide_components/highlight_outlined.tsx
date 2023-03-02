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

export const HighlightOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M5.85595 8.2701L5.94976 8.3639L2.81366 11.5H1.75C1.33579 11.5 1 11.8358 1 12.25C1 12.6642 1.33579 13 1.75 13H8C8.08551 13 8.16767 12.9857 8.24423 12.9593C8.36713 12.9528 8.48366 12.9011 8.57113 12.8136L9.48529 11.8994L9.57916 11.9933C9.93105 12.3452 10.4881 12.3848 10.8863 12.0862L14.9269 9.05574C15.4137 8.69061 15.4643 7.97894 15.034 7.54863L10.3006 2.81527C9.87031 2.38496 9.15865 2.43554 8.79352 2.92238L5.76306 6.96299C5.46447 7.36111 5.50406 7.9182 5.85595 8.2701ZM9.64761 4.28358L7.22325 7.51607L7.35801 7.65084L7.36402 7.65675L10.1924 10.4852L10.1984 10.4912L10.3332 10.626L13.5657 8.20164L9.64761 4.28358ZM4.97494 11.46L7.01042 9.42456L8.42463 10.8388L7.80336 11.46H4.97494Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'highlight_outlined',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M5.85595 8.2701L5.94976 8.3639L2.81366 11.5H1.75C1.33579 11.5 1 11.8358 1 12.25C1 12.6642 1.33579 13 1.75 13H8C8.08551 13 8.16767 12.9857 8.24423 12.9593C8.36713 12.9528 8.48366 12.9011 8.57113 12.8136L9.48529 11.8994L9.57916 11.9933C9.93105 12.3452 10.4881 12.3848 10.8863 12.0862L14.9269 9.05574C15.4137 8.69061 15.4643 7.97894 15.034 7.54863L10.3006 2.81527C9.87031 2.38496 9.15865 2.43554 8.79352 2.92238L5.76306 6.96299C5.46447 7.36111 5.50406 7.9182 5.85595 8.2701ZM9.64761 4.28358L7.22325 7.51607L7.35801 7.65084L7.36402 7.65675L10.1924 10.4852L10.1984 10.4912L10.3332 10.626L13.5657 8.20164L9.64761 4.28358ZM4.97494 11.46L7.01042 9.42456L8.42463 10.8388L7.80336 11.46H4.97494Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
