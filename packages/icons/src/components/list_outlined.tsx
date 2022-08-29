
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ListOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3C14 3.55228 13.5523 4 13 4H3C2.44772 4 2 3.55228 2 3ZM2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'list_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3C14 3.55228 13.5523 4 13 4H3C2.44772 4 2 3.55228 2 3ZM2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8ZM3 12C2.44772 12 2 12.4477 2 13C2 13.5523 2.44772 14 3 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H3Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
