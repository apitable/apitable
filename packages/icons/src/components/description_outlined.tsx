
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const DescriptionOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM13 3L3 3V13H13V3ZM4 6C4 5.44772 4.44772 5 5 5H8C8.55228 5 9 5.44772 9 6C9 6.55228 8.55228 7 8 7H5C4.44772 7 4 6.55228 4 6ZM5 9C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11H11C11.5523 11 12 10.5523 12 10C12 9.44772 11.5523 9 11 9H5Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'description_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM13 3L3 3V13H13V3ZM4 6C4 5.44772 4.44772 5 5 5H8C8.55228 5 9 5.44772 9 6C9 6.55228 8.55228 7 8 7H5C4.44772 7 4 6.55228 4 6ZM5 9C4.44772 9 4 9.44772 4 10C4 10.5523 4.44772 11 5 11H11C11.5523 11 12 10.5523 12 10C12 9.44772 11.5523 9 11 9H5Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
