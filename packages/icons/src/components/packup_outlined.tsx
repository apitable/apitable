
/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const PackupOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M10 2H14C14.6 2 15 2.4 15 3V13C15 13.6 14.6 14 14 14H10C9.4 14 9 13.6 9 13V3C9 2.4 9.4 2 10 2ZM11 12H13V4H11V12ZM4.4 7H7C7.6 7 8 7.4 8 8C8 8.6 7.6 9 7 9H4.4L6.7 11.3C7.1 11.7 7.1 12.3 6.7 12.7C6.5 12.9 6.3 13 6 13C5.7 13 5.5 12.9 5.3 12.7L1.3 8.7C0.9 8.3 0.9 7.7 1.3 7.3L5.3 3.3C5.7 2.9 6.3 2.9 6.7 3.3C7.1 3.7 7.1 4.3 6.7 4.7L4.4 7Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'packup_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M10 2H14C14.6 2 15 2.4 15 3V13C15 13.6 14.6 14 14 14H10C9.4 14 9 13.6 9 13V3C9 2.4 9.4 2 10 2ZM11 12H13V4H11V12ZM4.4 7H7C7.6 7 8 7.4 8 8C8 8.6 7.6 9 7 9H4.4L6.7 11.3C7.1 11.7 7.1 12.3 6.7 12.7C6.5 12.9 6.3 13 6 13C5.7 13 5.5 12.9 5.3 12.7L1.3 8.7C0.9 8.3 0.9 7.7 1.3 7.3L5.3 3.3C5.7 2.9 6.3 2.9 6.7 3.3C7.1 3.7 7.1 4.3 6.7 4.7L4.4 7Z'],
  width: '16',
  height: '16',
  viewBox: '0 0 16 16',
});
